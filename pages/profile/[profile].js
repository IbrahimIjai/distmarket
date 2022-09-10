import styles from "../../styles/profile.module.css";
import profiles from "../../profiles";
import Image from "next/image";
import { Contract, utils, ethers, BigNumber } from "ethers";
import { nftABI, marketplaceABI } from "../../constants/ABIs";
export default function profile({ data, coll }) {
  console.log(data, coll);
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
  const getData = await collections.map(async (collection) => {
    const gata = [];
    const instance = new Contract(collection, nftABI, provider);
    const balance = await instance.balanceOf(profile);
    let profileBalance = balance.toNumber();
    const tokenIds = [];
    const name = [];
    const images = [];
    for (let i = 0; i < profileBalance; i++) {
      if (profileBalance > 0) {
        const tokenId = await instance.tokenOfOwnerByIndex(profile, i);
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
        name.push(ipfsFile.name);
        images.push(imageUri);
        tokenIds.push(StrTokenId);
      }
    }
    const obj = {
      collection: collection,
      tokenArray: tokenIds,
      image: images,
      name: name,
    };
    if (obj.name.length > 0) {
      gata.push(obj);
      profileData.push(obj);
    }

    console.log(gata, "Server");
    return gata;
  });
  console.log("Server 2", getData, profileData);
  return {
    props: {
      data: JSON.parse(JSON.stringify(getData)),
      coll: JSON.parse(JSON.stringify(collections)),
    },
  };
}
