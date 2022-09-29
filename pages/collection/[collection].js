import styles from "../../styles/nft.module.css";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Contract, utils, ethers, BigNumber } from "ethers";
import { marketplaceABI, nftABI, contracts } from "../../constants/ABIs";
import { BsThreeDots, BsGlobe, BsTwitter, BsTelegram } from "react-icons/bs";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from "react-icons/ai";

  

const APIURL = "https://api.thegraph.com/subgraphs/name/steffqing/721-clone";
const collectionDataQuery = `
  query collectionDataQuery($address: ID){
    collection(id: $address){
      name
      totalSupply
      totalVolume
      tokens{
        tokenURI
      }
    }
  }
`;

export default function Home({ nftId, listings, obj }) {
  const router = useRouter();
  const { collection } = router.query;
  const { library, active } = useWeb3React();
  const [runEffect, setRunEffect] = useState(false);
  const init = setTimeout(() => {
    setRunEffect(true);
  }, 300);
  if (active) {
    setTimeout(() => {
      setRunEffect(false);
    }, 2000);
    clearTimeout(init);
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
      const bestOffers = offers.map((offer) => {
        if (offer.length > 1) {
          return offer.reduce((cur, prev) =>
            Number(cur) > Number(prev) ? Number(cur) : Number(prev)
          );
        }
        return offer;
      });
      const highestOffer =
        bestOffers.length > 0 &&
        bestOffers.reduce((acc, cur) =>
          Number(acc) > Number(cur) ? Number(acc) : Number(cur)
        );
      const names = [];
      
      const contract = new Contract(collection, nftABI, provider);
      const imageLinks = await itemId.map(async (item) => {
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
        const n = d.name;
        names.push(n);
        const supply = await contract.totalSupply();
        const totalSupply = parseInt(supply._hex, 16);
        setStats({
          highestOffer: highestOffer,
          floor: lowestValue,
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
          name: names[i],
        };
        arr.push(object);
      }
      setListedNFTs(arr);
    };
    main();
  }, [runEffect]);
  const [linkShow, setLinkShow] = useState(false);
  const [stats, setStats] = useState({});
  const marketContract = contracts.marketplace;
  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      try {
        if (!menuRef.current.contains(e.target)) {
          setLinkShow(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  const [listedNFTs, setListedNFTs] = useState([]);

  return (
    <>
      {!active ? (
        <h1 className={styles.notActive}>Please Connect Wallet first</h1>
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
                    src={obj.smallImage}
                    objectFit="cover"
                    layout="fill"
                    alt={obj.description}
                  />
                </div>
                <div className={styles.bannerContentDetails}>
                  <h1>{obj.name}</h1>
                  <p>
                    {obj.description.substr(0, 100)}
                    {!visibility && "..."}
                    {visibility && (
                      <span>
                        {obj.description.substr(100, obj.description.length)}
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
                <h3>{obj.totalSupply ? `${obj.totalSupply}` : "-"}</h3>
                <p>Items</p>
              </div>
              <div>
                <h3>{stats.listed ? `${stats.listed}` : "-"}</h3>
                <p>Listed</p>
              </div>
              <div>
                <h3>{obj.tradeVolume ? `${obj.tradeVolume}` : "-"}</h3>
                <p>Trade Volume</p>
              </div>
              <div>
                <h3>{stats.floor ? `$${stats.floor}` : "-"}</h3>
                <p>Floor Price</p>
              </div>
              <div>
                <h3>
                  {stats.highestOffer > 0 ? `$${stats.highestOffer}` : "-"}
                </h3>
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
              {listedNFTs.length < 1 ? (
                <h1 style={{ textAlign: "center" }}>Loading...</h1>
              ) : (
                listedNFTs.map((nft) => {

                  return (
                    <Link
                      key={nft.tokenId}
                      href={`/collection/${collection}/${nft.tokenId}`}
                      prefetch={false}
                    >
                      <a className={styles.nft}>
                        <div className={styles.nft}>
                          <div className={styles.nftImage}>
                            <div className={styles.firstLayer}>
                              <div className={styles.firstLayerTop}>
                                <span><AiOutlineCheckCircle/> <AiOutlineExclamationCircle/></span> 
                                <span><p>{nft.seller.slice(0,4)}...{nft.seller.slice(35,39)}</p></span>
                              </div>
                              <div className={styles.firstLayerButtom}><p> <h3>{nft.name}</h3></p></div>
                            </div>

                            <div className={styles.image}>
                                <Image
                                src={nft.image}
                                alt={nft.tokenId}
                                layout="fill"
                                objectFit="cover"
                                />
                            </div>
                            
                          </div>
                          <div className={styles.content}>
                           <div className={styles.contentCont}>
                              <p>
                                <span>Price</span> ${nft.price}
                              </p>
                              <p><span>Best Offer</span> {nft.bestOffer && `$${nft.bestOffer}`}</p>

                           </div>
                            
                          </div>
                        </div>
                      </a>
                    </Link>
                  );
                })
              )}
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
  let objectData = {};
  const collection = params.collection;
  const marketContract = contracts.marketplace;
  const provider = new ethers.providers.JsonRpcProvider(contracts.mumbai);
  const contract = new Contract(marketContract, marketplaceABI, provider);
  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  });
  client
    .query({
      query: gql(collectionDataQuery),
      variables: {
        address: collection.toLowerCase(),
      },
    })
    .then((data) => {
      let content = data.data.collection;
      objectData = content;
    })
    .catch((err) => console.log("Error fetching data: ", err));
  const results = await contract.availableListings(collection);
  const nftId = results[0];
  const listingInfo = results[1];
  const { totalSupply, tokens, totalVolume, name } = objectData;
  const url = tokens[1].tokenURI.replace(
    "ipfs://",
    "https://distant.mypinata.cloud/ipfs/"
  );
  const image_attributes = await fetch(url).then((res) => res.json());
  const imageUrl = image_attributes.image.replace(
    "ipfs://",
    "https://distant.mypinata.cloud/ipfs/"
  );
  const obj = {
    totalSupply: totalSupply,
    tradeVolume: totalVolume,
    smallImage: imageUrl,
    description: image_attributes.description,
    name: name,
  };
  return {
    props: {
      nftId: JSON.parse(JSON.stringify(nftId)),
      listings: JSON.parse(JSON.stringify(listingInfo)),
      obj: obj,
    },
  };
}
