import { contracts } from "../../../../constants/ABIs";
import { BigNumber, utils } from "ethers";
import { createClient } from "redis";
export default async function handler(req, res) {
  const { listings, collection } = req.body;
  const redis = createClient({ url: contracts.redis });
  await redis.connect();
  const data = await redis.get(`${collection}/collectionstats`);
  if (data) {
    res.json(JSON.parse(data));
  } else {
    //Get all offers for each NFT
    let allOffer = [];
    for (let i = 0; i < listings.length; i++) {
      const allOffers = await contracts.contractInstance.availableOffers(
        collection,
        listings[i].nftId
      );
      const offersData = allOffers[1].map((offers) => offers[1]);
      const offers = offersData.map((offer) => {
        const hexValue = offer._hex;
        return parseInt(hexValue, 16);
      });
      const offerValues = offers.map((offer) => {
        const v = BigNumber.from(offer.toString());
        return utils.formatEther(v);
      });
      allOffer.push(offerValues);
    }
    // Get best Offers from each offer
    const bestOffers = allOffer.map((offer) => {
      if (offer.length > 1) {
        return offer.reduce((cur, prev) =>
          Number(cur) > Number(prev) ? Number(cur) : Number(prev)
        );
      }
      return offer;
    });
    // Floor price
    const prices = listings.map((listing) => listing.salePrice);
    const lowestValue =
      prices.length > 0 &&
      prices.reduce((acc, cur) => (Number(acc) < Number(cur) ? acc : cur));
    // Highest offer for all listed NFTs
    const highestOffer =
      bestOffers.length > 0
        ? bestOffers.reduce((acc, cur) =>
            Number(acc) > Number(cur) ? Number(acc) : Number(cur)
          )
        : 0;
    const statObject = {
      floor: lowestValue,
      listed: prices.length,
      highestOffer,
      bestOffers,
    };
    statObject.floor !== undefined &&
      (await redis.setEx(
        `${collection}/collectionstats`,
        600,
        JSON.stringify(statObject)
      ));
    res.json(statObject);
  }
  await redis.disconnect();
}
