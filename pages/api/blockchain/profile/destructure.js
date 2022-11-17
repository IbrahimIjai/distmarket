import { createClient } from "redis";
import { contracts } from "../../../../constants/ABIs";
export default async function (req, res) {
  const { data, profile } = req.body;
  const redis = createClient({ url: contracts.redis });
  await redis.connect();
  const nftdata = await redis.get(`${profile}/nftData`);
  if (nftdata) {
    res.json(JSON.parse(nftdata));
  } else {
    const array = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].tokenURI !== null) {
        const url = data[i].tokenURI.includes("ipfs://", 0)
          ? data[i].tokenURI.replace(
              "ipfs://",
              "https://ipfsfiles.distant.finance/ipfs/"
            )
          : data[i].tokenURI;
        const link = await fetch(url)
          .then((res) => res.json())
          .catch((err) => console.log(err, "Error fetching"));
        const image =
          link && link.image.includes("ipfs://", 0)
            ? link.image.replace(
                "ipfs://",
                "https://ipfsfiles.distant.finance/ipfs/"
              )
            : link.image;
        const obj = {
          name: link ? link.name : "NFT",
          image: link ? image : "",
          tokenId: data[i].identifier,
          collection: data[i].collection.id,
        };
        array.push(obj);
      }
    }
    array.length > 0 &&
      (await redis.setEx(`${profile}/nftData`, 300, JSON.stringify(array)));
    res.json(array);
  }
  await redis.disconnect();
}
