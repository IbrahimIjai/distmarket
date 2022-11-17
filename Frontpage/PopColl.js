import styles from "./styles/popcol.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import MyLoader from "../components/Skeleton";
import Shimmer from "../components/Shimmer";

const PopularCollection = ({ address }) => {
  const [runEffect, setRunEffect] = useState(false);
  const init = setTimeout(() => {
    setRunEffect(true);
  }, 300);
  if (true) {
    setTimeout(() => {
      setRunEffect(false);
    }, 2000);
    clearTimeout(init);
  }
  const [topCollections, setTopCollections] = useState(null);
  useEffect(() => {
    const main = async () => {
      const url = "/api/blockchain/topcollections";
      const data = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      })
        .then((res) => res.json())
        .catch((error) => console.log(error));
      setTopCollections(data);
    };
    main();
  }, [runEffect]);
  return (
    <div className={styles.Cointainer}>
      <div className={styles.Header}>
        <span className={styles.HeaderTittle}> Top Collections </span>
        <hr className={styles.hr} />
      </div>
      <div className={styles.topCollections}>
        <div className={styles.head}>
          <div className={styles.collection}>Collection</div>
          <div>Floor</div>
          <div>Volume</div>
          <div>Top Sale</div>
          <div>Listed</div>
          <div>Supply</div>
        </div>
        <div className={styles.body}>
          {topCollections ? (
            topCollections.map((collection, i) => (
              <Link key={i} href={`/collection/${collection.address}`}>
                <a>
                  <div className={styles.key}>
                    <div className={styles.count}>
                      <div>
                        <div className={styles.imageContainer}>
                          <div className={styles.image}>
                            <Image src={collection.image} layout="fill" />
                          </div>
                        </div>
                        <div className={styles.name}>{collection.name}</div>
                      </div>
                    </div>
                    <div className={styles.content}> ${collection.floor} </div>
                    <div className={styles.content}>
                      {" "}
                      {collection.totalVolume == 0
                        ? `-`
                        : `$${collection.totalVolume}`}{" "}
                    </div>
                    <div className={styles.content}>
                      {" "}
                      {collection.topSale == 0
                        ? `-`
                        : `$${collection.topSale}`}{" "}
                    </div>
                    <div className={styles.content}> {collection.items} </div>
                    <div className={styles.content}>
                      {" "}
                      {collection.totalSupply}{" "}
                    </div>
                  </div>
                </a>
              </Link>
            ))
          ) : (
            <div className={styles.skeletonWrapper}>
              <div>
                <MyLoader type="popularcollections" />
                <MyLoader type="popularcollections" />
                <MyLoader type="popularcollections" />
                <MyLoader type="popularcollections" />
                <MyLoader type="popularcollections" />
              </div>
              <Shimmer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PopularCollection;
