import { useState } from "react";
import styles from "../styles/Admin.module.css";
import { useWeb3React } from "@web3-react/core";
import { Contract, BigNumber, utils } from "ethers";
import {
    marketplaceABI,
    contracts
  } from "../constants/ABIs";
  import Error from "../components/error/Error";

export default function Admin( ) {
    const { account, library, active } = useWeb3React();
    const [collectionAddress, setCollectionAddresss] = useState(null);
    const [royaltyFees, setRoyaltyfees] = useState("");
    const [displayTxn, setDisplayTxn] = useState(true);
    const [error, setError] = useState(false)

    const setColAddress = (e)=>{
        setCollectionAddresss((value) => e.target.value);
    }
    const setFees = (e)=>{
        setRoyaltyfees((value) => e.target.value)
    }

    const Addcollection = async () =>{
        try{
            const marketContract = contracts.marketplace;
            const signer = await library.getSigner();
            const RoyaltyFees = parseInt(utils.parseEther(royaltyFees)._hex, 16).toString();
            const contract = new Contract(marketContract, marketplaceABI, signer);
            console.log("contract set")
            const tx = await contract.addCollection(collectionAddress, collectionAddress, RoyaltyFees);
            await tx.wait();
            tx.hash && setDisplayTxn(false);
        }catch{
            setError(true)
            
        }
       
    }
  
    return (
      <div className={styles.div}>
        <div className={styles.Addcollection}>
            <input type="text" onChange={setColAddress} placeholder="Collection address"/>
            <input  type="text" onChange={setFees}placeholder="Royalityfees" />
            <button onClick={Addcollection} >Addcollection</button>
            {
              error && <Error/>
            }
        </div>

        <div className={ styles.upDateCollection}>
            <input type="text" onChange={setColAddress} placeholder="Collection address"/>
            {
              error && <Error/>
            }
        </div>
    
      </div>
    );
  }