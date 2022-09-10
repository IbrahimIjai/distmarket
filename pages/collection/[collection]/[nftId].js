import Image from "next/image";
import styles from "../../../styles/nftId.module.css";
import { CgFileDocument } from "react-icons/cg";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { IoIosArrowDown, IoIosCloseCircleOutline } from "react-icons/io";
import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import { Contract, ethers, BigNumber, utils } from "ethers";
import { marketplaceABI, nftABI, tokenABI } from "../../../constants/ABIs";
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useRouter } from "next/router";
export default function NftId({
  threeListings,
  offerInfo,
  nftSaleInfo,
  // allEvents,
  ipfsData,
}) {
  // Loader helper variable
  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  console.log("Extra Listings1 only", threeListings);
  let highestOfferInitiator = "";
  // Contracts and constant addresses
  const marketContract = "0x9c05dd334787dE014f2Fa5744381Eb20699236FF";
  const tokenContract = "0x67f6a7BbE0da067A747C6b2bEdF8aBBF7D6f60dc";
  const deadAddress = "0x0000000000000000000000000000000000000000";
  // Constant States
  const [state, setState] = useState(false);
  const [attr, setAttr] = useState(false);
  const [desc, setDesc] = useState(false);
  const [events, setEvents] = useState(false);
  // Props from getServerSideProps function. Destructuring and assignments
  // More listings from same collection
  const [tokenId, details] = [...threeListings];
  const address = [];
  const price = [];
  details.map((detail) => {
    address.push(detail[0]);
    price.push(detail[1]);
  });
  const value = price.map((p) => {
    const val = parseInt(p.hex, 16);
    const v = BigNumber.from(val.toString());
    return utils.formatEther(v);
  });
  const salePrice = parseInt(nftSaleInfo[1].hex, 16).toString();
  const moreListings = [];
  for (let i = 0; i < tokenId.length; i++) {
    let object = {
      tokenId: tokenId[i],
      address: address[i],
      price: value[i],
    };
    moreListings.push(object);
  }
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
    const saleValueString = utils.formatEther(salePrice);
    const saleValue = Number(saleValueString);
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
  // Events function
  // let allevent = allEvents.map((event) => {
  //   if (event.length > 0) {
  //     return event;
  //   }
  // });
  // allevent = allevent.filter(Boolean);
  // const eventsArray = [];
  // allevent.map((e) => e.map((event) => eventsArray.push(event)));

  //Contract functions
  const { account, library, active } = useWeb3React();
  const router = useRouter();
  const { collection, nftId } = router.query;
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
    console.log("Not Listed");
  };
  const createOfferModalPop = () => {
    setCreateOfferModal(true);
  };
  const createUpdateOfferModalPop = () => {
    setUpdateOfferModal(true);
  };
  // Contract functions
  const buyNft = async () => {
    const signer = await library.getSigner();
    const instance = new Contract(tokenContract, tokenABI, signer);
    const approved = await instance.allowance(account, marketContract);
    const approvedAmount = utils.formatEther(
      parseInt(approved._hex, 16).toString()
    );
    if (Number(approvedAmount) < Number(utils.formatEther(salePrice))) {
      const approval = await instance.approve(marketContract, salePrice);
      setLoading(true);
      await approval.wait();
      approval.hash && setLoading(false);
    }
    const contract = new Contract(marketContract, marketplaceABI, signer);
    const tx = await contract.buyNFT(collection, nftId, salePrice);
    setLoading(true);
    await tx.wait();
    tx.hash && setLoading(false);
    // router.push(`/collection/${collection}`);
  };
  const sellNft = async () => {
    const val = utils.parseEther(listingValue);
    const signer = await library.getSigner();
    const instance = new Contract(collection, nftABI, signer);
    const approval = await instance.approve(marketContract, nftId);
    setLoading(true);
    await approval.wait();
    approval.hash && setLoading(false);
    const contract = new Contract(marketContract, marketplaceABI, signer);
    const tx = await contract.list(collection, nftId, val.toString());
    setLoading(true);
    await tx.wait();
    tx.hash && setLoading(false);
    setCreateListing(false);
    // router.push(`/collection/${collection}`);
  };
  const cancelListing = async () => {
    const signer = await library.getSigner();
    const contract = new Contract(marketContract, marketplaceABI, signer);
    const tx = await contract.cancelListing(collection, nftId);
    setLoading(true);
    await tx.wait();
    tx.hash && setLoading(false);
  };
  const updateListing = async () => {
    const val = utils.parseEther(updateListingValue);
    const signer = await library.getSigner();
    const contract = new Contract(marketContract, marketplaceABI, signer);
    const tx = await contract.updateListing(collection, nftId, val.toString());
    setLoading(true);
    await tx.wait();
    tx.hash && setLoading(false);
    setUpdateListingModal(false);
  };
  const makeOffer = async () => {
    const signer = await library.getSigner();
    const offerVal = parseInt(
      utils.parseEther(createOfferValue)._hex,
      16
    ).toString();
    const instance = new Contract(tokenContract, tokenABI, signer);
    const approved = await instance.allowance(account, marketContract);
    const approvedAmount = utils.formatEther(
      parseInt(approved._hex, 16).toString()
    );
    if (Number(approvedAmount) < Number(createOfferValue)) {
      const approval = await instance.increaseAllowance(
        marketContract,
        offerVal
      );
      setLoading(true);
      await approval.wait();
      approval.hash && setLoading(false);
    }
    const contract = new Contract(marketContract, marketplaceABI, signer);
    const tx = await contract.createOffer(collection, nftId, offerVal);
    setLoading(true);
    await tx.wait();
    tx.hash && setLoading(false);
    setCreateOfferModal(false);
  };
  const updateOffer = async () => {
    const signer = await library.getSigner();
    const offerVal = parseInt(
      utils.parseEther(updateOfferValue)._hex,
      16
    ).toString();
    const instance = new Contract(tokenContract, tokenABI, signer);
    const approved = await instance.allowance(account, marketContract);
    const approvedAmount = utils.formatEther(
      parseInt(approved._hex, 16).toString()
    );
    if (Number(approvedAmount) < Number(updateOfferValue)) {
      const approval = await instance.increaseAllowance(
        marketContract,
        offerVal
      );
      setLoading(true);
      await approval.wait();
      approval.hash && setLoading(false);
    }
    const contract = new Contract(marketContract, marketplaceABI, signer);
    const tx = await contract.updateOffer(collection, nftId, offerVal);
    setLoading(true);
    await tx.wait();
    tx.hash && setLoading(false);
    setCreateOfferModal(false);
  };
  const cancelOffer = async () => {
    const signer = await library.getSigner();
    const contract = new Contract(marketContract, marketplaceABI, signer);
    const tx = await contract.cancelOffer(collection, nftId);
    setLoading(true);
    await tx.wait();
    tx.hash && setLoading(false);
  };
  const acceptOffer1 = async (offerVal, initiator) => {
    const signer = library.getSigner();
    const instance = new Contract(tokenContract, tokenABI, signer);
    const balance = await instance.balanceOf(highestOfferInitiator);
    const approved = await instance.allowance(
      highestOfferInitiator,
      marketContract
    );
    const initiatorBalance = utils.formatEther(
      parseInt(balance._hex, 16).toString()
    );
    const initiatorApproval = utils.formatEther(
      parseInt(approved._hex, 16).toString()
    );
    if (
      Number(initiatorBalance) < offerVal &&
      Number(initiatorApproval) < offerVal
    ) {
      console.log(
        "Offer Initiator has insufficient funds/approval for this Transaction. Try someone else"
      );
      //I want to add a modal that pops up for 5 seconds, telling a user that the Offerer has insuffficient funds
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
  };
  const acceptOffer2 = async (offerVal, initiator) => {
    const signer = library.getSigner();
    const instance = new Contract(tokenContract, tokenABI, signer);
    const balance = await instance.balanceOf(initiator);
    const approved = await instance.allowance(initiator, marketContract);
    const initiatorBalance = utils.formatEther(
      parseInt(balance._hex, 16).toString()
    );
    const initiatorApproval = utils.formatEther(
      parseInt(approved._hex, 16).toString()
    );
    if (
      Number(initiatorBalance) < offerVal &&
      Number(initiatorApproval) < offerVal
    ) {
      console.log(
        "Offer Initiator has insufficient funds/approval for this Transaction. Try someone else"
      );
      //I want to add a modal that pops up for 5 seconds, telling a user that the Offerer has insuffficient funds
    }
    const contract = new Contract(marketContract, marketplaceABI, signer);
    const tx = await contract.acceptOffer(collection, nftId, initiator);
    setLoading(true);
    await tx.wait();
    tx.hash && setLoading(false);
  };
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <div className={styles.imageContainer}>
            <Image
              src={ipfsData[0]}
              alt={ipfsData[0]}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <aside>
            {" "}
            <div className={styles.openContent}>
              <div className={styles.openContentDetails}>
                <h1>
                  {ipfsData[4]}{" "}
                  <span className={styles.verified}>
                    <MdOutlineVerifiedUser />
                  </span>
                </h1>
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
                <h3>
                  - KCS{" "}
                  <span>
                    {salePrice === "0" ? (
                      "Not for Sale"
                    ) : (
                      <span>(${utils.formatEther(salePrice)})</span>
                    )}
                  </span>
                </h3>
                <div
                  onClick={
                    account === ipfsData[5] && deadAddress === nftSaleInfo[0]
                      ? sellNftModal
                      : account !== ipfsData[5] &&
                        deadAddress === nftSaleInfo[0]
                      ? deadSwitch
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
                      account === ipfsData[5] && account === nftSaleInfo[0]
                        ? "none"
                        : "",
                  }}
                >
                  {account === ipfsData[5] && deadAddress === nftSaleInfo[0]
                    ? "List NFT"
                    : account !== ipfsData[5] && deadAddress === nftSaleInfo[0]
                    ? "Not Listed"
                    : "Buy NFT"}
                </div>
                {account === ipfsData[5] && account === nftSaleInfo[0] && (
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
                            <input
                              type="text"
                              onChange={writeUpdatedValue}
                              autoComplete="off"
                              required=""
                              className={styles.input}
                              placeholder="Set New Price"
                            />
                            <div onClick={updateListing}>Update Price</div>
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
                        <input
                          type="text"
                          onChange={writeValue}
                          autoComplete="off"
                          required=""
                          className={styles.input}
                          placeholder="Set Listing Price"
                        />
                        <div onClick={sellNft}>List NFT</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {offer.length > 0 && (
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
                            acceptOffer1(
                              highestOffer,
                              offer.map(
                                (offer) =>
                                  offer.value === highestOffer &&
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
                      ? "Make Offer"
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
                          <div onClick={makeOffer}>Create Offer</div>
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
                  <CgFileDocument />
                </span>{" "}
                Offers made
                <button onClick={() => setState((state) => !state)}>
                  <IoIosArrowDown />
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
                    {offer.map((offers) => (
                      <div className={styles.offerBody} key={offers.address}>
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
                              ? () => acceptOffer2(offers.value, offers.address)
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
                    placeholder="Set Offer Value"
                  />
                  <div onClick={updateOffer}>Create Offer</div>
                </div>
              </div>
            </div>
          )}
          <div className={styles.nftMetadata}>
            <div className={styles.box}>
              <div className={styles.head}>
                <span>
                  <CgFileDocument />
                </span>{" "}
                <h2>Attributes</h2>
                <button onClick={() => setAttr((state) => !state)}>
                  <IoIosArrowDown />
                </button>
              </div>
              <div className={styles.body}>
                {attr && (
                  <div>
                    <div>
                      {ipfsData[3].map((data, i) => (
                        <h2 key={i}>
                          {data.trait_type}: <span>{data.value}</span>
                        </h2>
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
                <button onClick={() => setDesc((state) => !state)}>
                  <IoIosArrowDown />
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
          {/* <div className={styles.events}>
            <div className={styles.event}>
              <h3>Latest activities</h3>
              <button onClick={() => setEvents((event) => !event)}>
                <IoIosArrowDown />
              </button>
            </div>

            {events && (
              <div className={styles.eventTable}>
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th>Event</th>
                      <th>Price</th>
                      <th>From</th>
                      <th>To</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsArray.map((event) => (
                      <tr>
                        <td>{event.events}</td>
                        <td>
                          {utils.formatEther(
                            parseInt(event.args[2].hex, 16).toString()
                          )}
                        </td>
                        <td>{event.args[0]}</td>
                        <td>
                          {event.addr === marketContract ? "mART" : event.addr}
                        </td>
                        <td>{event.txnHash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div> */}
          <div className={styles.moreItems}>
            <h2>More Items from the {ipfsData[4]}</h2>
            <div className={styles.SliderContainer}>
              <div className={styles.cards}>
                {moreListings.map((listing) => (
                  <div className={styles.imageContainer} key={listing.tokenId}>
                    <Image
                      src="/lomen.jpeg"
                      alt="lomen"
                      layout="fill"
                      objectFit="cover"
                      style={{ padding: "0 20px" }}
                    />
                    <div className={styles.description}>
                      <h3>{parseInt(listing.tokenId.hex, 16)}</h3>
                      <p>
                        Price tag: <span>${listing.price}</span>
                      </p>
                      <em>{`${listing.address.slice(
                        0,
                        5
                      )}...${listing.address.slice(38, 42)}`}</em>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
  const Tkcc = "https://rpc-testnet.kcc.network";
  const marketContract = "0x9c05dd334787dE014f2Fa5744381Eb20699236FF";
  const provider = new ethers.providers.JsonRpcProvider(Tkcc);
  const contract = new Contract(marketContract, marketplaceABI, provider);
  const nftSaleInfo = await contract.sellNFT(collection, nftID);
  const offerInfo = await contract.availableOffers(collection, nftID);
  const threeListings = await contract.availableListings(collection);
  // const listingEvents = await contract.queryFilter("ItemListed");
  // const listings = [];
  // listingEvents.map((listing) => {
  //   for (let i = 0; i < listingEvents.length; i++) {
  //     if (listing.args[1] == nftID) {
  //       let object = {
  //         args: listing.args,
  //         txnHash: listing.transactionHash,
  //         addr: listing.address,
  //         events: listing.event,
  //       };
  //       listings.push(object);
  //     }
  //   }
  // });
  // const delistEvents = await contract.queryFilter("ItemDelisted");
  // const deListings = [];
  // delistEvents.map((listing) => {
  //   for (let i = 0; i < delistEvents.length; i++) {
  //     if (listing.args[1] == nftID) {
  //       let object = {
  //         args: listing.args,
  //         txnHash: listing.transactionHash,
  //         addr: listing.address,
  //         events: listing.event,
  //       };
  //       deListings.push(object);
  //     }
  //   }
  // });
  // const updateListings = [];
  // const updateListing = await contract.queryFilter("ItemUpdated");
  // updateListing.map((listing) => {
  //   for (let i = 0; i < updateListing.length; i++) {
  //     if (listing.args[1] == nftID) {
  //       let object = {
  //         args: listing.args,
  //         txnHash: listing.transactionHash,
  //         addr: listing.address,
  //         events: listing.event,
  //       };
  //       updateListings.push(object);
  //     }
  //   }
  // });
  // const soldListings = [];
  // const soldListing = await contract.queryFilter("ItemSold");
  // soldListing.map((listing) => {
  //   for (let i = 0; i < soldListing.length; i++) {
  //     if (listing.args[1] == nftID) {
  //       let object = {
  //         args: listing.args,
  //         txnHash: listing.transactionHash,
  //         addr: listing.address,
  //         events: listing.event,
  //       };
  //       soldListings.push(object);
  //     }
  //   }
  // });
  // const offerCreation = await contract.queryFilter("OfferCreated");
  // const offers = [];
  // offerCreation.map((listing) => {
  //   for (let i = 0; i < offerCreation.length; i++) {
  //     if (listing.args[1] == nftID) {
  //       let object = {
  //         args: listing.args,
  //         txnHash: listing.transactionHash,
  //         addr: listing.address,
  //         events: listing.event,
  //       };
  //       offers.push(object);
  //     }
  //   }
  // });
  // const delistOffer = await contract.queryFilter("OfferCancelled");
  // const offerDeleted = [];
  // delistOffer.map((listing) => {
  //   for (let i = 0; i < delistOffer.length; i++) {
  //     if (listing.args[1] == nftID) {
  //       let object = {
  //         args: listing.args,
  //         txnHash: listing.transactionHash,
  //         addr: listing.address,
  //         events: listing.event,
  //       };
  //       offerDeleted.push(object);
  //     }
  //   }
  // });
  // const updateOffer = [];
  // const offerUpdate = await contract.queryFilter("OfferUpdated");
  // offerUpdate.map((listing) => {
  //   for (let i = 0; i < offerUpdate.length; i++) {
  //     if (listing.args[1] == nftID) {
  //       let object = {
  //         args: listing.args,
  //         txnHash: listing.transactionHash,
  //         addr: listing.address,
  //         events: listing.event,
  //       };
  //       updateOffer.push(object);
  //     }
  //   }
  // });
  // const acceptOffer = [];
  // const acceptedOffers = await contract.queryFilter("OfferAccepted");
  // acceptedOffers.map((listing) => {
  //   for (let i = 0; i < acceptedOffers.length; i++) {
  //     if (listing.args[1] == nftID) {
  //       let object = {
  //         args: listing.args,
  //         txnHash: listing.transactionHash,
  //         addr: listing.address,
  //         events: listing.event,
  //       };
  //       acceptOffer.push(object);
  //     }
  //   }
  // });
  // const allEvents = [];
  // allEvents.push(
  //   listings,
  //   deListings,
  //   updateListings,
  //   soldListings,
  //   offers,
  //   offerDeleted,
  //   offerUpdate,
  //   updateOffer,
  //   acceptOffer
  // );
  const instance = new Contract(collection, nftABI, provider);
  const gg = threeListings[0];
  const numValue = gg.map((listing) => listing.toNumber());
  const num1Value = gg.map((listing) => listing.toNumber().toString());
  const tokenURI = num1Value.map(async (num) => await instance.tokenURI(num));
  console.log(tokenURI, numValue, "Show new value");
  const tokenDetails = await instance.tokenURI(nftID);
  const owner = await instance.ownerOf(nftID);
  const ipfsLink = tokenDetails.replace(
    "ipfs://",
    "https://distant.mypinata.cloud/ipfs/"
  );
  const { image, description, name, attributes } = await fetch(ipfsLink).then(
    (r) => r.json()
  );
  const imageLink = image.replace(
    "ipfs://",
    "https://distant.mypinata.cloud/ipfs/"
  );
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
      // allEvents: JSON.parse(JSON.stringify(allEvents)),
      nftSaleInfo: JSON.parse(JSON.stringify(nftSaleInfo)),
      offerInfo: JSON.parse(JSON.stringify(offerInfo[1])),
      threeListings: JSON.parse(JSON.stringify(threeListings)),
    },
  };
}
