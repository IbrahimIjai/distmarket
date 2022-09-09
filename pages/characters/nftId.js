import Image from "next/image";
import styles from "../../styles/nftId.module.css";
import { CgFileDocument } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
export default function NftId() {
  const [state, setState] = useState(false);
  const [attr, setAttr] = useState(false);
  const [desc, setDesc] = useState(false);
  const [details, setDetails] = useState(false);
  const [events, setEvents] = useState(false);
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <div className={styles.imageContainer}>
            <Image src="/lomen.jpeg" layout="fill" objectFit="cover" />
          </div>
          <aside>
            {" "}
            <div className={styles.openContent}>
              <div className={styles.openContentDetails}>
                <h1>KuCoin Lomen ~</h1>
                <h2>Lomen #6190</h2>
              </div>
              <div className={styles.openContentOwner}>
                <em>
                  Owned by <span>0xdb2a...cc02</span>
                </em>
              </div>
            </div>
            <div className={styles.purchase}>
              <div className={styles.buy}>
                <span>Sale price</span>
                <h3>
                  12 KCS <span>($24)</span>
                </h3>
                <button className={styles.buyButton}>Buy NFT</button>
              </div>
              <div className={styles.offers}>
                {" "}
                <p>Best Offer</p>
                <button className={styles.offerButton}>Make Offer</button>
              </div>
            </div>
          </aside>
        </div>
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
                      <h4>Floor price difference</h4>
                      <h4>Offerer</h4>
                    </div>
                    <div className={styles.offerBody}>
                      <p>32 KCS</p>
                      <p>15% above</p>
                      <p>0x7ba2..1ccb</p>
                    </div>
                    <div className={styles.offerBody}>
                      <p>26 KCS</p>
                      <p>15% below</p>
                      <p>0x11a2c..dbcb</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
                      The Pikaster-themed Eggs give buyers a chance to get
                      random NFTs. NFTs have different races and attributes,
                      which determine their battle performance as well as
                      rewards in the game.
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
                    <div>
                      The Pikaster-themed Eggs give buyers a chance to get
                      random NFTs. NFTs have different races and attributes,
                      which determine their battle performance as well as
                      rewards in the game.
                    </div>
                  </div>
                )}
              </div>
            </div>{" "}
            <div className={styles.box}>
              <div className={styles.head}>
                <span>
                  <CgFileDocument />
                </span>{" "}
                <h2>Details</h2>
                <button onClick={() => setDetails((state) => !state)}>
                  <IoIosArrowDown />
                </button>
              </div>
              <div className={styles.body}>
                {details && (
                  <div>
                    <div>
                      The Pikaster-themed Eggs give buyers a chance to get
                      random NFTs. NFTs have different races and attributes,
                      which determine their battle performance as well as
                      rewards in the game.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerContainer}>
          <div className={styles.events}>
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
                    <tr>
                      <td>Transfer</td>
                      <td></td>
                      <td>0x144a....cb24</td>
                      <td>0x144a....cb24</td>
                      <td>12 mins ago</td>
                    </tr>
                    <tr>
                      <td>Sale</td>
                      <td>20</td>
                      <td>0x144a....cb24</td>
                      <td>0x144a....cb24</td>
                      <td>12 mins ago</td>
                    </tr>
                    <tr>
                      <td>Transfer</td>
                      <td></td>
                      <td>0x144a....cb24</td>
                      <td>0x144a....cb24</td>
                      <td>25 mins ago</td>
                    </tr>
                    <tr>
                      <td>List</td>
                      <td></td>
                      <td>0x144a....cb24</td>
                      <td>0x144a....cb24</td>
                      <td>32 mins ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className={styles.moreItems}>
            <h2>More Items from the Lomen Collection</h2>
            <div className={styles.SliderContainer}>
              <div className={styles.cards}>
                <div className={styles.imageContainer}>
                  <Image
                    src="/lomen.jpeg"
                    layout="fill"
                    objectFit="cover"
                    style={{ padding: "0 20px" }}
                  />
                  <div className={styles.description}>
                    <h3>#5924</h3>
                    <p>
                      Price tag<span>20KCS</span>
                    </p>
                    <em>0xdb9b...d70</em>
                  </div>
                </div>
                <div className={styles.imageContainer}>
                  <Image
                    src="/lomen.jpeg"
                    layout="fill"
                    objectFit="cover"
                    style={{ padding: "0 20px" }}
                  />
                  <div className={styles.description}>
                    <h3>#3510</h3>
                    <p>
                      Price tag<span>20KCS</span>
                    </p>
                    <em>0xdb9b...d70</em>
                  </div>
                </div>
                <div className={styles.imageContainer}>
                  <Image
                    src="/lomen.jpeg"
                    layout="fill"
                    objectFit="cover"
                    style={{ padding: "0 20px" }}
                  />
                  <div className={styles.description}>
                    <h3>#4784</h3>
                    <p>
                      Price tag<span>20KCS</span>
                    </p>
                    <em>0xdb9b...d70</em>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
