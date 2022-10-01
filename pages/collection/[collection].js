import styles from "../../styles/nft.module.css";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Contract, utils, BigNumber } from "ethers";
import { nftABI, contracts } from "../../constants/ABIs";
import { BsThreeDots, BsGlobe, BsTwitter, BsTelegram } from "react-icons/bs";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  AiOutlineCheckCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai";

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
  // States
  const [listedNFTs, setListedNFTs] = useState([]);
  const [linkShow, setLinkShow] = useState(false);
  const [stats, setStats] = useState({});
  const [visibility, setVisibility] = useState(false);
  const [runEffect, setRunEffect] = useState(false);
  // Other hooks
  const router = useRouter();
  const { collection } = router.query;
  const { active, library } = useWeb3React();
  const provider = library;
  // Array dependency function
  const init = setTimeout(() => {
    setRunEffect(true);
  }, 300);
  if (active) {
    setTimeout(() => {
      setRunEffect(false);
    }, 2000);
    clearTimeout(init);
  }

  useEffect(() => {
    const main = async () => {
      try {
        // Destructure serverSide data
        const tokenId = nftId.map((nft) => nft.hex);
        const addresses = listings.map((list) => list[0]);
        const listingInfo = listings.map((list) => BigNumber.from(list[1].hex));
        const itemId = tokenId.map((token) => parseInt(token, 16));
        const prices = listingInfo.map((listing) => utils.formatEther(listing));
        // Floor price
        const lowestValue =
          prices.length > 0 &&
          prices.reduce((acc, cur) => (Number(acc) < Number(cur) ? acc : cur));
        //Get all offers
        const allOffers = await itemId.map(async (item) => {
          const x = await contracts.contractInstance.availableOffers(
            collection,
            item.toString()
          );
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
        // Await results of all offers
        const offers = [];
        for (let i = 0; i < allOffers.length; i++) {
          offers.push(await allOffers[i]);
        }
        // Best offers for each NFT
        const bestOffers = offers.map((offer) => {
          if (offer.length > 1) {
            return offer.reduce((cur, prev) =>
              Number(cur) > Number(prev) ? Number(cur) : Number(prev)
            );
          }
          return offer;
        });
        // Highest offer for all listed NFTs
        const highestOffer =
          bestOffers.length > 0 &&
          bestOffers.reduce((acc, cur) =>
            Number(acc) > Number(cur) ? Number(acc) : Number(cur)
          );
        const names = [];
        // Call data from contracts for the NFts
        const contract = new Contract(collection, nftABI, provider);
        const imageLinks = await itemId.map(async (item) => {
          const x = await contract.tokenURI(item.toString());
          const link = x.includes("ipfs://", 0)
            ? x.replace("ipfs://", "https://ipfsfiles.distant.finance/ipfs/")
            : x;
          const d = await fetch(link).then((r) => r.json());
          const i = d.image.includes("ipfs://", 0)
            ? d.image.replace(
                "ipfs://",
                "https://ipfsfiles.distant.finance/ipfs/"
              )
            : d.image;
          const n = d.name;
          names.push(n);
          setStats({
            highestOffer: highestOffer,
            floor: lowestValue,
            listed: itemId.length,
          });
          return i;
        });
        // All data for each NFT
        const arr = [];
        for (let i = 0; i < addresses.length; i++) {
          const object = {
            tokenId: itemId[i],
            seller: addresses[i],
            price: prices[i],
            image: await imageLinks[i],
            bestOffer: bestOffers[i],
            name: names[i],
          };
          arr.push(object);
        }
        setListedNFTs(arr);
      } catch (error) {
        console.log(error);
      }
    };
    main();
  }, [runEffect]);
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
                <h3>{obj.tradeVolume > 0 ? `$${obj.tradeVolume}` : "-"}</h3>
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
                                <span>
                                  <AiOutlineCheckCircle />{" "}
                                  <AiOutlineExclamationCircle />
                                </span>
                                <span>
                                  <p>
                                    {nft.seller.slice(0, 4)}...
                                    {nft.seller.slice(35, 39)}
                                  </p>
                                </span>
                              </div>
                              <div className={styles.firstLayerButtom}>
                                <p>
                                  {" "}
                                  <h3>{nft.name}</h3>
                                </p>
                              </div>
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
                                <em>
                                  List Price: <span>{`$${nft.price}`}</span>
                                </em>
                              </p>
                              <p>
                                {nft.bestOffer.length > 0 && (
                                  <em>
                                    Best Offer:{" "}
                                    <span>{`$${nft.bestOffer}`}</span>
                                  </em>
                                )}
                              </p>
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
  const contract = contracts.contractInstance;
  const client = new ApolloClient({
    uri: contracts.queryUrl,
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
  const url = tokens[1].tokenURI.includes("ipfs://", 0)
    ? tokens[1].tokenURI.replace(
        "ipfs://",
        "https://distant.mypinata.cloud/ipfs/"
      )
    : tokens[1].tokenURI;
  const image_attributes = await fetch(url).then((res) => res.json());
  const imageUrl = image_attributes.image.includes("ipfs://", 0)
    ? image_attributes.image.replace(
        "ipfs://",
        "https://distant.mypinata.cloud/ipfs/"
      )
    : image_attributes.image;
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
