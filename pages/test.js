import { Contract, ethers, utils } from "ethers";
import { contracts, marketplaceABI } from "../constants/ABIs";
import { useWeb3React } from "@web3-react/core";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const APIURL = "https://api.thegraph.com/subgraphs/name/steffqing/721-clone";
const collectionDataQuery = `
query MyQuery ($address: ID){
  collection(id: $address) {
    id
    name
    totalSupply
    totalVolume
  }
}
`;

export default function Test() {
  const main = async () => {
    const collectionsDetails = [];
    const addresses = await contracts.contractInstance.supportedCollections();
    console.log(addresses);
    addresses.map((address) => {
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
          console.log(collectionsDetails);
        })
        .catch((err) => console.log("Error fetching data: ", err));
    });
  };
  return <div onClick={main}>Get Balance</div>;
}
