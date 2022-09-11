import styles from "../../styles/nft.module.css";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Contract, utils, ethers, BigNumber } from "ethers";
import { marketplaceABI, nftABI } from "../../constants/ABIs";
import { BsThreeDots, BsGlobe, BsTwitter, BsTelegram } from "react-icons/bs";
import Link from "next/link";

export default function Home({ nftId, listings }) {
  const router = useRouter();
  const { collection } = router.query;
  const { library, active } = useWeb3React();
  const [runEffect, setRunEffect] = useState(false);
  setTimeout(() => {
    setRunEffect((val) => !val);
  }, 300);
  if (active) {
    setTimeout(() => {
      setRunEffect((val) => !val);
    }, 2000);
  }
  const provider = library;
  const [visibility, setVisibility] = useState(false);
  useEffect(() => {
    const main = async () => {
      const tokenId = nftId.map((nft) => nft.hex);
      const addresses = listings.map((list) => list[0]);
      const listingInfo = listings.map((list) => list[1].hex);
      const itemId = tokenId.map((token) => parseInt(token, 16));
      const prices = listingInfo.map((listing) => parseInt(listing, 16));
      const value = prices.map((p) => {
        const v = BigNumber.from(p.toString());
        return utils.formatEther(v);
      });
      const lowestValue =
        value.length > 0 &&
        value.reduce((acc, cur) => (Number(acc) < Number(cur) ? acc : cur));
      const allOffers = await itemId.map(async (item) => {
        const contract = new Contract(marketContract, marketplaceABI, provider);
        const x = await contract.availableOffers(collection, item.toString());
        const r = x[1].map((xs) => xs[1]);
        const offers = r.map((v) => {
          const hexValue = v._hex;
          return parseInt(hexValue, 16);
        });
        const offerValues = offers.map((offer) => {
          const v = BigNumber.from(offer.toString());
          return utils.formatEther(v);
        });
        return offerValues;
      });
      const offers = [];
      for (let i = 0; i < allOffers.length; i++) {
        offers.push(await allOffers[i]);
      }
      const bestOffers = offers.map(
        (offer) =>
          Array.isArray(offer) &&
          offer.reduce((cur, prev) =>
            Number(cur) > Number(prev) ? Number(cur) : Number(prev)
          )
      );
      const highestOffer =
        bestOffers.length > 0 &&
        bestOffers.reduce((acc, cur) =>
          Number(acc) > Number(cur) ? Number(acc) : Number(cur)
        );
      const imageLinks = await itemId.map(async (item) => {
        const contract = new Contract(collection, nftABI, provider);
        const x = await contract.tokenURI(item.toString());
        const link = x.replace(
          "ipfs://",
          "https://distant.mypinata.cloud/ipfs/"
        );
        const d = await fetch(link).then((r) => r.json());
        const i = d.image.replace(
          "ipfs://",
          "https://distant.mypinata.cloud/ipfs/"
        );
        const supply = await contract.totalSupply();
        const totalSupply = parseInt(supply._hex, 16);
        setStats({
          highestOffer: highestOffer,
          floor: lowestValue,
          supply: totalSupply,
          listed: itemId.length,
        });
        return i;
      });
      const arr = [];
      for (let i = 0; i < value.length; i++) {
        const object = {
          tokenId: itemId[i],
          seller: addresses[i],
          price: value[i],
          image: await imageLinks[i],
          bestOffer: bestOffers[i],
        };
        arr.push(object);
      }
      setListedNFTs(arr);
    };
    main();
  }, [runEffect]);
  const [linkShow, setLinkShow] = useState(false);
  const [stats, setStats] = useState({});
  const marketContract = "0x9c05dd334787dE014f2Fa5744381Eb20699236FF";
  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setLinkShow(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  const [listedNFTs, setListedNFTs] = useState([]);
  const [view, setView] = useState(false);
  // setTimeout(() => {
  //   setView(false);
  // }, 3000);

  return (
    <>
      {view ? (
        <h1>Welcome</h1>
      ) : (
        <>
          <div className={styles.banner}>
            <div className={styles.bannerImage}>
              <Image
                src="/2818.png"
                objectFit="cover"
                layout="fill"
                alt="2818"
              />
              <div className={styles.bannerContent}>
                <div className={styles.bannerContentImage}>
                  <Image
                    src="/2818.png"
                    objectFit="cover"
                    layout="fill"
                    alt="2818"
                  />
                </div>
                <div className={styles.bannerContentDetails}>
                  <h1>Lomen NFT</h1>
                  <p>
                    The AceLands Collection is a collection of 5000 unique
                    AceLands NFTs on the KCC Network.{" "}
                    {visibility && (
                      <span>
                        The collection is available in 5 volumes - with each
                        volume significantly different from the other in terms
                        of utilities.
                      </span>
                    )}
                  </p>
                  <p
                    className={styles.pointer}
                    onClick={() => setVisibility((visible) => !visible)}
                  >
                    {visibility ? "See less..." : "See more..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.description}>
            <div className={styles.stats}>
              <div>
                <h3>{stats.supply}</h3>
                <p>Items</p>
              </div>
              <div>
                <h3>{stats.listed}</h3>
                <p>Listed</p>
              </div>
              <div>
                <h3>-</h3>
                <p>Trade Volume</p>
              </div>
              <div>
                <h3>${stats.floor}</h3>
                <p>Floor Price</p>
              </div>
              <div>
                <h3>${stats.highestOffer}</h3>
                <p>Best Offer</p>
              </div>
            </div>
            <div
              className={styles.links}
              onClick={() => setLinkShow((link) => !link)}
              ref={menuRef}
            >
              {!linkShow && <BsThreeDots />}
              {linkShow && (
                <ul>
                  <Link
                    href={`https://scan-testnet.kcc.network/address/${collection}`}
                  >
                    <a target="_blank" rel="noopener noreferrer">
                      <li>
                        <BsGlobe />
                      </li>
                    </a>
                  </Link>
                  <Link href="https://twitter.com/Distant_Finance">
                    <a target="_blank">
                      <li>
                        <BsTwitter />
                      </li>
                    </a>
                  </Link>
                  <Link href="https://t.me/Distant_Finance">
                    <a target="_blank">
                      <li>
                        <BsTelegram />
                      </li>
                    </a>
                  </Link>
                </ul>
              )}
            </div>
          </div>
          <div className={styles.nfts}>
            <div className={styles.nftFlex}>
              {listedNFTs.map((nft) => {
                return (
                  <Link
                    key={nft.tokenId}
                    href={`/collection/${collection}/${nft.tokenId}`}
                    prefetch={false}
                  >
                    <a className={styles.nft}>
                      <div className={styles.nft}>
                        <div className={styles.nftImage}>
                          <Image
                            src={nft.image}
                            alt={nft.image}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className={styles.content}>
                          <h2>#{nft.tokenId}</h2>
                          <p>
                            <span>Price</span> ${nft.price}
                          </p>
                          <p>Best Offer ${nft.bestOffer}</p>
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>{" "}
        </>
      )}
    </>
  );
}

export async function getServerSideProps({ params, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=43200, stale-while-revalidate=60"
  );
  const collection = params.collection;
  const Tkcc = "https://rpc-testnet.kcc.network";
  const marketContract = "0x9c05dd334787dE014f2Fa5744381Eb20699236FF";
  const provider = new ethers.providers.JsonRpcProvider(Tkcc);
  const contract = new Contract(marketContract, marketplaceABI, provider);
  const results = await contract.availableListings(collection);
  const nftId = results[0];
  const listingInfo = results[1];
  return {
    props: {
      nftId: JSON.parse(JSON.stringify(nftId)),
      listings: JSON.parse(JSON.stringify(listingInfo)),
    },
  };
}
