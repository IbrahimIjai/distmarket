import { contracts } from "../../../../constants/ABIs";
import { createClient } from "redis";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const dataQuery = `
 query queryData($address: ID, $collections: String) {
  account(id: $address) {
    tokens(where: {collection: $collections}) {
      identifier
      tokenURI
      collection{
        id
      }
    }
  }
}`;
export default async function handler(req, res) {
  const profile = req.body.profile;
  const redis = createClient({
    url: contracts.redis,
  });
  await redis.connect();
  const profileData = await redis.get(`${profile}/profiledata`);
  if (profileData) {
    res.json(JSON.parse(profileData));
  } else {
    const code = await contracts.provider.getCode(profile);
    const collections = await contracts.contractInstance.supportedCollections();
    const dataArray = [];
    if (code === "0x") {
      for (let i = 0; i < collections.length; i++) {
        const client = new ApolloClient({
          uri: contracts.queryUrl,
          cache: new InMemoryCache(),
        });
        await client
          .query({
            query: gql(dataQuery),
            variables: {
              address: profile.toLowerCase(),
              collections: collections[i].toLowerCase(),
            },
          })
          .then((data) => {
            let temp = data.data.account.tokens;
            temp.length > 0 && dataArray.push(...temp);
          })
          .catch((err) => console.log("Error fetching data: ", err));
      }
    }
    let indexValue = null;
    if (dataArray.length > 0) {
      const index = Math.floor(Math.random() * dataArray.length);
      indexValue = index;
    }
    const dataObject = {
      dataArray,
      code,
      indexValue,
    };
    indexValue &&
      (await redis.setEx(
        `${profile}/profiledata`,
        600,
        JSON.stringify(dataObject)
      ));
    res.json(dataObject);
  }
  await redis.disconnect();
}
