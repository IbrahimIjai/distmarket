import { useState, useEffect, useMemo } from "react";
import { contracts, nftABI } from "../constants/ABIs";

const PopularCollection = () => {
  let addr = "0x3b12cd8b30dcf4fd9db69ce125183ac7ca567472";
  const main = async () => {
    console.log(await contracts.fetchCollection(addr));
  };
  return <div onClick={main}>Hello</div>;
};
export default PopularCollection;
