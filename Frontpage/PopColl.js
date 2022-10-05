import styles from "./styles/popcol.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { contracts, nftABI } from "../constants/ABIs";
import Link from "next/link";
import { utils, Contract } from "ethers";
import { MdOutlineGppGood } from "react-icons/md";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import MyLoader from "../components/Skeleton";
import Shimmer from "../components/Shimmer";

const collectionDataQuery = `
query MyQuery ($address: ID){
  collection(id: $address) {
    id
    name
    totalSupply
    totalVolume
    totalSales
    topSale
  }
}
`;
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
      const collectionsDetails = [];
      for (let i = 0; i < address.length; i++) {
        const instance = new Contract(address[i], nftABI, contracts.provider);
        let object;
        const client = new ApolloClient({
          uri: contracts.queryUrl,
          cache: new InMemoryCache(),
        });
        client
          .query({
            query: gql(collectionDataQuery),
            variables: {
              address: address[i].toLowerCase(),
            },
          })
          .then((data) => (object = data.data.collection))
          .catch((err) => console.log("Error fetching data: ", err));
        const uri = await instance.tokenURI("1");
        const url = uri.includes("ipfs://", 0)
          ? uri.replace("ipfs://", "https://ipfsfiles.distant.finance/ipfs/")
          : uri;
        const data = await fetch(url).then((res) => res.json());
        const image = data.image.includes("ipfs://", 0)
          ? data.image.replace(
              "ipfs://",
              "https://ipfsfiles.distant.finance/ipfs/"
            )
          : data.image;
        const results = await contracts.contractInstance.availableListings(
          address[i]
        );
        const listings = results[1];
        if (listings.length > 0) {
          const prices = listings.map((listing) =>
            utils.formatEther(listing[1])
          );
          const lowestValue =
            prices.length > 0 &&
            prices.reduce((acc, cur) =>
              Number(acc) < Number(cur) ? acc : cur
            );
          const obj = {
            image: image,
            floor: lowestValue,
            items: prices.length,
            name: object.name,
            address: object.id,
            topSale: object.topSale,
            totalSupply: object.totalSupply,
            totalSales: object.totalSales,
            totalVolume: object.totalVolume,
          };
          collectionsDetails.push(obj);
        }
      }
      setTopCollections(collectionsDetails);
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
