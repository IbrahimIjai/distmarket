import { ethers, utils } from "ethers";
import { contracts } from "../constants/ABIs";
import { useWeb3React } from "@web3-react/core";
export default function Test() {
  const { active, account, library } = useWeb3React();
  const provider = library;
  const bal = async () => {
    const balance = await provider.getBalance(contracts.deadAddress);
    console.log(utils.formatEther(balance));
  };
  return <div onClick={bal}>Get Balance</div>;
}
