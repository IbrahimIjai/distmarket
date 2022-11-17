import { contracts } from "../../../../constants/ABIs";
import { utils } from "ethers";
import { createClient } from "redis";
export default async function (req, res) {
  const { nftId, collection, salePrice } = req.body;
  const redis = createClient({ url: contracts.redis });
  redis.on("error", (err) =>
    console.log("Redis Client Error in Offers Info", err)
  );
  await redis.connect();
  const data = await redis.get(`${collection}/${nftId}/offersinfo`);
  if (data) {
    res.json(JSON.parse(data));
  } else {
    const contract = contracts.contractInstance;
    const offerInfo = await contract.availableOffers(collection, nftId);
    const collectionInfo = await contract.collection(collection);
    //Offers section
    const [offerCreatorAddress, tempOfferValue] = offerInfo;
    const offerValue = tempOfferValue.map((value) => value[1].toString());
    const priceDifference = [];
    const percentageDifference = () => {
      const values = offerValue.map((val) => Number(utils.formatEther(val)));
      const saleValue = Number(salePrice);
      values.map((val) => {
        if (val > saleValue) {
          priceDifference.push((val / saleValue) * 100 - 100);
        } else if (val < saleValue) {
          priceDifference.push(-Math.abs((saleValue / val) * 100 - 100));
        } else {
          priceDifference.push(val - saleValue);
        }
      });
    };
    offerInfo[0].length > 0 && percentageDifference();
    const offer = [];
    for (let i = 0; i < offerCreatorAddress.length; i++) {
      let object = {
        address: offerCreatorAddress[i],
        value: Number(utils.formatEther(offerValue[i])),
        floorDifference: priceDifference[i].toPrecision(4),
      };
      offer.push(object);
    }
    const bestOffers =
      offerInfo[0].length > 0 &&
      offerValue.map((value) => utils.formatEther(value));
    const highestOffer =
      bestOffers.length > 0
        ? bestOffers.reduce((acc, cur) =>
            Number(acc) > Number(cur) ? Number(acc) : Number(cur)
          )
        : 0;
    const objectData = {
      highestOffer,
      offer,
      collectionInfo,
      offerCreatorAddress,
    };
    await redis.setEx(
      `${collection}/${nftId}/offersinfo`,
      60,
      JSON.stringify(objectData)
    );
    res.json(objectData);
  }
  await redis.disconnect();
}
