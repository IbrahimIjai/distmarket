import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { contracts } from "../../../constants/ABIs";
import { utils } from "ethers";
import { createClient } from "redis";

const collectionDataQuery = `
query MyQuery ($address: ID){
  collection(id: $address) {
    id
    name
    totalSupply
    totalVolume
    totalSales
    topSale
  }
}
`;
export default async function handler(req, res) {
  const redis = createClient({
    url: contracts.redis,
  });
  redis.on("error", (err) =>
    console.log("Redis Client Error in Top Collections", err)
  );
  await redis.connect();
  const data = await redis.get("topCollections");
  if (data) {
    res.json(JSON.parse(data));
    // return;
  } else {
    const address = req.body;
    const collectionsDetails = [];
    for (let i = 0; i < address.length; i++) {
      let object;
      const client = new ApolloClient({
        uri: contracts.queryUrl,
        cache: new InMemoryCache(),
      });
      await client
        .query({
          query: gql(collectionDataQuery),
          variables: {
            address: address[i].toLowerCase(),
          },
        })
        .then((data) => (object = data.data.collection))
        .catch((err) => console.log("Error fetching data: ", err));

      const ipfsData = await contracts.fetchCollection(address[i]);
      const image = ipfsData.small.replace(
        "ipfs://",
        "https://ipfsfiles.distant.finance/ipfs/"
      );
      const results = await contracts.contractInstance.availableListings(
        address[i]
      );
      const listings = results[1];
      if (listings.length > 0) {
        const prices = listings.map((listing) => utils.formatEther(listing[1]));
        const lowestValue =
          prices.length > 0 &&
          prices.reduce((acc, cur) => (Number(acc) < Number(cur) ? acc : cur));
        const obj = {
          image,
          floor: lowestValue,
          items: prices.length,
          name: object.name,
          address: object.id,
          topSale: object.topSale,
          totalSupply: object.totalSupply,
          totalSales: object.totalSales,
          totalVolume: object.totalVolume,
        };
        collectionsDetails.push(obj);
      }
    }
    collectionsDetails.length > 0 &&
      (await redis.setEx(
        "topCollections",
        3600,
        JSON.stringify(collectionsDetails)
      ));
    res.json(collectionsDetails);
    // return;
  }
}
