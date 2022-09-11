import { useWeb3React } from "@web3-react/core";
import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import { marketplaceABI, nftABI, tokenABI } from "../constants/ABIs";
export default function About() {
  const { active, account, library, chainId, connector, activate, deactivate } =
    useWeb3React();
  const contractAddr = "0xDf57E3d669c120fAA0E91462fadc8D27Bb03e97a";
  const collection = "0xF4c131f7fd6Db2394E82F4123bB4778e19F10043";
  const token = "0x22e91201c6C942827b47191e57C72830338E21b5";

  const [l, setL] = useState();
  const [approval, setApproval] = useState();

  const approve = async () => {
    const signer = await library.getSigner();
    const collectionContract = new Contract(collection, nftABI, signer);
    const tx = await collectionContract.approve(contractAddr, "2");
    await tx.wait();
    setApproval(tx.hash);
  };

  const [value, setValue] = useState("");
  const [id, setId] = useState("");
  const [own, setOwn] = useState("");

  const owner = async () => {
    const provider = library;
    const contracts = new Contract(collection, nftABI, provider);
    const tx = await contracts.owner();
    console.log(tx);
    setOwn(tx);
  };
  const listing = async () => {
    const signer = await library.getSigner();
    let _val = utils.parseEther(value);
    const contract = new Contract(contractAddr, marketplaceABI, signer);
    const tx = await contract.list(collection, id.toString(), _val.toString());
    tx.wait();
    console.log("Transaction List: ", tx, id, _val);
    setL(tx.hash);
  };

  return (
    <div style={{ margin: "100px" }}>
      <div onClick={approve} style={{ cursor: "pointer", marginTop: "30px" }}>
        Approve NFT
      </div>
      {approval && <div>{approval}</div>}
      <div>
        <input
          type="text"
          name="value"
          onChange={(e) => setValue(e.target.value)}
          style={{ display: "block", margin: "25px 0" }}
        />
        <input
          type="text"
          name="id"
          onChange={(e) => setId(e.target.value)}
          style={{ display: "block", margin: "25px 0" }}
        />
      </div>
      <div onClick={listing} style={{ cursor: "pointer" }}>
        List NFT
      </div>
      {l && <div>{l}</div>}
      <div onClick={owner} style={{ cursor: "pointer", marginTop: "30px" }}>
        OWNER
      </div>
      <div>{own}</div>
    </div>
  );
}
// parseEther : Convert number to BigNumber
// formatEther : does the opposite
