import styles from "../../styles/nft.module.css";
import MyLoader from "../../components/Skeleton";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots, BsGlobe, BsTwitter, BsTelegram } from "react-icons/bs";
import Link from "next/link";
import Shimmer from "../../components/Shimmer";
import { contracts } from "../../constants/ABIs";

export default function Home({ listings, obj, collection }) {
  // States
  const [listedNFTs, setListedNFTs] = useState([]);
  const [linkShow, setLinkShow] = useState(false);
  const [stats, setStats] = useState({});
  const [visibility, setVisibility] = useState(false);
  useEffect(() => {
    const main = async () => {
      try {
        let url = `${contracts.queryHost}/api/blockchain/collection/collectionstats`;
        const collectionStats = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listings,
            collection,
          }),
        })
          .then((res) => res.json())
          .catch((err) => console.log(err));
        setStats(collectionStats);
        const { bestOffers } = collectionStats;
        let uri = `${contracts.queryHost}/api/blockchain/collection/listednfts`;
        const listedNfts = await fetch(uri, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listings,
            bestOffers,
            collection,
          }),
        })
          .then((res) => res.json())
          .catch((err) => console.log(err));
        setListedNFTs(listedNfts);
      } catch (error) {
        console.log(error);
      }
    };
    main();
  }, [stats, listedNFTs]);
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
            <h3>{stats.highestOffer > 0 ? `$${stats.highestOffer}` : "-"}</h3>
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
              <Link href={`https://explorer.kcc.io/en/address/${collection}`}>
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

      {listings === null ? (
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
                                  Best Offer: <span>{`$${nft.bestOffer}`}</span>
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
  );
}

export async function getServerSideProps({ params, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=43200, stale-while-revalidate=60"
  );
  const collection = params.collection;
  let listingInfo = null;
  let obj = null;
  let url = `${contracts.queryHost}/api/blockchain/collection/nftslisted`;
  const results = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ collection: collection }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  let uri = `${contracts.queryHost}/api/blockchain/collection/nftcollectiondetails`;
  obj = await fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ collection: collection }),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  results.length > 0 ? (listingInfo = results) : (listingInfo = null);
  return {
    props: {
      listings: listingInfo,
      obj: JSON.parse(JSON.stringify(obj)),
      collection: collection,
    },
  };
}
