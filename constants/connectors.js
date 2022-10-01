import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const injected = new InjectedConnector({
  supportedChainIds: [80001],
});

const walletconnect = new WalletConnectConnector({
  rpc: {
    80001: "https://matic-testnet-archive-rpc.bwarelabs.com",
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
};
