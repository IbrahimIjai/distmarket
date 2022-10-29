import { useState, useEffect, useMemo } from "react";
import { contracts, marketplaceABI, nftABI } from "../constants/ABIs";
import axios from "axios";

const PopularCollection = () => {
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  const [display, setDisplay] = useState(true);
  let addr = "0x3b12cd8b30dcf4fd9db69ce125183ac7ca567472";
  const copy = async () => {
    await navigator.clipboard.writeText(addr);
    alert("Text copied");
  };
  useEffect(() => {
    let a =
      "https://ipfsfiles.distant.finance/ipfs/QmRm5kHerq98FkfJuZzk4ysFFnsvN8SPpmQnozdZGbM8KD/10741.json";
    let b = "https://jsonplaceholder.typicode.com/users/1";
    let c =
      "https://ipfsfiles.distant.finance/ipfs/bafybeibzvqkmn2nqoqpigsayvkzpa7n3ldsonzchqicevdjankrzcpgrfu/1264";
    let d = "https://cdn2.kuswap.finance/ipfs/metadata/kuorks/2.json";
    const uri = async () => {
      // const uri = await fetch(d);
      const uri = await axios.get(a).then((res) => res.data);
      console.log(uri);
    };
    uri();
  }, []);
  const owner = async () => {
    let arr = [];
    const res = await contracts.contractInstance.supportedCollections();
    for (let i = 0; i < res.length; i++) {
      let content = await contracts.contractInstance.collection(res[i]);
      arr.push(content);
    }
    setData(res);
    setDisplay(true);
  };
  const collectionDetails = async () => {
    const res = await contracts.contractInstance.collection(
      "0xdb9b936373f859ce8c580bbc35b0eab89ca9fd70"
    );
    console.log(res);
  };
  const contract = async () => {
    const code = await contracts.provider.getCode(
      "0xdb9b936373f859ce8c580bbc35b0eab89ca9fd70"
    );
    const code2 = await contracts.provider.getCode(
      "0x5b41b4ce7497f703e09f4ac381b487658a8321e3"
    );
    setData(code);
    setData2(code2);
    setDisplay(true);
    data2 === "0x" ? console.log("Wallet") : console.log("Contract");
    data === "0x" && console.log("Wallet");
  };
  console.log(data);
  return (
    <div>
      <div onClick={owner}>Call Contract</div>

      <div onClick={contract}>Check Address</div>
    </div>
  );
};
export default PopularCollection;
