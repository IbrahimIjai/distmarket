import { createClient } from "redis";
import { contracts, nftABI } from "../../../../constants/ABIs";
import { Contract } from "ethers";
export default async function handler(req, res) {
  const { data, profile } = req.body;
  const redis = createClient({ url: contracts.redis });
  await redis.connect();
  const nftdata = await redis.get(`${profile}/nftData`);
  if (nftdata) {
    res.json(JSON.parse(nftdata));
  } else {
    const Kuorks = "0x2ca9ee122915e76a9e64f0c2eeb8c233397ed248";
    const KuOrks = new Contract(Kuorks, nftABI, contracts.provider);
    const array = [];
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].tokenURI);
      if (data[i].tokenURI !== null) {
        const url = data[i].tokenURI.includes("ipfs://", 0)
          ? data[i].tokenURI.replace(
              "ipfs://",
              "https://ipfsfiles.distant.finance/ipfs/"
            )
          : data[i].tokenURI;
        if (data[i].collection.id == Kuorks) {
          const kuOrkUri = await KuOrks.tokenURI(data[i].identifier);
          const kuOrkUrl = kuOrkUri.replace(
            "ipfs://",
            "https://ipfsfiles.distant.finance/ipfs/"
          );
          const kuOrkData = await fetch(kuOrkUrl)
            .then((res) => res.json())
            .catch((err) => console.log(err));
          const image = kuOrkData.image.includes("ipfs://", 0)
            ? kuOrkData.image.replace(
                "ipfs://",
                "https://ipfsfiles.distant.finance/ipfs/"
              )
            : kuOrkData.image;
          const obj = {
            name: kuOrkData.name,
            image: image,
            tokenId: data[i].identifier,
            collection: data[i].collection.id,
          };
          array.push(obj);
        } else {
          const link = await fetch(url)
            .then((res) => res.json())
            .catch((err) => {
              console.log(err);
            });
          const image = link.image.includes("ipfs://", 0)
            ? link.image.replace(
                "ipfs://",
                "https://ipfsfiles.distant.finance/ipfs/"
              )
            : link.image;
          const obj = {
            name: link.name,
            image: image,
            tokenId: data[i].identifier,
            collection: data[i].collection.id,
          };
          array.push(obj);
        }
        array.length > 0 &&
          (await redis.setEx(`${profile}/nftData`, 300, JSON.stringify(array)));
        return res.json(array);
      }
      // } else
      //   res.status(404).json({ error: "Token URI of null is not accessible" });
    }
    await redis.disconnect();
  }
  return;
}
