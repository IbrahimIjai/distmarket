import { contracts } from "../../../../constants/ABIs";
import { createClient } from "redis";
import { utils } from "ethers";
export default async function (req, res) {
  const collection = req.body.collection;
  const redis = createClient();
  await redis.connect();
  const listedNftsData = await redis.get(`${collection}/listed`);
  if (listedNftsData) {
    res.json(JSON.parse(listedNftsData));
  } else {
    const results = await contracts.contractInstance.availableListings(
      collection
    );
    const [tempNftIds, tempListingInfo] = results;
    const nftIds = tempNftIds.map((nftId) => nftId.toString());
    const listingPrices = tempListingInfo.map((info) => info[1].toString());
    const addresses = tempListingInfo.map((data) => data[0]);
    const listingInfo = [];
    for (let i = 0; i < listingPrices.length; i++) {
      const object = {
        nftId: nftIds[i],
        address: addresses[i],
        salePrice: utils.formatEther(listingPrices[i]),
      };
      listingInfo.push(object);
    }
    await redis.setEx(`${collection}/listed`, 600, JSON.stringify(listingInfo));
    res.json(listingInfo);
  }
  await redis.disconnect();
}
