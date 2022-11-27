import { contracts, nftABI } from "../../../../constants/ABIs";
import { Contract } from "ethers";
import { createClient } from "redis";
export default async function handler(req, res) {
  const { nftId, collection } = req.body;
  const redis = createClient({ url: contracts.redis });
  redis.on("error", (err) => {
    console.log("Redis Client Error in NFT ID Server Side", err);
    throw new Error("Errors too much");
  });
  await redis.connect();
  const data = await redis.get(`${collection}/${nftId}/server`);
  if (data) {
    res.json(JSON.parse(data));
  } else {
    const contract = contracts.contractInstance;
    const instance = new Contract(collection, nftABI, contracts.provider);
    const nftSaleInfo = await contract.sellNFT(collection, nftId);
    const tokenDetails = await instance.tokenURI(nftId);
    const owner = await instance.ownerOf(nftId);
    const ipfsLink = tokenDetails.includes("ipfs://", 0)
      ? tokenDetails.replace(
          "ipfs://",
          "https://ipfsfiles.distant.finance/ipfs/"
        )
      : tokenDetails;
    const { image, description, name, attributes } = await fetch(ipfsLink).then(
      (r) => r.json()
    );
    const imageLink = image.includes("ipfs://", 0)
      ? image.replace("ipfs://", "https://ipfsfiles.distant.finance/ipfs/")
      : image;
    const collectionName = await instance.name();
    const ipfsData = [];
    ipfsData.push(
      imageLink,
      description,
      name,
      attributes,
      collectionName,
      owner
    );
    const dataContainer = {
      ipfsData,
      nftSaleInfo,
    };
    await redis.setEx(
      `${collection}/${nftId}/server`,
      300,
      JSON.stringify(dataContainer)
    );
    res.json(dataContainer);
  }
  await redis.disconnect();
}
