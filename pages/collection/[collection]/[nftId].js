import Image from "next/image";
import styles from "../../../styles/nftId.module.css";
import {
  CgFileDocument,
  CgDanger,
  CgDetailsMore,
  CgArrowLongRight,
} from "react-icons/cg";
import { BsFillTagFill } from "react-icons/bs";
import {
  MdOutlineVerifiedUser,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import { Contract, BigNumber, utils } from "ethers";
import {
  marketplaceABI,
  nftABI,
  tokenABI,
  contracts,
} from "../../../constants/ABIs";
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useRouter } from "next/router";
export default function NftId({
  offerInfo,
  nftSaleInfo,
  ipfsData,
  collectionInfo,
  extraListings,
}) {
  //Contract functions
  const { account, library, active } = useWeb3React();
  const router = useRouter();
  const { collection, nftId } = router.query;
  // Loader helper variable
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  ``;
  let highestOfferInitiator = "";
  const [verificationDisplay, setVerificationDisplay] = useState(false);
  const [runEffect, setRunEffect] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const [addressApprovedToSellNft, setAddressApprovedToSellNft] =
    useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [load, setLoad] = useState(false);
  const loadSite = setTimeout(() => {
    setLoad(true);
  }, 3300);
  // Array dependency function
  const init = setTimeout(() => {
    setRunEffect(true);
  }, 300);
  if (active) {
    setTimeout(() => {
      setRunEffect(false);
    }, 2000);
    clearTimeout(init);
    clearTimeout(loadSite);
  }
  //Get User balance
  useEffect(() => {
    const main = async () => {
      if (active) {
        const balance = await contracts.tokenInstance.balanceOf(account);
        const accountBalance = utils.formatEther(balance);
        setUserBalance(accountBalance);
      }
      const nftContract = new Contract(collection, nftABI, contracts.provider);
      const nftApproved = await nftContract.getApproved(nftId);
      setAddressApprovedToSellNft(nftApproved.toLowerCase());
    };
    main();
  }, [runEffect]);
  // Contracts and constant addresses
  const marketContract = contracts.marketplace;
  const tokenContract = contracts.token;
  const deadAddress = contracts.deadAddress;
  const genericAmount = "1000000000000000000000";
  // Constant States
  const [state, setState] = useState(false);
  const [attr, setAttr] = useState(false);
  const [desc, setDesc] = useState(false);
  // Props from getServerSideProps function. Destructuring and assignments
  const sellingPrice = BigNumber.from(nftSaleInfo[1].hex);
  const salePrice = utils.formatEther(sellingPrice);
  //Offers section
  const offerer = [];
  const offerValue = [];
  offerInfo &&
    offerInfo.map((offer) => {
      offerer.push(offer[0]);
      offerValue.push(parseInt(offer[1].hex, 16).toString());
    });
  const priceDifference = [];
  const percentageDifference = () => {
    const values = offerValue.map((val) => Number(utils.formatEther(val)));
    const saleValue = Number(salePrice);
    values.map((val) => {
      if (val > saleValue) {
        priceDifference.push((val / saleValue) * 100 - 100);
      } else if (val < saleValue) {
        priceDifference.push(-Math.abs((saleValue / val) * 100 - 100));
      } else {
        priceDifference.push(val - saleValue);
      }
    });
  };
  offerInfo && percentageDifference();
  const offer = [];
  for (let i = 0; i < offerer.length; i++) {
    let object = {
      address: offerer[i],
      value: Number(utils.formatEther(offerValue[i])),
      floorDifference: priceDifference[i].toPrecision(4),
    };
    offer.push(object);
  }
  const bestOffers =
    offerInfo && offerValue.map((value) => utils.formatEther(value));
  const highestOffer =
    bestOffers.length > 0 &&
    bestOffers.reduce((acc, cur) =>
      Number(acc) > Number(cur) ? Number(acc) : Number(cur)
    );
  // State values for watching modals and inputs
  const [loading, setLoading] = useState(false);
  const [createOfferValue, setCreateOfferValue] = useState();
  const [updateOfferValue, setUpdateOfferValue] = useState();
  const [listingValue, setListingValue] = useState();
  const [updateListingValue, setUpdateListingValue] = useState();
  const [updateListingModal, setUpdateListingModal] = useState(false);
  const [createListing, setCreateListing] = useState(false);
  const [createOfferModal, setCreateOfferModal] = useState(false);
  const [updateOfferModal, setUpdateOfferModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  // Write into State functions
  const writeValue = (e) => {
    setListingValue((value) => e.target.value);
  };
  const writeUpdatedValue = (e) => {
    setUpdateListingValue((value) => e.target.value);
  };
  const writeOffer = (e) => {
    setCreateOfferValue((value) => e.target.value);
  };
  const writeUpdatedOffer = (e) => {
    setUpdateOfferValue((value) => e.target.value);
  };
  // Modals popup
  const updateListingModalPop = () => {
    setUpdateListingModal(true);
  };
  const sellNftModal = () => {
    setCreateListing(true);
  };
  const deadSwitch = async () => {
    console.log("Not executable");
  };
  const createOfferModalPop = () => {
    setCreateOfferModal(true);
  };
  const createUpdateOfferModalPop = () => {
    setUpdateOfferModal(true);
  };
  // Contract functions
  const approveUSDT = async (signer) => {
    try {
      const tokenContractInstance = new Contract(
        tokenContract,
        tokenABI,
        signer
      );
      if (Number(userBalance) > Number(salePrice)) {
        const approved = await tokenContractInstance.allowance(
          account,
          marketContract
        );
        const approvedAmount = utils.formatEther(approved);
        if (Number(approvedAmount) < Number(salePrice)) {
          const approval = await tokenContractInstance.approve(
            marketContract,
            genericAmount
          );
          setLoading(true);
          await approval.wait();
          approval.hash && setLoading(false);
        } else return;
      } else if (Number(userBalance) < Number(salePrice)) {
        setErrorModal(true);
        setTimeout(() => {
          setErrorModal(false);
        }, 5000);
        setErrorMessage("Balance is too low to execute transaction!");
      }
    } catch (error) {
      if (Number(userBalance) > Number(salePrice)) {
        setErrorModal(true);
        setTimeout(() => {
          setErrorModal(false);
        }, 2000);
        setErrorMessage("An unknown error occured. Try again: Approving USDT!");
      }
      console.log(error);
    }
  };
  const approveNFT = async (signer) => {
    if (signer === marketContract) {
      signer = await library.getSigner();
    }
    try {
      const instance = new Contract(collection, nftABI, signer);
      const approval = await instance.approve(marketContract, nftId);
      setLoading(true);
      await approval.wait();
      approval.hash && setLoading(false);
    } catch (error) {
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
      }, 2000);
      setCreateListing(false);
      setErrorMessage(
        `An unknown error occured. Try again: Approving ${ipfsData[2]}!`
      );
      console.log(error);
    }
  };
  const buyNft = async () => {
    try {
      const signer = await library.getSigner();
      const price = parseInt(utils.parseEther(salePrice)._hex, 16).toString();
      addressApprovedToSellNft === marketContract &&
        (await approveUSDT(signer));
      const contract = new Contract(marketContract, marketplaceABI, signer);
      const tx = await contract.buyNFT(collection, nftId, price);
      setLoading(true);
      await tx.wait();
      tx.hash && setLoading(false);
      router.replace(router.asPath);
    } catch (error) {
      if (!active) {
        setErrorModal(true);
        setTimeout(() => {
          setErrorModal(false);
        }, 2000);
        setErrorMessage("Connect wallet to execute transaction!");
        return;
      }
      if (addressApprovedToSellNft !== marketContract) {
        setErrorModal(true);
        setTimeout(() => {
          setErrorModal(false);
        }, 2000);
        setErrorMessage("Marketplace is not approved to trade NFT!");
        return;
      }
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
      }, 2000);
      setErrorMessage("An unknown error occured. Try again!");
      console.log(error);
    }
  };
  const sellNft = async () => {
    try {
      const val = utils.parseEther(listingValue);
      const signer = await library.getSigner();
      await approveNFT(signer);
      const contract = new Contract(marketContract, marketplaceABI, signer);
      const tx = await contract.list(collection, nftId, val.toString());
      setLoading(true);
      await tx.wait();
      tx.hash && setLoading(false);
      setCreateListing(false);
      router.replace(router.asPath);
    } catch (error) {
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
      }, 2000);
      setCreateListing(false);
      setErrorMessage("An unknown error occured. Try again!");
      console.log(error);
    }
  };
  const cancelListing = async () => {
    try {
      const signer = await library.getSigner();
      const contract = new Contract(marketContract, marketplaceABI, signer);
      const tx = await contract.cancelListing(collection, nftId);
      setLoading(true);
      await tx.wait();
      tx.hash && setLoading(false);
      router.replace(router.asPath);
    } catch (err) {
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
      }, 2000);
      setErrorMessage("An unknown error occured. Try again!");
      console.log(err);
    }
  };
  const updateListing = async () => {
    try {
      const val = utils.parseEther(updateListingValue);
      const signer = await library.getSigner();
      const contract = new Contract(marketContract, marketplaceABI, signer);
      const tx = await contract.updateListing(
        collection,
        nftId,
        val.toString()
      );
      setLoading(true);
      await tx.wait();
      tx.hash && setLoading(false);
      setUpdateListingModal(false);
      router.replace(router.asPath);
    } catch (error) {
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
      }, 2000);
      setUpdateListingModal(false);
      setErrorMessage("An unknown error occured. Try again!");
      console.log(error);
    }
  };
  const makeOffer = async () => {
    try {
      if (active) {
        const signer = await library.getSigner();
        const offerVal = parseInt(
          utils.parseEther(createOfferValue)._hex,
          16
        ).toString();
        const instance = new Contract(tokenContract, tokenABI, signer);
        if (Number(userBalance) > Number(createOfferValue)) {
          const approved = await instance.allowance(account, marketContract);
          const approvedAmount = utils.formatEther(approved);
          if (Number(approvedAmount) < Number(createOfferValue)) {
            const approval = await instance.approve(
              marketContract,
              genericAmount
            );
            setLoading(true);
            await approval.wait();
            approval.hash && setLoading(false);
          }
        } else {
          setErrorModal(true);
          setTimeout(() => {
            setErrorModal(false);
          }, 5000);
          setErrorMessage("Insufficient Balance for approval!");
          setCreateOfferModal(false);
          return;
        }
        const contract = new Contract(marketContract, marketplaceABI, signer);
        const tx = await contract.createOffer(collection, nftId, offerVal);
        setLoading(true);
        await tx.wait();
        tx.hash && setLoading(false);
        setCreateOfferModal(false);
        router.replace(router.asPath);
      } else {
        setErrorModal(true);
        setTimeout(() => {
          setErrorModal(false);
        }, 2000);
        setCreateOfferModal(false);
        setErrorMessage(
          "Please connect your wallet to execute this transaction!"
        );
      }
    } catch (error) {
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
      }, 2000);
      setCreateOfferModal(false);
      setErrorMessage("An unknown error occured. Try again!");
      console.log(error);
    }
  };
  const updateOffer = async () => {
    try {
      const signer = await library.getSigner();
      const offerVal = parseInt(
        utils.parseEther(updateOfferValue)._hex,
        16
      ).toString();
      if (Number(userBalance) > Number(updateOfferValue)) {
        const instance = new Contract(tokenContract, tokenABI, signer);
        const approved = await instance.allowance(account, marketContract);
        const approvedAmount = utils.formatEther(approved);
        if (Number(approvedAmount) < Number(updateOfferValue)) {
          const approval = await instance.approve(marketContract, offerVal);
          setLoading(true);
          await approval.wait();
          approval.hash && setLoading(false);
        }
      } else {
        setErrorModal(true);
        setTimeout(() => {
          setErrorModal(false);
        }, 5000);
        setErrorMessage("New offer value is below Balance!");
        setUpdateOfferModal(false);
      }
      const contract = new Contract(marketContract, marketplaceABI, signer);
      const tx = await contract.updateOffer(collection, nftId, offerVal);
      setLoading(true);
      await tx.wait();
      tx.hash && setLoading(false);
      setUpdateOfferModal(false);
      router.replace(router.asPath);
    } catch (error) {
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
      }, 2000);
      setErrorMessage("An unknown error occured. Try again!");
      console.log(error);
    }
  };
  const cancelOffer = async () => {
    try {
      const signer = await library.getSigner();
      const contract = new Contract(marketContract, marketplaceABI, signer);
      const tx = await contract.cancelOffer(collection, nftId);
      setLoading(true);
      await tx.wait();
      tx.hash && setLoading(false);
      router.replace(router.asPath);
    } catch (error) {
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
      }, 2000);
      setErrorMessage("An unknown error occured. Try again!");
      console.log(error);
    }
  };
  const acceptHighestOffer = async (offerVal, initiator) => {
    try {
      const signer = library.getSigner();
      const instance = new Contract(tokenContract, tokenABI, signer);
      const balance = await instance.balanceOf(highestOfferInitiator);
      const approved = await instance.allowance(
        highestOfferInitiator,
        marketContract
      );
      const initiatorBalance = utils.formatEther(balance);
      const initiatorApproval = utils.formatEther(approved);
      if (
        Number(initiatorBalance) < offerVal ||
        Number(initiatorApproval) < offerVal
      ) {
        setErrorModal(true);
        setTimeout(() => {
          setErrorModal(false);
        }, 3000);
        setErrorMessage(
          "Offer Initiator has insufficient funds/approval for this Transaction. Try someone else!"
        );
        return;
      }
      const contract = new Contract(marketContract, marketplaceABI, signer);
      const tx = await contract.acceptOffer(
        collection,
        nftId,
        highestOfferInitiator
      );
      setLoading(true);
      await tx.wait();
      tx.hash && setLoading(false);
      router.replace(router.asPath);
    } catch (error) {
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
      }, 2000);
      setErrorMessage("An unknown error occured. Try again!");
      console.log(error);
    }
  };
  const acceptAvailableOffer = async (offerVal, initiator) => {
    try {
      const signer = library.getSigner();
      const instance = new Contract(tokenContract, tokenABI, signer);
      const balance = await instance.balanceOf(initiator);
      const approved = await instance.allowance(initiator, marketContract);
      const initiatorBalance = utils.formatEther(balance);
      const initiatorApproval = utils.formatEther(approved);
      if (
        Number(initiatorBalance) < offerVal ||
        Number(initiatorApproval) < offerVal
      ) {
        setErrorModal(true);
        setTimeout(() => {
          setErrorModal(false);
        }, 3000);
        setErrorMessage(
          "Offer Initiator has insufficient funds/approval for this Transaction. Try someone else!"
        );
        return;
      }
      const contract = new Contract(marketContract, marketplaceABI, signer);
      const tx = await contract.acceptOffer(collection, nftId, initiator);
      setLoading(true);
      await tx.wait();
      tx.hash && setLoading(false);
      router.replace(router.asPath);
    } catch (error) {
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
      }, 2000);
      setErrorMessage("An unknown error occured. Try again!");
      console.log(error);
    }
  };
  return (
    <main className={styles.main}>
      {errorModal && (
        <div className={styles.errorModalContainer}>
          <div className={styles.errorModal}>
            <p>
              {errorMessage}
              {Number(userBalance) < Number(salePrice) &&
                addressApprovedToSellNft === marketContract &&
                active && (
                  <span>
                    {" "}
                    Buy USDT on{" "}
                    <Link href="https://app.mojitoswap.finance/swap">
                      <a
                        className={styles.dexLink}
                        target="_blank"
                        rel="noopener"
                      >
                        MojitoSwap
                      </a>
                    </Link>
                  </span>
                )}
            </p>
          </div>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <div className={styles.imageContainer}>
            <Image
              src={ipfsData[0]}
              alt={ipfsData[4]}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <aside>
            {" "}
            <div className={styles.openContent}>
              <div className={styles.openContentDetails}>
                <p>
                  <Link href={`/collection/${collection}`}>
                    <a>{ipfsData[4]} </a>
                  </Link>
                  <span
                    className={styles.verified}
                    onMouseOver={() => setVerificationDisplay(true)}
                    onMouseOut={() => setVerificationDisplay(false)}
                  >
                    {deadAddress !== collectionInfo[0] &&
                    collectionInfo[2] === 0 ? (
                      <MdOutlineVerifiedUser />
                    ) : (
                      <CgDanger />
                    )}{" "}
                    {verificationDisplay ? (
                      deadAddress !== collectionInfo[0] &&
                      collectionInfo[2] === 0 ? (
                        <span>Collection Verified</span>
                      ) : (
                        <span>Unverified!</span>
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </p>
                <h2>{ipfsData[2]}</h2>
              </div>
              <div className={styles.openContentOwner}>
                <em>
                  Owned by{" "}
                  <Link href={`/profile/${ipfsData[5]}`} prefetch={false}>
                    <a>
                      {" "}
                      <span>{`${ipfsData[5].slice(0, 5)}...${ipfsData[5].slice(
                        38,
                        42
                      )}`}</span>
                    </a>
                  </Link>
                </em>
              </div>
            </div>
            <div className={styles.purchase}>
              <div className={styles.buy}>
                <span>Sale price</span>
                {salePrice !== "0.0" ? (
                  <h3>
                    {salePrice} USDT <span></span>
                  </h3>
                ) : (
                  <h3>
                    - USDT<span>Not for Sale</span>{" "}
                  </h3>
                )}
                <div
                  onClick={
                    account === ipfsData[5] && deadAddress === nftSaleInfo[0]
                      ? sellNftModal
                      : account !== ipfsData[5] &&
                        deadAddress === nftSaleInfo[0]
                      ? deadSwitch
                      : account === ipfsData[5] &&
                        account === nftSaleInfo[0] &&
                        addressApprovedToSellNft !== marketContract
                      ? () => approveNFT(marketContract)
                      : buyNft
                  }
                  className={styles.buyButton}
                  style={{
                    transitionProperty:
                      account !== ipfsData[5] && deadAddress === nftSaleInfo[0]
                        ? "none"
                        : "",
                    transform:
                      account !== ipfsData[5] && deadAddress === nftSaleInfo[0]
                        ? "none"
                        : "",
                    boxShadow:
                      account !== ipfsData[5] && deadAddress === nftSaleInfo[0]
                        ? "none"
                        : "",
                    cursor:
                      account !== ipfsData[5] && deadAddress === nftSaleInfo[0]
                        ? "default"
                        : "",
                    display:
                      account === ipfsData[5] &&
                      account === nftSaleInfo[0] &&
                      addressApprovedToSellNft === marketContract
                        ? "none"
                        : "",
                  }}
                >
                  {account === ipfsData[5] && deadAddress === nftSaleInfo[0]
                    ? "List NFT"
                    : account === ipfsData[5] &&
                      account === nftSaleInfo[0] &&
                      addressApprovedToSellNft !== marketContract
                    ? "Approve NFT"
                    : account !== ipfsData[5] && deadAddress === nftSaleInfo[0]
                    ? "Not Listed"
                    : "Buy NFT"}
                </div>
                {account === ipfsData[5] &&
                  account === nftSaleInfo[0] &&
                  addressApprovedToSellNft === marketContract && (
                    <div className={styles.ownerActive}>
                      <div
                        onClick={updateListingModalPop}
                        className={styles.ownerActiveUpdate}
                      >
                        Update Listing
                      </div>
                      {updateListingModal && (
                        <div className={styles.createListingModal}>
                          <div
                            onClick={() => setUpdateListingModal(false)}
                            className={styles.closeModal}
                          >
                            <IoIosCloseCircleOutline />
                          </div>
                          <div className={styles.actualModal}>
                            <div className={styles.internalModal}>
                              <div className={styles.purchaseUSDT}>
                                <p>Trades are executed in USDT</p>
                              </div>
                              <input
                                type="text"
                                onChange={writeUpdatedValue}
                                autoComplete="off"
                                required=""
                                className={styles.input}
                                placeholder="Set New Price"
                              />
                              <div
                                className={styles.cta}
                                onClick={updateListing}
                              >
                                Update Price
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div
                        onClick={cancelListing}
                        className={styles.ownerActiveCancel}
                      >
                        Cancel Listing
                      </div>
                    </div>
                  )}
                {createListing && (
                  <div className={styles.createListingModal}>
                    <div
                      onClick={() => setCreateListing(false)}
                      className={styles.closeModal}
                    >
                      <IoIosCloseCircleOutline />
                    </div>
                    <div className={styles.actualModal}>
                      <div className={styles.internalModal}>
                        <div className={styles.purchaseUSDT}>
                          <p>Trades are executed in USDT</p>
                        </div>
                        <input
                          type="text"
                          onChange={writeValue}
                          autoComplete="off"
                          required=""
                          className={styles.input}
                          placeholder="Set Listing Price"
                        />
                        <div className={styles.cta} onClick={sellNft}>
                          List NFT
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {deadAddress !== nftSaleInfo[0] && (
                <div className={styles.offers}>
                  {" "}
                  <p>
                    Best Offer:{" "}
                    {highestOffer ? <span>${highestOffer}</span> : "No Offers"}
                  </p>
                  <button
                    className={styles.offerButton}
                    onClick={
                      account !== ipfsData[5] &&
                      deadAddress !== nftSaleInfo[0] &&
                      !offerer.some((addr) => addr === account)
                        ? createOfferModalPop
                        : account !== ipfsData[5] &&
                          offerer.some((addr) => addr === account)
                        ? cancelOffer
                        : account === ipfsData[5] &&
                          deadAddress === nftSaleInfo[0]
                        ? deadSwitch
                        : account === ipfsData[5] && !highestOffer
                        ? deadSwitch
                        : account === ipfsData[5] && highestOffer
                        ? () =>
                            acceptHighestOffer(
                              highestOffer,
                              offer.map(
                                (offer) =>
                                  offer.value === Number(highestOffer) &&
                                  (highestOfferInitiator = offer.address)
                              )
                            )
                        : deadSwitch
                    }
                    style={{
                      cursor:
                        account === ipfsData[5] &&
                        deadAddress === nftSaleInfo[0] &&
                        "unset",
                      transitionProperty:
                        account === ipfsData[5] &&
                        deadAddress === nftSaleInfo[0] &&
                        "none",
                      transform:
                        account === ipfsData[5] &&
                        deadAddress === nftSaleInfo[0] &&
                        "none",
                      color:
                        account === ipfsData[5] &&
                        deadAddress === nftSaleInfo[0] &&
                        "black",
                      backgroundColor:
                        account === ipfsData[5] &&
                        deadAddress === nftSaleInfo[0]
                          ? "transparent"
                          : account !== ipfsData[5] &&
                            offerer.some((addr) => addr === account)
                          ? "#e73434"
                          : "",
                    }}
                  >
                    {account !== ipfsData[5] &&
                    deadAddress !== nftSaleInfo[0] &&
                    !offerer.some((addr) => addr === account)
                      ? "Make an Offer"
                      : account !== ipfsData[5] &&
                        offerer.some((addr) => addr === account)
                      ? "Cancel Offer"
                      : account === ipfsData[5] &&
                        deadAddress === nftSaleInfo[0]
                      ? "List NFT"
                      : account === ipfsData[5] && !highestOffer
                      ? "No New Offers"
                      : account === ipfsData[5] && highestOffer
                      ? "Accept Offer"
                      : ""}
                  </button>
                  {createOfferModal && (
                    <div className={styles.createListingModal}>
                      <div
                        onClick={() => setCreateOfferModal(false)}
                        className={styles.closeModal}
                      >
                        <IoIosCloseCircleOutline />
                      </div>
                      <div className={styles.actualModal}>
                        <div className={styles.internalModal}>
                          <input
                            type="text"
                            onChange={writeOffer}
                            autoComplete="off"
                            required=""
                            className={styles.input}
                            placeholder="Set Offer Value"
                          />
                          <div onClick={makeOffer} className={styles.cta}>
                            <span>Create Offer</span>
                          </div>
                        </div>
                        <div className={styles.purchaseUSDT}>
                          <Link href="https://app.mojitoswap.finance/swap">
                            <a target="_blank" rel="noopener">
                              <p>Purchase USDT on MojitoSwap </p>
                              <span className={styles.arrow}>
                                <CgArrowLongRight />
                              </span>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
        {loading && (
          <div className={styles.loadingModal}>
            <div className={styles.internalLoadingModal}>
              <HashLoader
                color={"#ffffff"}
                loading={loading}
                cssOverride={override}
                size={150}
              />
              <h1>Transaction is being mined</h1>
            </div>
          </div>
        )}
        <div className={styles.bodyContainer}>
          <div className={styles.openOffers}>
            <div className={styles.box}>
              <div className={styles.head}>
                <span>
                  <BsFillTagFill />
                </span>{" "}
                <h2>Offers made</h2>
                <button
                  className={styles.buttonToggle}
                  onClick={() => setState((state) => !state)}
                >
                  {state ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </button>
              </div>
              <div className={styles.body}>
                {state && (
                  <div>
                    <div className={styles.offerHead}>
                      <h4>Price</h4>
                      <h4>Floor</h4>
                      <h4>Offerer</h4>
                    </div>
                    {offer.map((offers, i) => (
                      <div className={styles.offerBody} key={i}>
                        <p>${offers.value}</p>
                        <p>
                          {deadAddress === nftSaleInfo[0]
                            ? "xx"
                            : offers.floorDifference}
                          %{" "}
                          {Math.sign(offers.floorDifference) === -1 ? (
                            <span>Below</span>
                          ) : (
                            <span>Above</span>
                          )}
                        </p>
                        <div
                          onClick={
                            account === offers.address
                              ? createUpdateOfferModalPop
                              : account === ipfsData[5] &&
                                deadAddress !== nftSaleInfo[0]
                              ? () =>
                                  acceptAvailableOffer(
                                    offers.value,
                                    offers.address
                                  )
                              : deadSwitch
                          }
                          style={{
                            color:
                              (account === ipfsData[5] &&
                                deadAddress !== nftSaleInfo[0]) ||
                              account === offers.address
                                ? "white"
                                : "",
                            backgroundColor:
                              (account === ipfsData[5] &&
                                deadAddress !== nftSaleInfo[0]) ||
                              account === offers.address
                                ? "black"
                                : "",
                            borderRadius:
                              account === ipfsData[5] &&
                              deadAddress !== nftSaleInfo[0] &&
                              account === offers.address
                                ? ""
                                : "8px",
                            cursor:
                              (account === ipfsData[5] &&
                                deadAddress !== nftSaleInfo[0]) ||
                              account === offers.address
                                ? "pointer"
                                : "",
                            border:
                              (account === ipfsData[5] &&
                                deadAddress !== nftSaleInfo[0]) ||
                              account === offers.address
                                ? "2px solid #000"
                                : "",
                          }}
                          className={styles.offersContainer}
                        >
                          <div className={styles.function}>
                            {account === offers.address ? (
                              "Update"
                            ) : account === ipfsData[5] &&
                              deadAddress !== nftSaleInfo[0] ? (
                              "Accept"
                            ) : (
                              <span>{`${offers.address.slice(
                                0,
                                5
                              )}...${offers.address.slice(38, 42)}`}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {updateOfferModal && (
            <div className={styles.createListingModal}>
              <div
                onClick={() => setUpdateOfferModal(false)}
                className={styles.closeModal}
              >
                <IoIosCloseCircleOutline />
              </div>
              <div className={styles.actualModal}>
                <div className={styles.internalModal}>
                  <input
                    type="text"
                    onChange={writeUpdatedOffer}
                    autoComplete="off"
                    required=""
                    className={styles.input}
                    placeholder="Set New Offer Value"
                  />
                  <div onClick={updateOffer} className={styles.cta}>
                    <span>Create New Offer</span>
                  </div>
                </div>
                <div className={styles.purchaseUSDT}>
                  <Link href="https://app.mojitoswap.finance/swap">
                    <a target="_blank" rel="noopener">
                      <p>Purchase USDT on MojitoSwap </p>
                      <span className={styles.arrow}>
                        <CgArrowLongRight />
                      </span>
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          )}
          <div className={styles.nftMetadata}>
            <div className={styles.box}>
              <div className={styles.head}>
                <span>
                  <CgDetailsMore />
                </span>{" "}
                <h2>Attributes</h2>
                <button
                  className={styles.buttonToggle}
                  onClick={() => setAttr((state) => !state)}
                >
                  {attr ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </button>
              </div>
              <div className={styles.body}>
                {attr && (
                  <div>
                    <div>
                      {ipfsData[3].map((data, i) => (
                        <aside key={i}>
                          <h2>{data.trait_type}</h2> <p>{data.value}</p>
                        </aside>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.box}>
              <div className={styles.head}>
                <span>
                  <CgFileDocument />
                </span>{" "}
                <h2>Description</h2>
                <button
                  className={styles.buttonToggle}
                  onClick={() => setDesc((state) => !state)}
                >
                  {desc ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </button>
              </div>
              <div className={styles.body}>
                {desc && (
                  <div>
                    <div>{ipfsData[1]}</div>
                  </div>
                )}
              </div>
            </div>{" "}
          </div>
        </div>
        <div className={styles.footerContainer}>
          {extraListings.length > 0 && (
            <div className={styles.moreItems}>
              <h2>More Items from the {ipfsData[4]}</h2>
              <div className={styles.SliderContainer}>
                <div className={styles.cards}>
                  {extraListings.slice(0, 3).map((listing, i) => (
                    <Link
                      href={`/collection/${collection}/${listing.tokenId}`}
                      key={i}
                    >
                      <a>
                        <div className={styles.imageContainer}>
                          <Image
                            src={listing.image}
                            alt={listing.name}
                            layout="fill"
                            objectFit="cover"
                            style={{ padding: "0 20px" }}
                          />
                          <div className={styles.description}>
                            <h3>{listing.name}</h3>
                            <p>
                              Sale Price: <span>${listing.value}</span>
                            </p>
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
export async function getServerSideProps({ params, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=43200, stale-while-revalidate=60"
  );
  const nftID = params.nftId;
  const collection = params.collection;
  const contract = contracts.contractInstance;
  const nftSaleInfo = await contract.sellNFT(collection, nftID);
  const offerInfo = await contract.availableOffers(collection, nftID);
  const threeListings = await contract.availableListings(collection);
  const collectionInfo = await contract.collection(collection);
  const instance = new Contract(collection, nftABI, contracts.provider);
  const nftListings = threeListings[0].slice(-2);
  const listingDetails = threeListings[1].slice(-2);
  const extraListings = [];
  const numValue = nftListings.map((listing) => listing.toNumber());
  const hex = listingDetails.map((hexVal) => hexVal[1]);
  for (let i = 0; i < numValue.length; i++) {
    if (numValue[i] !== Number(nftID)) {
      const tokenDetails = await instance.tokenURI(numValue[i]);
      const ipfsLink = tokenDetails.includes("ipfs://", 0)
        ? tokenDetails.replace(
            "ipfs://",
            "https://ipfsfiles.distant.finance/ipfs/"
          )
        : tokenDetails;
      const { image, name } = await fetch(ipfsLink).then((r) => r.json());
      const imageUrl = image.includes("ipfs://", 0)
        ? image.replace("ipfs://", "https://ipfsfiles.distant.finance/ipfs/")
        : image;
      const obj = {
        image: imageUrl,
        name: name,
        value: utils.formatEther(hex[i]),
        tokenId: numValue[i],
      };
      extraListings.push(obj);
    }
  }
  const tokenDetails = await instance.tokenURI(nftID);
  const owner = await instance.ownerOf(nftID);
  const ipfsLink = tokenDetails.includes("ipfs://", 0)
    ? tokenDetails.replace("ipfs://", "https://ipfsfiles.distant.finance/ipfs/")
    : tokenDetails;
  const { image, description, name, attributes } = await fetch(ipfsLink).then(
    (r) => r.json()
  );
  const imageLink = image.includes("ipfs://", 0)
    ? image.replace("ipfs://", "https://ipfsfiles.distant.finance/ipfs/")
    : image;
  const collectionName = await instance.name();
  const ipfsData = [];
  ipfsData.push(
    imageLink,
    description,
    name,
    attributes,
    collectionName,
    owner
  );
  return {
    props: {
      ipfsData: ipfsData,
      nftSaleInfo: JSON.parse(JSON.stringify(nftSaleInfo)),
      offerInfo: JSON.parse(JSON.stringify(offerInfo[1])),
      collectionInfo: JSON.parse(JSON.stringify(collectionInfo)),
      extraListings: JSON.parse(JSON.stringify(extraListings)),
    },
  };
}
