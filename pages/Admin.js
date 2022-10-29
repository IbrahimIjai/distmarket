import { useState } from "react";
import styles from "../styles/Admin.module.css";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { marketplaceABI, contracts } from "../constants/ABIs";
import Error from "../components/error/Error";
import Link from "next/link";

export default function Admin() {
  const { library, account } = useWeb3React();
  const [collectionAddress, setCollectionAddresss] = useState("");
  const [royaltyFeesAddress, setRoyaltyFeesAddress] = useState("");
  const [royaltyFees, setRoyaltyfees] = useState("");
  const [displayTxn, setDisplayTxn] = useState(false);
  const [txLink, setTxLink] = useState("");
  const [txuLink, setTxuLink] = useState("");
  const [error, setError] = useState(false);

  const setColAddress = (e) => {
    setCollectionAddresss((value) => e.target.value);
  };
  const setFees = (e) => {
    setRoyaltyfees((value) => e.target.value);
  };
  const setFeeCollector = (e) => {
    setRoyaltyFeesAddress((value) => e.target.value);
  };
  const withdraw = async () => {
    try {
      const signer = await library.getSigner();
      const marketContract = contracts.marketplace;
      const contract = new Contract(marketContract, marketplaceABI, signer);
      const tx = contract.withdrawRevenue();
      await tx.wait();
      console.log(tx);
    } catch (error) {
      console.log(error.message);
    }
  };
  const Addcollection = async () => {
    try {
      const signer = await library.getSigner();
      const contract = new Contract(
        contracts.marketplace,
        marketplaceABI,
        signer
      );
      const fee = royaltyFees * 100;
      const tradeFees = fee.toString();
      const tx = await contract.addCollection(
        collectionAddress,
        royaltyFeesAddress,
        tradeFees
      );
      updateCollection(contract, tradeFees);
      await tx.wait();
      tx.hash && setDisplayTxn(true);
      setTxLink(tx.hash);
    } catch (error) {
      console.log(error.message);
      console.log(error);
      setError(true);
    }
  };
  const updateCollection = async (contract, tradeFees) => {
    try {
      const txu = await contract.updateCollection(
        collectionAddress,
        royaltyFeesAddress,
        tradeFees
      );
      await txu.wait();
      setTxuLink(txu.hash);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {account == "0x169a22652Bb25dCDDe884fe4C890c01D92a40A96" ? (
        <div className={styles.div}>
          {displayTxn && (
            <div className={styles.link}>
              <Link href={`https://explorer.kcc.io/en/tx/${txLink}`}>
                <a>Link to add Collection transaction</a>
              </Link>{" "}
              <br />
              <Link href={`https://explorer.kcc.io/en/tx/${txuLink}`}>
                <a>Link to update Collection transaction</a>
              </Link>
            </div>
          )}
          <div className={styles.Addcollection}>
            <h2>Add and Verify Collection</h2>
            <input
              type="text"
              onChange={setColAddress}
              placeholder="Collection address"
            />
            <input type="text" onChange={setFees} placeholder="Royalty fees" />
            <input
              type="text"
              onChange={setFeeCollector}
              placeholder="fee Collector address"
            />
            <button onClick={Addcollection}>Add Collection</button>
          </div>
          {error && <Error />}
          <div onClick={withdraw} className={styles.rev}>
            Withdraw Revenue
          </div>
        </div>
      ) : (
        <div className={styles.notActive}>
          <h2>You are not supposed to be here 🥶</h2>{" "}
          <h4>
            <Link href="/">
              <a>Return Home</a>
            </Link>
          </h4>
        </div>
      )}
    </>
  );
}
