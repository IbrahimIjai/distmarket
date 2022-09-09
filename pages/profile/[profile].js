import styles from "../../styles/profile.module.css";
import profiles from "../../profiles";
import Image from "next/image";
import { Contract, utils, ethers, BigNumber } from "ethers";
import { nftABI, marketplaceABI } from "../../constants/ABIs";
export default function profile({ data, coll, profileData }) {
  console.log(data, coll, profileData);
  // return (
  //   <main className={styles.main}>
  //     <div className={styles.container}>
  //       <div className={styles.user}>
  //         <h1>0xdb9b...d70</h1>
  //         <p>
  //           NFTs owned: <span>{profiles.length}</span>
  //         </p>
  //       </div>
  //       <div className={styles.ownedItems}>
  //         {profiles.map((nft, i) => {
  //           return (
  //             <div className={styles.nft} key={i}>
  //               <div>
  //                 {" "}
  //                 <Image
  //                   src={nft.image}
  //                   layout="fill"
  //                   objectFit="cover"
  //                   className={styles.image}
  //                 />{" "}
  //                 <div className={styles.content}>
  //                   <div className={styles.onSale}>
  //                     {nft.bestOffer > 0
  //                       ? "Offer Available"
  //                       : nft.price > 0
  //                       ? "on Sale"
  //                       : ""}
  //                   </div>
  //                   <div className={styles.details}>
  //                     <h2 className={styles.name}>{nft.collection}</h2>
  //                     <p className={styles.id}>
  //                       #{i + Math.floor(Math.random() * 10000)}
  //                     </p>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </div>
  //   </main>
  // );
}
export async function getServerSideProps({ params }) {
  const Tkcc = "https://rpc-testnet.kcc.network";
  const { profile } = params;
  const marketContract = "0x9c05dd334787dE014f2Fa5744381Eb20699236FF";
  const provider = new ethers.providers.JsonRpcProvider(Tkcc);
  const contract = new Contract(marketContract, marketplaceABI, provider);
  const collections = await contract.supportedCollections();
  const profileData = [];
  console.log(collections);
  const getData = async () => {
    collections.map(async (collection) => {
      const instance = new Contract(collection, nftABI, provider);
      const balance = await instance.balanceOf(profile);
      let profileBalance = balance.toNumber();
      console.log(collection, profileBalance, profile);
      const tokenIds = [];
      for (let i = 0; i < profileBalance; i++) {
        const tokenId = await instance.tokenOfOwnerByIndex(profile, i);
        let NumTokenId = tokenId.toNumber();
        let StrTokenId = String(NumTokenId);
        tokenIds.push(StrTokenId);
      }
      const obj = {
        collection: collection,
        tokenArray: tokenIds,
      };
      profileData.push(obj);
      console.log(profileData, "Server");
    });
  };
  await getData();
  return {
    props: {
      data: JSON.parse(JSON.stringify(profileData)),
      coll: JSON.parse(JSON.stringify(collections)),
      profileData: profileData,
    },
  };
}
