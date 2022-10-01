import Hero from "../Frontpage/Hero";
import RListed from "../Frontpage/RListed";
import PopularCollection from "../Frontpage/PopColl";
import Mint from "../Frontpage/Mint";
import Mint1 from "../Frontpage/Mint1";
import Loader from "../components/Loader";
import { contracts } from "../constants/ABIs";
import { useState } from "react";
export default function Home({ addresses }) {
  const [load, setLoad] = useState(false);
  setTimeout(() => {
    setLoad(true);
  }, 20000);
  return (
    <main>
      {!load && <Loader />}
      <Hero />
      <RListed />
      <PopularCollection address={addresses} />
      <Mint1 />
      <Mint />
    </main>
  );
}

export async function getServerSideProps({ res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=43200, stale-while-revalidate=60"
  );
  const addresses = await contracts.contractInstance.supportedCollections();
  return {
    props: {
      addresses: addresses,
    },
  };
}
