import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import Link from "next/link";
import { connectors } from "./connectors";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { contracts } from "./ABIs";
import { utils } from "ethers";
import Image from "next/image";
import styles from "../styles/Connect.module.css";
export default function Connect() {
  const { active, account, chainId, library, activate, deactivate } =
    useWeb3React();
  const provider = library;
  const [kcsBalance, setKcsBalance] = useState(null);
  const [usdtBalance, setUsdtBalance] = useState(null);
  const bal = async () => {
    const balance = await provider.getBalance(account);
    const userBalance = utils.formatEther(balance);
    const kcs = userBalance.substring(0, 4);
    setKcsBalance(kcs);
    const balanceUsdt = await contracts.tokenInstance.balanceOf(account);
    let usdtbalance = utils.formatEther(balanceUsdt);
    const usdt = usdtbalance.substring(0, 6);
    setUsdtBalance(usdt);
  };
  if (active) {
    bal();
  }

  async function inChain() {
    if (!window.ethereum) {
      alert(
        "Metamask is not installed on your Browser. Install via https://metamask.io/download"
      );
      return false;
    }
    if (chainId === "0x141") {
      return true;
    }
    try {
      await window.ethereum.request({
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
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x141",
                chainName: "KCC-MAINNET",
                rpcUrls: ["https://rpc-mainnet.kcc.network"],
                nativeCurrency: {
                  name: "KCS Token",
                  symbol: "KCS",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer.kcc.io/en"],
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

  useEffect(() => {
    const docCheck = () =>
      typeof window !== "undefined" && connectModal
        ? (document.body.style.overflowY = "hidden !important")
        : (document.body.style.overflowX = "hidden");
    docCheck();
  }, [connectModal, disconnectModal]);

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
            <div
              className={styles.closeModal}
              onClick={() => setConnectModal(false)}
            >
              <IoIosCloseCircleOutline />
            </div>
            <div className={styles.modalMenu}>
              <div className={styles.modalInternal}>
                <h1>Connect Wallet</h1>
                <div className={styles.wallets}>
                  <p>
                    Select an option to connect your wallet to the Marketplace
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
                      <span>WalletConnect</span>
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
                <div className={styles.tutorial}>
                  <Link href="https://docs.distant.finance">
                    <a>Setting up a wallet for the first time?</a>
                  </Link>
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
              <IoIosCloseCircleOutline />
            </div>
            <div className={styles.smallBoard}>
              <Link href={`https://scan.kcc.io/address/${account}`}>
                <a>
                  <p>
                    {`${account.slice(0, 5)}...${account.slice(39, 42)}`}{" "}
                    <BsBoxArrowUpRight />
                  </p>
                </a>
              </Link>
              <p>KCS balance: {kcsBalance}</p>
              <p>USDT balance: {usdtBalance}</p>
              <button onClick={disconnect}>Disconnect</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
