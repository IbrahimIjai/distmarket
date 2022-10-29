import styles from "../../styles/nft.module.css";
import { useWeb3React } from "@web3-react/core";
import MyLoader from "../../components/Skeleton";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Contract, utils, BigNumber } from "ethers";
import { nftABI, contracts } from "../../constants/ABIs";
import { BsThreeDots, BsGlobe, BsTwitter, BsTelegram } from "react-icons/bs";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Shimmer from "../../components/Shimmer";

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
  console.log(obj);
  // States
  const [listedNFTs, setListedNFTs] = useState([]);
  const [linkShow, setLinkShow] = useState(false);
  const [stats, setStats] = useState({});
  const [visibility, setVisibility] = useState(false);
  const [runEffect, setRunEffect] = useState(false);
  const [load, setLoad] = useState(true);
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
        // Get Approval
        const contract = new Contract(collection, nftABI, provider);
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
          names.push(d.name);
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
        <h1 className={styles.notActive}>Connect Your Wallet</h1>
      ) : (
        <>
          {/* {load && <Loading />} */}
          <div className={styles.banner}>
            <div className={styles.bannerImage}>
              <Image
                src={obj.bannerImage}
                objectFit="cover"
                layout="fill"
                alt={`Banner image for ${obj.name}`}
              />
              <div className={styles.bannerContent}>
                <div className={styles.bannerContentImage}>
                  <Image
                    src={obj.smallImage}
                    objectFit="cover"
                    layout="fill"
                    alt={`Placeholder image for ${obj.name}`}
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
                  <Link href={obj.twitter}>
                    <a target="_blank">
                      <li>
                        <BsTwitter />
                      </li>
                    </a>
                  </Link>
                  <Link href={obj.telegram}>
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

          {nftId === null ? (
            <div className={styles.notActive} style={{ height: "50vh" }}>
              No Listed Item found
            </div>
          ) : (
            <div className={styles.nfts}>
              <div className={styles["nftFlex"] + " " + styles["nftGrid"]}>
                {listedNFTs.length > 0 &&
                  listedNFTs.map((nft) => {
                    return (
                      <div className={styles.card} key={nft.tokenId}>
                        <Link
                          href={`/collection/${collection}/${nft.tokenId}`}
                          prefetch={false}
                        >
                          <a>
                            <div className={styles.nftCard}>
                              <div className={styles.nft}>
                                <div className={styles.holster}>
                                  {" "}
                                  <Image
                                    src={nft.image}
                                    alt={nft.tokenId}
                                    layout="fill"
                                    objectFit="cover"
                                    className={styles.image}
                                  />
                                  <div className={styles.overlay}>
                                    <div className={styles.topOverlay}>
                                      <div className={styles.approvalClass}>
                                        {/* <AiOutlineCheckCircle />{" "}
                                  <AiOutlineExclamationCircle /> */}
                                        <div className={styles.indicator}></div>
                                      </div>
                                      <div className={styles.approvalText}>
                                        {" "}
                                        <p>Active</p>
                                      </div>
                                    </div>
                                    <div className={styles.bottomOverlay}>
                                      <h1>{nft.name}</h1>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.content}>
                                <div className={styles.contentPrice}>
                                  <p>
                                    List Price: <span>{`$${nft.price}`}</span>
                                  </p>
                                  {nft.bestOffer.length > 0 && (
                                    <p>
                                      Best Offer:{" "}
                                      <span>{`$${nft.bestOffer}`}</span>
                                    </p>
                                  )}
                                </div>
                                <div className={styles.contentSeller}>
                                  {nft.seller.slice(0, 4)}...
                                  {nft.seller.slice(35, 39)}{" "}
                                </div>
                              </div>
                            </div>
                          </a>
                        </Link>
                      </div>
                    );
                  })}
              </div>
              <div>
                {listedNFTs.length < 1 && (
                  <div className={styles.skeletonCard}>
                    <div className={styles.skeletonNftCard}>
                      <MyLoader type="avatar" />
                      <MyLoader type="avatar" />
                      <MyLoader type="avatar" />
                      <MyLoader type="avatar" />
                      <MyLoader type="avatar" />
                      <MyLoader type="avatar" />
                    </div>
                    <Shimmer />
                  </div>
                )}
              </div>
            </div>
          )}
          {"  "}
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
  let nftId = null;
  let listingInfo = null;
  let obj = null;
  if (results[0].length > 0) {
    nftId = results[0];
    listingInfo = results[1];
  }
  const { totalSupply, totalVolume } = objectData;
  const data = await contracts.fetchCollection(collection);
  const { name, description, banner, small, twitter, telegram, discord } = data;
  const bannerImage = banner.replace(
    "ipfs://",
    "https://ipfsfiles.distant.finance/ipfs/"
  );
  const smallImage = small.replace(
    "ipfs://",
    "https://ipfsfiles.distant.finance/ipfs/"
  );
  obj = {
    totalSupply: totalSupply,
    tradeVolume: totalVolume,
    name: name,
    description: description,
    bannerImage: bannerImage,
    smallImage: smallImage,
    twitter: twitter,
    telegram: telegram,
    discord: discord,
  };

  return {
    props: {
      nftId: JSON.parse(JSON.stringify(nftId)),
      listings: JSON.parse(JSON.stringify(listingInfo)),
      obj: obj,
    },
  };
}
