import styles from "./styles/RListed.module.css";
import Image from "next/image";
import SupportedCollections from "../SupportedCollections";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import { Contract, utils } from "ethers";
import Link from "next/link";
import { contracts, nftABI } from "../constants/ABIs";

const RListed = () => {
  const { active } = useWeb3React();
  const [runEffect, setRunEffect] = useState(false);
  const init = setTimeout(() => {
    setRunEffect(true);
  }, 300);
  if (active || !active) {
    setTimeout(() => {
      setRunEffect(false);
    }, 1200);
    clearTimeout(init);
  }
  const [data, setData] = useState(null);
  useEffect(() => {
    const main = async () => {
      const recentListings = [];
      try {
        const contract = contracts.contractInstance;
        for (let i = 0; i < SupportedCollections.length; i++) {
          const listings = await contract.availableListings(
            SupportedCollections[i].collectionAddress
          );
          const instance = new Contract(
            SupportedCollections[i].collectionAddress,
            nftABI,
            contracts.provider
          );
          if (listings[1].length > 0) {
            let data = listings[1].length;
            let dat = data - 1;
            let tokenId = parseInt(listings[0][dat]._hex, 16);
            let value = utils.formatEther(listings[1][dat][1]);
            let tokenInfo = await instance.tokenURI(tokenId.toString());
            let info = tokenInfo.includes("ipfs://", 0)
              ? tokenInfo.replace(
                  "ipfs://",
                  "https://ipfsfiles.distant.finance/ipfs/"
                )
              : tokenInfo;
            const json = await fetch(info).then((res) => res.json());
            const { name, image } = json;
            let imageFile = image.includes("ipfs://", 0)
              ? image.replace(
                  "ipfs://",
                  "https://ipfsfiles.distant.finance/ipfs/"
                )
              : image;
            const obj = {
              tokenId: tokenId,
              collectionAddress: SupportedCollections[i].collectionAddress,
              address: listings[1][dat][0],
              price: value,
              name: name,
              image: imageFile,
            };
            recentListings.push(obj);
          }
        }
        setData(recentListings);
      } catch (error) {
        console.log(error);
      }
    };
    main();
  }, [runEffect]);
  return (
    <main className={styles.main}>
      {data && (
        <div className={styles.text}>
          <h3>Recently listed NFTs</h3>
        </div>
      )}

      <div className={styles.SliderContainer}>
        <div className={styles.cards}>
          {data &&
            data.map((nft, i) => (
              <Link
                key={i}
                href={`/collection/${nft.collectionAddress}/${nft.tokenId}`}
              >
                <a>
                  <div className={styles.imageContainer}>
                    <Image
                      src={nft.image}
                      layout="fill"
                      objectFit="cover"
                      style={{ padding: "0 20px" }}
                      alt="Nft image"
                    />
                    <div className={styles.description}>
                      <h3>{nft.name}</h3>
                      <p>Price tag: ${nft.price} </p>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
};
export default RListed;
