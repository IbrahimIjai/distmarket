import "../styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import Layout from "../components/Layout";
import { Web3Provider } from "@ethersproject/providers";
//import { createClient, Provider } from "urql";

// const client = createClient({
//   url: "https://api.thegraph.com/subgraphs/name/steffqing/721-clone",
// });

const getLibrary = (provider) => {
  return new Web3Provider(provider);
};

function MyApp({ Component, pageProps }) {
  return (
    // <Provider value={client}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3ReactProvider>
    // {/* </Provider> */}
  );
}

export default MyApp;
