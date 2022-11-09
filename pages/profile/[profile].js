import styles from "../../styles/profile.module.css";
import Image from "next/image";
import { contracts } from "../../constants/ABIs";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const dataQuery = `
 query queryData($address: ID, $collections: String) {
  account(id: $address) {
    tokens(where: {collection: $collections}) {
      identifier
      tokenURI
      collection{
        id
      }
    }
  }
}`;
export default function Profile({ profile, dataArray, indexValue, code }) {
  const { account } = useWeb3React();
  const ownerProfile = account ? account.toLowerCase() : undefined;
  const [allData, setAllData] = useState([]);
  useEffect(() => {
    const main = async () => {
      const array = [];
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].tokenURI !== null) {
          const url = dataArray[i].tokenURI.includes("ipfs://", 0)
            ? dataArray[i].tokenURI.replace(
                "ipfs://",
                "https://ipfsfiles.distant.finance/ipfs/"
              )
            : dataArray[i].tokenURI;
          const link = await fetch(url)
            .then((res) => res.json())
            .catch((err) => console.log(err, "Error fetching"));
          const image =
            link && link.image.includes("ipfs://", 0)
              ? link.image.replace(
                  "ipfs://",
                  "https://ipfsfiles.distant.finance/ipfs/"
                )
              : link.image;
          // const listingExists = await contracts.contractInstance.sellNFT(
          //   dataArray[i].collection.id,
          //   dataArray[i].identifier
          // );
          // const offersExists = await contracts.contractInstance.availableOffers(
          //   dataArray[i].collection.id,
          //   dataArray[i].identifier
          // );
          // const listingTrue =
          //   listingExists[0] === contracts.deadAddress ? false : true;
          // const offerTrue = offersExists[0].length > 0 ? true : false;
          const obj = {
            name: link ? link.name : "NFT",
            image: link ? image : "",
            tokenId: dataArray[i].identifier,
            collection: dataArray[i].collection.id,
            // listingTrue: listingTrue,
            // offerTrue: offerTrue,
          };
          array.push(obj);
        }
      }
      setAllData(array);
    };
    indexValue !== null && main();
  }, []);
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.user}>
          <div className={styles.profile}>
            <div className={styles.banner}>
              <Image
                src="/defaultBanner.png"
                objectFit="cover"
                layout="fill"
                alt="banner"
                priority
              />
            </div>
            <div className={styles.profileImage}>
              <Image
                src={
                  allData[indexValue] !== undefined
                    ? allData[indexValue].image
                    : "/defaultImage.png"
                }
                objectFit="cover"
                alt="profile"
                layout="fill"
              />
            </div>
          </div>
          {profile && (
            <Link href={`https://explorer.kcc.io/en/address/${profile}`}>
              <a>
                <h1>{`${profile.slice(0, 5)}...${profile.slice(38, 42)}`}</h1>
              </a>
            </Link>
          )}

          <p>
            Total NFTs owned:{" "}
            <span>{dataArray.length > 0 ? dataArray.length : "0"}</span>
          </p>
          {code === "0x" &&
            dataArray.length === 0 &&
            ownerProfile === profile.toLowerCase() && (
              <i className={styles.promptBuy}>
                <span>
                  Lets boost your Profile <i>🤩</i>
                </span>
                <span>
                  <Link href="/collections">
                    <a>Purchase your first NFT</a>
                  </Link>
                </span>
              </i>
            )}
        </div>
        {code === "0x" ? (
          <div className={styles.ownedItems}>
            {allData?.map((nft, i) => {
              return (
                <div className={styles.nft} key={i}>
                  <Link href={`/collection/${nft.collection}/${nft.tokenId}`}>
                    <a>
                      <div>
                        {" "}
                        <Image
                          src={nft.image ? nft.image : "/defaultImage.png"}
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
        ) : (
          <h2 className={styles.notAddress}>
            Address is a Contract Address
            <span>Cannot fetch NFT Data</span>
          </h2>
        )}
      </div>
    </main>
  );
}

export async function getServerSideProps({ params }) {
  const profile = params.profile;
  const code = await contracts.provider.getCode(profile);
  const collections = await contracts.contractInstance.supportedCollections();
  const dataArray = [];
  if (code === "0x") {
    for (let i = 0; i < collections.length; i++) {
      const client = new ApolloClient({
        uri: contracts.queryUrl,
        cache: new InMemoryCache(),
      });
      await client
        .query({
          query: gql(dataQuery),
          variables: {
            address: profile.toLowerCase(),
            collections: collections[i].toLowerCase(),
          },
        })
        .then((data) => {
          let temp = data.data.account.tokens;
          temp.length > 0 && dataArray.push(...temp);
        })
        .catch((err) => console.log("Error fetching data: ", err));
    }
  }
  let indexValue = null;
  if (dataArray.length > 0) {
    const index = Math.floor(Math.random() * dataArray.length);
    indexValue = index;
  }
  return {
    props: {
      profile: profile,
      dataArray: JSON.parse(JSON.stringify(dataArray)),
      indexValue: indexValue,
      code: code,
    },
  };
}
