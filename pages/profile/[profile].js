import styles from "../../styles/profile.module.css";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Profile({ profile, dataArray, indexValue, code }) {
  const { account } = useWeb3React();
  const ownerProfile = account ? account.toLowerCase() : undefined;
  const [allData, setAllData] = useState([]);
  const [nftState, setNftState] = useState([]);
  useEffect(() => {
    const main = async () => {
      const nftData = await fetch(
        "https://mart.distant.finance/api/blockchain/profile/destructure",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: dataArray, profile: profile }),
        }
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));
      setAllData(nftData);
      const tokenId = dataArray.map((data) => data.identifier);
      const collection = dataArray.map((data) => data.collection.id);
      const nftMarketState = await fetch(
        "https://mart.distant.finance/api/blockchain/profile/marketstate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            collection: collection,
            tokenId: tokenId,
            profile: profile,
          }),
        }
      )
        .then((res) => res.json())
        .catch((err) => console.log(err));
      setNftState(nftMarketState);
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
        {allData && allData.length > 0 ? (
          code === "0x" ? (
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
          )
        ) : (
          <div className={styles.notAddress}>
            {dataArray.length > 0 ? "NFTs loading..." : "No NFTs to display"}
          </div>
        )}
      </div>
    </main>
  );
}

export async function getServerSideProps({ params }) {
  const profile = params.profile;
  const profileData = await fetch(
    "https://mart.distant.finance/api/blockchain/profile/serverside",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profile: profile }),
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));
  const { dataArray, indexValue, code } = profileData;
  return {
    props: {
      profile: profile,
      dataArray: dataArray,
      indexValue: indexValue,
      code: code,
    },
  };
}
