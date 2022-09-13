import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { connectors } from "./connectors";
import Image from "next/image";
import styles from "../styles/Connect.module.css";
export default function Connect() {
  const { active, account, library, chainId, activate, deactivate, connector } =
    useWeb3React();

  async function inChain() {
    if (!library) {
      return false;
    }
    if (library.provider.chainId === "0x141") {
      return true;
    }
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x141" }],
      });
      return true;
    } catch (switchError) {
      if (
        switchError.code === 4902 ||
        switchError.data?.originalError?.code === 4902
      ) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x141",
                chainName: "KCC Mainnet",
                nativeCurrency: "KCS",
                rpcUrls: "https://rpc-mainnet.kcc.network",
                blockExplorerUrls: "https://kccscan.io",
              },
            ],
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        console.error(switchError);
      }
    }
    return false;
  }

  const connect = async () => {
    try {
      await activate(connectors.injected);
      await inChain();
      window.localStorage.setItem("isWalletConnected", true);
      setConnectModal(false);
    } catch (error) {
      console.log(error);
    }
  };
  const connectWC = async () => {
    try {
      await activate(connectors.walletConnect);
      window.localStorage.setItem("isWalletConnected", true);
      setConnectModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const disconnect = async () => {
    try {
      deactivate(connectors.injected);
      window.localStorage.setItem("isWalletConnected", false);
      setDisconnectModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(connectors.injected);
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  const [connectModal, setConnectModal] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState(false);

  return (
    <div className={styles.container}>
      {active ? (
        <div
          className={styles.disconnect}
          onClick={() => setDisconnectModal(true)}
        >{`${account.slice(0, 5)}...${account.slice(38, 42)}`}</div>
      ) : (
        <div className={styles.connect} onClick={() => setConnectModal(true)}>
          Connect
        </div>
      )}
      {connectModal && (
        <div className={styles.modalContainer}>
          <div className={styles.modal}>
            <div>
              <div
                className={styles.closeModal}
                onClick={() => setConnectModal(false)}
              >
                X
              </div>
            </div>
            <div className={styles.modalMenu}>
              <div className={styles.modalInternal}>
                <h1>Connect wallet</h1>
                <div className={styles.wallets}>
                  <p>
                    connect wallet here, make sure you have kcc network
                    installed
                  </p>
                  <div className={styles.walletLists}>
                    <div className={styles.walletList} onClick={connect}>
                      <Image
                        src="/metamask.png"
                        width={40}
                        height={40}
                        alt="imagelogo"
                      />
                      <span>Metamask</span>
                    </div>
                    <div className={styles.walletList} onClick={connect}>
                      <Image
                        src="/tokenpock.png"
                        width={40}
                        height={40}
                        alt="imagelogo"
                      />
                      <span>TokenPocket</span>
                    </div>
                    <div className={styles.walletList} onClick={connectWC}>
                      <Image
                        src="/walletcon2.png"
                        width={40}
                        height={40}
                        alt="imagelogo"
                      />
                      <span>Wallet Connect</span>
                    </div>
                    <div className={styles.walletList} onClick={connect}>
                      <Image
                        src="/ku.jpg"
                        width={40}
                        height={40}
                        alt="imagelogo"
                      />
                      <span>KuWallet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {disconnectModal && (
        <div className={styles.board}>
          <div>
            <div
              className={styles.closeModal}
              onClick={() => setDisconnectModal(false)}
            >
              X
            </div>
            <div className={styles.smallBoard}>
              <p>{`${account.slice(0, 5)}...${account.slice(39, 42)}`}</p>
              <p>KCS balance: 20</p>
              <p>WKCS balance: 35</p>
              <button onClick={disconnect}>Disconnect</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
