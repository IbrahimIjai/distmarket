import Image from "next/image";
import Link from "next/link";
import styles from "../styles/allCollections.module.css";
import banner from "../assets/banner.png";
import { Contract, ethers } from "ethers";
import { marketplaceABI, contracts, nftABI } from "../constants/ABIs";
import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const nftData = `
  query allCollections($address: ID) {
    collection(id: $address) {
      name
      id
      symbol
      totalSupply
    }
  }
`;

export default function Collections({ coll, arrayData }) {
  const [collections, setCollections] = useState([]);
  useEffect(() => {
    const main = async () => {
      const data = [];
      for (let i = 0; i < coll.length; i++) {
        const links = await contracts.fetchCollection(coll[i].toLowerCase());
        const { placeholder, small } = links;
        const placeholderImage = placeholder.replace(
          "ipfs://",
          "https://ipfsfiles.distant.finance/ipfs/"
        );
        const smallImage = small.replace(
          "ipfs://",
          "https://ipfsfiles.distant.finance/ipfs/"
        );
        const obj = {
          ...arrayData[i],
          placeholderImage,
          smallImage,
        };
        data.push(obj);
      }
      setCollections(data);
    };
    main();
  }, [coll]);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerImage}>
          <Image
            src={banner}
            objectFit="cover"
            layout="fill"
            alt="Banner Image"
          />
        </div>
        <div className={styles.headerContent}>
          <h1 className={styles.headerHeader}>mART Collections</h1>
          <p className={styles.headerDescription}>
            A curated NFT set of Artwork, Game Items and Characters, and Name
            service NFTs
          </p>
        </div>
      </div>
      <div className={styles.collections}>
        {coll.length > 0 &&
          collections.map((collection, i) => (
            <div className={styles.collection} key={i}>
              <Link
                href={`/collection/${collection.id}`}
                passHref
                prefetch={false}
              >
                <a>
                  <div className={styles.imageHolster}>
                    <Image
                      src={collection.placeholderImage}
                      layout="fill"
                      alt="2818.jpeg"
                      objectFit="cover"
                      className={styles.image}
                    />
                    <div className={styles.content}>
                      <div className={styles.topContent}>
                        <div className={styles.topContentImage}>
                          <div className={styles.image}>
                            <Image
                              src={collection.smallImage}
                              layout="fill"
                              alt="2818"
                              objectFit="cover"
                            />
                          </div>
                        </div>
                        <div className={styles.topContentName}>
                          <div className={styles.name}>
                            <span>{collection.symbol}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.bottomContent}>
                        <div className={styles.bottomHeader}>
                          <h1>{collection.name}</h1>
                          <div>{collection.totalSupply} Supply</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const collections = await contracts.contractInstance.supportedCollections();
  const arrayData = [];
  const arr = collections;
  for (let i = 0; i < arr.length; i++) {
    const client = new ApolloClient({
      uri: contracts.queryUrl,
      cache: new InMemoryCache(),
    });
    client
      .query({
        query: gql(nftData),
        variables: {
          address: arr[i].toLowerCase(),
        },
      })
      .then((data) => {
        let content = data.data.collection;
        arrayData.push(content);
      })
      .catch((err) => console.log("Error fetching data: ", err));
  }
  const res = await contracts.contractInstance.maxFees();
  await arrayData;
  return {
    props: {
      coll: JSON.parse(JSON.stringify(arr)),
      arrayData: arrayData,
    },
  };
}
