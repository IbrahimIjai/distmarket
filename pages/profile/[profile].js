import styles from "../../styles/profile.module.css";
import Image from "next/image";
import { contracts } from "../../constants/ABIs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import banner from "../../assets/DivArt_banner.png";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const addressQuery = `
query addressQuery($address: ID){
account(id: $address){
  id
  tokens{
    identifier
    tokenURI
    collection{
      id
    }
  }
}
}
`;

export default function Profile({ profile, objectData, indexValue }) {
  console.log(indexValue);
  const router = useRouter();
  const [runEffect, setRunEffect] = useState(0);
  const init = setTimeout(() => {
    setRunEffect(1);
  }, 500);
  if (router.isReady) {
    setTimeout(() => {
      setRunEffect(2);
    }, 2000);
    clearTimeout(init);
  }
  const [allData, setAllData] = useState([]);
  const [objectData1, setobjectData] = useState([]);
  useEffect(() => {
    const main = async () => {
      const array = [];
      const client = new ApolloClient({
        uri: contracts.queryUrl,
        cache: new InMemoryCache(),
      });
      client
        .query({
          query: gql(addressQuery),
          variables: {
            address: profile.toLowerCase(),
          },
        })
        .then((data) => {
          setobjectData(data.data.account.tokens);
        })
        .catch((err) => console.log("Error fetching data: ", err));
      for (let i = 0; i < objectData.length; i++) {
        const url = objectData[i].tokenURI.includes("ipfs://", 0)
          ? objectData[i].tokenURI.replace(
              "ipfs://",
              "https://ipfsfiles.distant.finance/ipfs/"
            )
          : objectData[i].tokenURI;
        const content = await fetch(url);
        const link = await content.json();
        const image = link.image.includes("ipfs://", 0)
          ? link.image.replace(
              "ipfs://",
              "https://ipfsfiles.distant.finance/ipfs/"
            )
          : link.image;
        // const listingExists = await contracts.contractInstance.sellNFT(
        //   objectData[i].collection.id,
        //   objectData[i].identifier
        // );
        // const offersExists = await contracts.contractInstance.availableOffers(
        //   objectData[i].collection.id,
        //   objectData[i].identifier
        // );
        // const listingTrue =
        //   listingExists[0] === contracts.deadAddress ? false : true;
        // const offerTrue = offersExists[0].length > 0 ? true : false;
        const obj = {
          name: link.name,
          image: image,
          tokenId: objectData[i].identifier,
          collection: objectData[i].collection.id,
          // listingTrue: listingTrue,
          // offerTrue: offerTrue,
        };
        array.push(obj);
        setAllData(array);
      }
    };
    main();
  }, []);
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.user}>
          <div className={styles.profile}>
            <div className={styles.banner}>
              <Image
                src={banner}
                objectFit="cover"
                layout="fill"
                alt="banner"
              />
            </div>
            <div className={styles.profileImage}>
              <Image
                // src={allData.length > 0 ? allData[0].image : "/1960.jpeg"}
                src={
                  allData[indexValue] !== undefined
                    ? allData[indexValue].image
                    : "/1960.jpeg"
                }
                objectFit="cover"
                alt="profile"
                layout="fill"
              />
            </div>
          </div>
          {profile && (
            <Link href={`https://explorer.kcc.io/en/tokentxns/${profile}`}>
              <a>
                <h1>{`${profile.slice(0, 5)}...${profile.slice(38, 42)}`}</h1>
              </a>
            </Link>
          )}
          <p>
            Total NFTs owned:{" "}
            <span>{allData.length == 0 ? "Loading..." : allData.length}</span>
          </p>
        </div>
        <div className={styles.ownedItems}>
          {allData?.map((nft, i) => {
            return (
              <div className={styles.nft} key={i}>
                <Link href={`/collection/${nft.collection}/${nft.tokenId}`}>
                  <a>
                    <div>
                      {" "}
                      <Image
                        src={nft.image ? nft.image : "/2818"}
                        alt={nft.name}
                        layout="fill"
                        objectFit="cover"
                        className={styles.image}
                      />{" "}
                      <div className={styles.content}>
                        {/* <div className={styles.onSale}>
                          {nft.offerTrue
                            ? "Offer Available"
                            : nft.listingTrue
                            ? "on Sale"
                            : ""}
                        </div> */}
                        <div className={styles.details}>
                          <h2 className={styles.name}>{nft.name}</h2>
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps({ params }) {
  const profile = params.profile;
  let objectData = {};
  const contentData = [];
  const client = new ApolloClient({
    uri: contracts.queryUrl,
    cache: new InMemoryCache(),
  });
  client
    .query({
      query: gql(addressQuery),
      variables: {
        address: profile.toLowerCase(),
      },
    })
    .then((data) => {
      let temp = data.data.account.tokens;
      objectData = temp;
    })
    .catch((err) => console.log("Error fetching data: ", err));
  const Host = await contracts.contractInstance.supportedCollections();
  contentData.push(Host);
  let indexValue;
  if (objectData.length > 1) {
    const index = Math.floor(Math.random() * objectData.length);
    console.log(index);
    indexValue = index;
  }
  return {
    props: {
      profile: profile,
      objectData: objectData,
      contentData: contentData,
      indexValue: indexValue,
    },
  };
}
