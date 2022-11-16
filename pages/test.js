import { useEffect, useState } from "react";
import { contracts } from "../constants/ABIs";

export default function Test() {
  const [data, setData] = useState(null);
  const main = async () => {
    const res = await fetch("/api/redis").then((res) => res.json());
    setData(res.story);
    console.log(res);
  };
  const address = [
    "0x3b12cd8b30dcf4fd9db69ce125183ac7ca567472",
    "0xcb7ca3634b28b539081763f8a0adba996f62452a",
    "0x6a8e46eb4459c9ae7f63292563f141af50259234",
  ];
  let data1 = { collection: "0x3b12cd8b30dcf4fd9db69ce125183ac7ca567472" };
  useEffect(() => {
    const main = async () => {
      const contract = contracts.contractInstance;
      const offerInfo = await contract.availableOffers(data1.collection, "18");
      console.log(offerInfo, "Function call with no Offers");
    };
    main();
  }, []);
  // useEffect(() => {
  //   const main = async () => {
  //     console.log("In useEffect", data1);
  //     const data = await fetch(
  //       "api/blockchain/collection/nftcollectiondetails",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(data1),
  //       }
  //     )
  //       .then((res) => res.json())
  //       .catch((err) => console.log(err));
  //     console.log(data);
  //   };
  //   main();
  // }, []);
  return <div onClick={main}>Story Title: {data && <span>{data}</span>}</div>;
}
