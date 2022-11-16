import { contracts, nftABI } from "../../constants/ABIs";
import { Contract } from "ethers";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const dataQuery = `
query MyQuery($address: ID) {
  collection(id: $address) {
    tokens(first: 1) {
      id
      identifier
      tokenURI
    }
  }
}
`;
export default async function (req, res) {
  let t0 = new Date().getTime();
  const nftContract = new Contract(
    req.body.address,
    nftABI,
    contracts.provider
  );
  const tokenURI = await nftContract.tokenURI(req.body.tokenId);
  const uri = tokenURI.replace(
    "ipfs://",
    "https://ipfsfiles.distant.finance/ipfs/"
  );
  const tokenDetails = await fetch(uri).then((res) => res.json());
  const image = tokenDetails.image.replace(
    "ipfs://",
    "https://ipfsfiles.distant.finance/ipfs/"
  );
  let tokenDetail = { ...tokenDetails, image };
  let t1 = new Date().getTime();
  let time1 = t1 - t0;
  let g0 = new Date().getTime();
  let data1;
  const client = new ApolloClient({
    uri: contracts.queryUrl,
    cache: new InMemoryCache(),
  });
  await client
    .query({
      query: gql(dataQuery),
      variables: {
        address: req.body.address,
      },
    })
    .then((data) => {
      data1 = data.data.collection.tokens;
    })
    .catch((err) => console.log("Error fetching data: ", err));
  const content = await fetch(data1[0].tokenURI).then((res) => res.json());
  let g1 = new Date().getTime();
  let time2 = g1 - g0;
  const obj = {
    tokenDetail,
    time1,
    content,
    time2,
  };
  res.json(obj);
}
