import styles from "../../styles/profile.module.css";
import Image from "next/image";
import { Contract, utils, ethers, BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { nftABI, marketplaceABI } from "../../constants/ABIs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
export default function Profile({ allData }) {
  const router = useRouter();
  const { profile } = router.query;
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.user}>
          <h1>{`${profile.slice(0, 5)}...${profile.slice(38, 42)}`}</h1>
          <p>
            NFTs owned: <span>{allData.length}</span>
          </p>
        </div>
        <div className={styles.ownedItems}>
          {allData.map((nft, i) => {
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
                        <div className={styles.onSale}>
                          {nft.offerTrue
                            ? "Offer Available"
                            : nft.listingTrue
                            ? "on Sale"
                            : ""}
                        </div>
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
  const Tkcc = "https://rpc-testnet.kcc.network";
  const profile = params.profile;
  const marketContract = "0x9c05dd334787dE014f2Fa5744381Eb20699236FF";
  const deadAddress = "0x0000000000000000000000000000000000000000";
  const provider = new ethers.providers.JsonRpcProvider(Tkcc);
  const contract = new Contract(marketContract, marketplaceABI, provider);
  const collections = await contract.supportedCollections();
  const allData = [];
  for (let i = 0; i < collections.length; i++) {
    const instance = new Contract(collections[i], nftABI, provider);
    const balance = await instance.balanceOf(profile);
    let profileBalance = balance.toNumber();
    for (let j = 0; j < profileBalance; j++) {
      if (profileBalance > 0) {
        const tokenId = await instance.tokenOfOwnerByIndex(profile, j);
        let NumTokenId = tokenId.toNumber();
        let StrTokenId = String(NumTokenId);
        const uri = await instance.tokenURI(StrTokenId);
        const url = uri.replace(
          "ipfs://",
          "https://ipfsfiles.distant.finance/ipfs/"
        );
        const ipfsFile = await fetch(url).then((r) => r.json());
        const imageUri = ipfsFile.image.replace(
          "ipfs://",
          "https://ipfsfiles.distant.finance/ipfs/"
        );
        const listingExists = await contract.sellNFT(
          collections[i],
          StrTokenId
        );
        const offersExists = await contract.availableOffers(
          collections[i],
          StrTokenId
        );
        const listingTrue = listingExists[0] === deadAddress ? true : false;
        const offerTrue = offersExists[0].length > 0 ? true : false;
        const obj = {
          name: ipfsFile.name,
          image: imageUri,
          tokenId: StrTokenId,
          listingTrue: listingTrue,
          offerTrue: offerTrue,
          collection: collections[i],
        };
        allData.push(obj);
      }
    }
  }
  return {
    props: {
      allData: allData,
    },
  };
}
