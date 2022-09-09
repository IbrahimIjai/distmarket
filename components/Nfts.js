import styles from "../styles/nft.module.css";
import nftsData from "../nftsData";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  BsThreeDots,
  BsGlobe,
  BsDiscord,
  BsTwitter,
  BsTelegram,
} from "react-icons/bs";
import Link from "next/link";

export default function Nfts() {
  const [visibility, setVisibility] = useState(false);
  const [linkShow, setLinkShow] = useState(false);
  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setLinkShow(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <>
      <div className={styles.banner}>
        <div className={styles.bannerImage}>
          <Image src="/2818.png" objectFit="cover" layout="fill" />
          <div className={styles.bannerContent}>
            <div className={styles.bannerContentImage}>
              <Image src="/2818.png" objectFit="cover" layout="fill" />
            </div>
            <div className={styles.bannerContentDetails}>
              <h1>Lomen NFT</h1>
              <p>
                The AceLands Collection is a collection of 5000 unique AceLands
                NFTs on the KCC Network.{" "}
                {visibility && (
                  <span>
                    The collection is available in 5 volumes - with each volume
                    significantly different from the other in terms of
                    utilities.
                  </span>
                )}
              </p>
              <p
                className={styles.pointer}
                onClick={() => setVisibility((visible) => !visible)}
              >
                {visibility ? "See less..." : "See more..."}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.description}>
        <div className={styles.stats}>
          <div>
            <h3>12,000</h3>
            <p>Item</p>
          </div>
          <div>
            <h3>2,000</h3>
            <p>Holders</p>
          </div>
          <div>
            <h3>12,000</h3>
            <p>Trade Volume</p>
          </div>
          <div>
            <h3>$30</h3>
            <p>Floor Price</p>
          </div>
          <div>
            <h3>$47</h3>
            <p>Best Offer</p>
          </div>
        </div>
        <div
          className={styles.links}
          onClick={() => setLinkShow((link) => !link)}
          ref={menuRef}
        >
          {!linkShow && <BsThreeDots />}
          {linkShow && (
            <ul>
              <Link href="https://www.google.com">
                <a target="_blank">
                  <li>
                    <BsGlobe />
                  </li>
                </a>
              </Link>
              <Link href="https://www.google.com">
                <a target="_blank">
                  <li>
                    <BsDiscord />
                  </li>
                </a>
              </Link>
              <Link href="https://www.google.com">
                <a target="_blank">
                  <li>
                    <BsTwitter />
                  </li>
                </a>
              </Link>
              <Link href="https://www.google.com">
                <a target="_blank">
                  <li>
                    <BsTelegram />
                  </li>
                </a>
              </Link>
            </ul>
          )}
        </div>
      </div>
      <div className={styles.nfts}>
        <div className={styles.nftFlex}>
          {nftsData.map((nft, i) => {
            return (
              <Link href="/">
                <a key={i} className={styles.nft}>
                  <div className={styles.nft}>
                    <div className={styles.nftImage}>
                      <Image src={nft.image} layout="fill" objectFit="cover" />
                    </div>
                    <div className={styles.content}>
                      <h2>#{i}</h2>
                      <p>
                        <span>Price</span> ${nft.price}
                      </p>
                      <p>
                        <span>Best Offer</span> ${nft.bestOffer}
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
