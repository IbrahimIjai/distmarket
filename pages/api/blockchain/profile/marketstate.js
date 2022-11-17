import { contracts } from "../../../../constants/ABIs";
import { createClient } from "redis";
export default async function (req, res) {
  const { collection, tokenId, profile } = req.body;
  const redis = createClient({
    url: `redis://default:${process.env.REACT_REDISKEY}@redis-19871.c258.us-east-1-4.ec2.cloud.redislabs.com:19871`,
  });
  await redis.connect({ url: contracts.redis });
  const marketStateData = await redis.get(`${profile}/marketState`);
  if (marketStateData) {
    res.json(JSON.parse(marketStateData));
  } else {
    const contract = contracts.contractInstance;
    const marketState = [];
    for (let i = 0; i < collection.length; i++) {
      const listingExists = await contract.sellNFT(collection[i], tokenId[i]);
      const offersExists = await contract.availableOffers(
        collection[i],
        tokenId[i]
      );
      const listingTrue =
        listingExists[0] === contracts.deadAddress ? false : true;
      const offerTrue = offersExists[0].length > 0 ? true : false;
      const trueObject = {
        listingTrue,
        offerTrue,
      };
      marketState.push(trueObject);
    }
    marketState.length > 0 &&
      (await redis.setEx(
        `${profile}/marketState`,
        300,
        JSON.stringify(marketState)
      ));
    res.json(marketState);
  }
  await redis.disconnect();
}
