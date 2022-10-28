import { useState, useEffect, useMemo } from "react";
import { contracts, nftABI } from "../constants/ABIs";

const PopularCollection = () => {
  let addr = "0x3b12cd8b30dcf4fd9db69ce125183ac7ca567472";
  const copy = async () => {
    await navigator.clipboard.writeText(addr);
    alert("Text copied");
  };
  return <div onClick={copy}>Copy</div>;
};
export default PopularCollection;
