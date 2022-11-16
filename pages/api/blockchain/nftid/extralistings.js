import { contracts, nftABI } from "../../../../constants/ABIs";
import { Contract, utils } from "ethers";
import { createClient } from "redis";
export default async function (req, res) {
  const { nftId, collection } = req.body;
  const redis = createClient();
  redis.on("error", (err) =>
    console.log("Redis Client Error in Extra Listings", err)
  );
  await redis.connect();
  const data = await redis.get(`${collection}/${nftId}/extralistings`);
  if (data) {
    res.json(JSON.parse(data));
  } else {
    const contract = contracts.contractInstance;
    const instance = new Contract(collection, nftABI, contracts.provider);
    const threeListings = await contract.availableListings(collection);
    const nftListings = threeListings[0].slice(-2);
    const listingDetails = threeListings[1].slice(-2);
    const extraListings = [];
    const numValue = nftListings.map((listing) => listing.toNumber());
    const hex = listingDetails.map((hexVal) => hexVal[1]);
    for (let i = 0; i < numValue.length; i++) {
      if (numValue[i] !== Number(nftId)) {
        const tokenDetails = await instance.tokenURI(numValue[i]);
        const ipfsLink = tokenDetails.includes("ipfs://", 0)
          ? tokenDetails.replace(
              "ipfs://",
              "https://ipfsfiles.distant.finance/ipfs/"
            )
          : tokenDetails;
        const { image, name } = await fetch(ipfsLink).then((r) => r.json());
        const imageUrl = image.includes("ipfs://", 0)
          ? image.replace("ipfs://", "https://ipfsfiles.distant.finance/ipfs/")
          : image;
        const obj = {
          image: imageUrl,
          name: name,
          value: utils.formatEther(hex[i]),
          tokenId: numValue[i],
        };
        extraListings.push(obj);
      }
    }
    await redis.setEx(
      `${collection}/${nftId}/extralistings`,
      300,
      JSON.stringify(extraListings)
    );
    res.json(extraListings);
  }
  await redis.disconnect();
}
