import { useState, useEffect, useMemo } from "react";
import { contracts, marketplaceABI, nftABI } from "../constants/ABIs";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";

const PopularCollection = () => {
  const [data, setData] = useState(null);
  const [display, setDisplay] = useState(false);
  let addr = "0x3b12cd8b30dcf4fd9db69ce125183ac7ca567472";
  const copy = async () => {
    await navigator.clipboard.writeText(addr);
    alert("Text copied");
  };
  const owner = async () => {
    const res = await contracts.contractInstance.supportedCollections();
    console.log(res);
    setData(JSON.stringify(res));
    setDisplay(true);
  };
  const collectionDetails = async () => {
    const res = await contracts.contractInstance.collection(
      "0xdb9b936373f859ce8c580bbc35b0eab89ca9fd70"
    );
    console.log(res);
  };
  return (
    <div>
      <div onClick={owner}>Call Contract</div>
      {display && <div>{data}</div>}
      <div onClick={collectionDetails}>Check Address</div>
    </div>
  );
};
export default PopularCollection;
