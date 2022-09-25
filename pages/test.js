import { useWeb3React } from "@web3-react/core";
import { nftABI, marketplaceABI, tokenABI, contracts } from "../constants/ABIs";
import { Contract, utils } from "ethers";
import { createClient } from "urql";
import { useEffect, useState } from "react";

const query = `
query {
  collection(id: "0x81d028a07fd843c549b9c634cb9e99419c42a0ee"){
    id
    name
    topSale
    totalSales
    totalVolume
  }
}
`;
const client = createClient({
  url: contracts.queryUrl,
});

export default function Test() {
  const fetchData = async () => {
    const res = await client.query(query).toPromise();
    console.log("Response: ", res.data.collection);
  };
  useEffect(() => {
    fetchData();
  });
  const { active, account, library } = useWeb3React();
  const marketContract = contracts.marketplace;
  const tokenContract = contracts.token;
  const [name, setName] = useState();
  const [response, setResponse] = useState();
  const profile = contracts.defaultProfile;
  const provider = library;

  return (
    <div>
      <div style={{ cursor: "pointer", marginTop: "30px" }}></div>
      <h1 style={{ cursor: "pointer", marginTop: "30px" }} onClick={fetchData}>
        fetchData
      </h1>
    </div>
  );
}
