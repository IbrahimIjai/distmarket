import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { contracts } from "../../../../constants/ABIs";
import { createClient } from "redis";
const collectionDataQuery = `
  query collectionDataQuery($address: ID){
    collection(id: $address){
      name
      totalSupply
      totalVolume
    }
  }
`;
export default async function (req, res) {
  const collection = req.body.collection;
  const redis = createClient();
  await redis.connect();
  const collectionDetails = await redis.get(`${collection}/details`);
  if (collectionDetails) {
    res.json(JSON.parse(collectionDetails));
  } else {
    let objectData = {};
    const client = new ApolloClient({
      uri: contracts.queryUrl,
      cache: new InMemoryCache(),
    });
    await client
      .query({
        query: gql(collectionDataQuery),
        variables: {
          address: collection.toLowerCase(),
        },
      })
      .then((data) => {
        let content = data.data.collection;
        objectData = content;
      })
      .catch((err) => console.log("Error fetching data: ", err));
    const data = await contracts.fetchCollection(collection.toLowerCase());
    const { totalSupply, totalVolume } = objectData;
    const { name, description, banner, small, twitter, telegram, discord } =
      data;
    const bannerImage = banner.replace(
      "ipfs://",
      "https://ipfsfiles.distant.finance/ipfs/"
    );
    const smallImage = small.replace(
      "ipfs://",
      "https://ipfsfiles.distant.finance/ipfs/"
    );
    const obj = {
      totalSupply,
      totalVolume,
      name,
      description,
      bannerImage,
      smallImage,
      twitter,
      telegram,
      discord,
    };
    await redis.setEx(`${collection}/details`, 1200, JSON.stringify(obj));
    res.json(obj);
  }
  await redis.disconnect();
}
