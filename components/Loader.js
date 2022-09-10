import React from "react";
import ReactDOM from "react-dom";
import ContentLoader from "react-content-loader";

const Loader = () => (
  <ContentLoader viewBox="0 0 100 100" height={"100vmax"} width={"100vw"}>
    <rect x="0" y="0" rx="1" ry="1" width="99%" height="50%" />
    <rect x="5%" y="51%" width="90%" height="10%" />
    <rect x="1%" y="65%" width="30%" height="38%" />
    <rect x="33%" y="65%" width="30%" height="38%" />
    <rect x="65%" y="65%" width="30%" height="38%" />
  </ContentLoader>
);
export default Loader;
