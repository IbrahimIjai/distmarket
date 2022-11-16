import { contracts, nftABI } from "../../../../constants/ABIs";
import { Contract } from "ethers";
import { createClient } from "redis";
export default async function (req, res) {
  const { listings, bestOffers, collection } = req.body;
  const redis = createClient();
  await redis.connect();
  const dataNfts = await redis.get(`${collection}/listedNfts`);
  if (dataNfts) {
    res.json(JSON.parse(dataNfts));
  } else {
    const contract = new Contract(collection, nftABI, contracts.provider);
    // Call data from contracts for the NFts
    const names = [];
    const imagelinks = [];
    for (let i = 0; i < listings.length; i++) {
      const tokenUri = await contract.tokenURI(listings[i].nftId);
      const link = tokenUri.includes("ipfs://", 0)
        ? tokenUri.replace("ipfs://", "https://ipfsfiles.distant.finance/ipfs/")
        : tokenUri;
      const data = await fetch(link).then((r) => r.json());
      const image = data.image.includes("ipfs://", 0)
        ? data.image.replace(
            "ipfs://",
            "https://ipfsfiles.distant.finance/ipfs/"
          )
        : data.image;
      names.push(data.name);
      imagelinks.push(image);
    }
    const arr = [];
    for (let i = 0; i < listings.length; i++) {
      const object = {
        tokenId: listings[i].nftId,
        seller: listings[i].address,
        price: listings[i].salePrice,
        image: imagelinks[i],
        bestOffer: bestOffers[i],
        name: names[i],
      };
      arr.push(object);
    }
    await redis.setEx(`${collection}/listedNfts`, 360, JSON.stringify(arr));
    res.json(arr);
  }
  await redis.disconnect();
}
