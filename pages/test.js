import { ethers, utils } from "ethers";
import { contracts } from "../constants/ABIs";
import { useWeb3React } from "@web3-react/core";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const APIURL = "https://api.thegraph.com/subgraphs/name/steffqing/721-clone";
const collectionDataQuery = `
query MyQuery ($address: ID){
  collection(id: $address) {
    name
    symbol
    topSale
    totalSales
    totalVolume
  }
}
`;

export default function Test() {
  const collectionsDetails = [];
  const add = [
    "0xC175E2B0C7ef81612df5Eb45b1d64DbE9C527803",
    "0x87E87c33384f599498CB24D66135f797ED57DbEF",
    "0x81D028A07Fd843C549b9C634cb9E99419c42a0Ee",
    "0xBE3bbf00ce1b8F27CA21821B15CBe39d816416B0",
    "0x02f0A9f1e8C1B58107D1c8740d49Ad2999A45c67",
  ];
  add.map((address) => {
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });
    client
      .query({
        query: gql(collectionDataQuery),
        variables: {
          address: address.toLowerCase(),
        },
      })
      .then((data) => {
        collectionsDetails.push(data.data.collection);
      })
      .catch((err) => console.log("Error fetching data: ", err));
  });
  return <div>Get Balance</div>;
}
