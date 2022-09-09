import { useWeb3React } from "@web3-react/core";
import { nftABI, marketplaceABI, tokenABI } from "../constants/ABIs";
import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function test() {
  const { active, account, library, chainId, connector, activate, deactivate } =
    useWeb3React();
  const nftContract = "0xCDF30c588CCe8eDAd78C4d3183fA360cdD6EA22F";
  const marketContract = "0x9c05dd334787dE014f2Fa5744381Eb20699236FF";
  const tokenContract = "0x22e91201c6C942827b47191e57C72830338E21b5";
  const [name, setName] = useState();
  const [response, setResponse] = useState();
  const provider = library;
  const profile = "0xEAe38e8d41aeCC027e1b68c31f7039Ae95651D4D";
  const collections = async () => {
    const contractInstance = new Contract(
      marketContract,
      marketplaceABI,
      provider
    );
    const updateListings = [];
    const updateListing = await contractInstance.queryFilter("ItemUpdated");
    const listingsForId = updateListing.map((listing) => {
      for (let i = 0; i < delistEvents.length; i++) {
        if (listing.args[1] == 1) {
          let object = {
            args: listing.args,
            txnHash: listing.transactionHash,
            addr: listing.address,
            events: listing.event,
          };
          updateListings.push(object);
        }
      }
    });
  };
  let d = "0xB249765ed8cEAf332c9C15705eF00c77725f3B19";
  const coll = async () => {};
  const owner = async () => {
    const contract = new Contract(nftContract, nftABI, provider);
    const balance = await contract.balanceOf(d);
    let userBalance = balance.toNumber();
    const k = [];
    console.log(userBalance);
    for (let i = 0; i < userBalance; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(d, i);
      let gg = tokenId.toNumber();
      let rr = String(gg);
      console.log(typeof rr);
      k.push(tokenId.toNumber());
    }
    console.log(k);
  };
  const addCollection = async () => {
    const signer = await library.getSigner();
    const contractInstance = new Contract(
      marketContract,
      marketplaceABI,
      signer
    );
    const result = await contractInstance.addCollection(nftContract, name, "3");
    result.wait();
    console.log("Collection Added successfully", result);
    setResponse(result.hash);
  };

  return (
    <div>
      <div style={{ cursor: "pointer", marginTop: "30px" }} onClick={coll}>
        Token IDs
      </div>
      <h1>{name}</h1>
      <div
        style={{ cursor: "pointer", marginTop: "30px" }}
        onClick={collections}
      >
        Add Collection
      </div>
      <span>{response}</span>
    </div>
  );
}
