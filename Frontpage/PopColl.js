import styles from "./styles/popcol.module.css";
import Image from "next/image";
import nft from "./img/me.jpeg";
import nft1 from "./img/2818.png";
import lomen from "./img/lomen.jpeg";
import { MdOutlineGppGood } from "react-icons/md";
const PopularCollection = (props) => {
  return (
    <div className={styles.Cointainer}>
      <div className={styles.Header}>
        <span
          className={styles.HeaderTittle}
          style={{
            backgroundColor: props.state ? "#EBDDDD" : "black",
            color: props.state ? "black" : "white",
          }}
        >
          {" "}
          Top Collections{" "}
        </span>
        <hr
          className={styles.hr}
          style={{ border: props.state ? "1px solid #7B1FA2" : "" }}
        />
      </div>
      <div className={styles.mobile}>
        <div className={styles.TopcollectionContainer}>
          <div className={styles.container}>
            <div className={styles.imageContainer}>
              <Image src={lomen} layout="fill" objectFit="cover" />
            </div>
            <div className={styles.textContainer}>
              <div
                className={styles.textContent}
                style={{ backgroundColor: props.state ? "#DEDEDE" : "" }}
              >
                <p
                  className={styles.NftCollectionName}
                  style={{ color: props.state ? "black" : "white" }}
                >
                  Vixen punk
                </p>
                <p
                  className={styles.FloorPrice}
                  style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}
                >
                  Floor Price: <span className={styles.Price}>20 KCS </span>{" "}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.imageContainer}>
              <Image src={nft1} layout="fill" objectFit="cover" />
            </div>
            <div className={styles.textContainer}>
              <div
                className={styles.textContent}
                style={{ backgroundColor: props.state ? "#DEDEDE" : "" }}
              >
                <p
                  className={styles.NftCollectionName}
                  style={{ color: props.state ? "" : "white" }}
                >
                  Vixen punk
                </p>
                <p
                  className={styles.FloorPrice}
                  style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}
                >
                  Floor Price: <span className={styles.Price}>20 KCS </span>{" "}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.imageContainer}>
              <Image src={nft} layout="fill" objectFit="cover" />
            </div>
            <div className={styles.textContainer}>
              <div
                className={styles.textContent}
                style={{ backgroundColor: props.state ? "#DEDEDE" : "" }}
              >
                <p
                  className={styles.NftCollectionName}
                  style={{ color: props.state ? "" : "white" }}
                >
                  Vixen punk
                </p>
                <p
                  className={styles.FloorPrice}
                  style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}
                >
                  Floor Price: <span className={styles.Price}>20 KCS </span>{" "}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.imageContainer}>
              <Image src={nft} layout="fill" objectFit="cover" />
            </div>
            <div className={styles.textContainer}>
              <div
                className={styles.textContent}
                style={{ backgroundColor: props.state ? "#DEDEDE" : "" }}
              >
                <p
                  className={styles.NftCollectionName}
                  style={{ color: props.state ? "" : "white" }}
                >
                  Vixen punk
                </p>
                <p
                  className={styles.FloorPrice}
                  style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}
                >
                  Floor Price: <span className={styles.Price}>20 KCS </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tab}>
        {" "}
        <main className={styles.main}>
          <div
            className={styles.cardContainer}
            style={{ background: props.state ? "#DEDEDE" : "" }}
          >
            <div className={styles.Imagecontainer}>
              <Image src={nft} alt="" layout="fill" objectFit="cover" />
            </div>
            <div className={styles.tabtext}>
              <h2
                className={styles.collectionName}
                style={{ color: props.state ? "black" : "white" }}
              >
                Lomen
                <span style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  <MdOutlineGppGood />
                </span>
              </h2>
              <p
                className={styles.collectionDescription}
                style={{ color: props.state ? "black" : "white" }}
              >
                {" "}
                This is a all time collection nothing sub
              </p>
              <div
                className={styles.text}
                style={{ backgroundColor: props.state ? "#DEDEDE" : "#181111" }}
              >
                <p style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  Floor price:{" "}
                  <span style={{ color: props.state ? "black" : "white" }}>
                    2kcs
                  </span>
                </p>
                <p style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  Highestbid:{" "}
                  <span style={{ color: props.state ? "black" : "white" }}>
                    2kcs
                  </span>
                </p>
              </div>
            </div>{" "}
          </div>
          <div
            className={styles.cardContainer}
            style={{ background: props.state ? "#DEDEDE" : "" }}
          >
            <div className={styles.Imagecontainer}>
              <Image src={nft1} alt="" layout="fill" objectFit="cover" />
            </div>
            <div className={styles.tabtext}>
              <h2
                className={styles.collectionName}
                style={{ color: props.state ? "black" : "white" }}
              >
                Lomen
                <span style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  <MdOutlineGppGood />
                </span>
              </h2>
              <p
                className={styles.collectionDescription}
                style={{ color: props.state ? "black" : "white" }}
              >
                {" "}
                This is a all time collection nothing sub
              </p>
              <div
                className={styles.text}
                style={{ backgroundColor: props.state ? "#DEDEDE" : "#181111" }}
              >
                <p style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  Floor price:{" "}
                  <span style={{ color: props.state ? "black" : "white" }}>
                    2kcs
                  </span>
                </p>
                <p style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  Highestbid:{" "}
                  <span style={{ color: props.state ? "black" : "white" }}>
                    2kcs
                  </span>
                </p>
              </div>
            </div>{" "}
          </div>
          <div
            className={styles.cardContainer}
            style={{ background: props.state ? "#DEDEDE" : "" }}
          >
            <div className={styles.Imagecontainer}>
              <Image src={nft} alt="" layout="fill" objectFit="cover" />
            </div>
            <div className={styles.tabtext}>
              <h2
                className={styles.collectionName}
                style={{ color: props.state ? "black" : "white" }}
              >
                Lomen
                <span style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  <MdOutlineGppGood />
                </span>
              </h2>
              <p
                className={styles.collectionDescription}
                style={{ color: props.state ? "black" : "white" }}
              >
                {" "}
                This is a all time collection nothing sub
              </p>
              <div
                className={styles.text}
                style={{ backgroundColor: props.state ? "#DEDEDE" : "#181111" }}
              >
                <p style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  Floor price:{" "}
                  <span style={{ color: props.state ? "black" : "white" }}>
                    2kcs
                  </span>
                </p>
                <p style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  Highestbid:{" "}
                  <span style={{ color: props.state ? "black" : "white" }}>
                    2kcs
                  </span>
                </p>
              </div>
            </div>{" "}
          </div>
          <div
            className={styles.cardContainer}
            style={{ background: props.state ? "#DEDEDE" : "" }}
          >
            <div className={styles.Imagecontainer}>
              <Image src={lomen} alt="" layout="fill" objectFit="cover" />
            </div>
            <div className={styles.tabtext}>
              <h2
                className={styles.collectionName}
                style={{ color: props.state ? "black" : "white" }}
              >
                Lomen
                <span style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  <MdOutlineGppGood />
                </span>
              </h2>
              <p
                className={styles.collectionDescription}
                style={{ color: props.state ? "black" : "white" }}
              >
                {" "}
                This is a all time collection nothing sub
              </p>
              <div
                className={styles.text}
                style={{ backgroundColor: props.state ? "#DEDEDE" : "#181111" }}
              >
                <p style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  Floor price:{" "}
                  <span style={{ color: props.state ? "black" : "white" }}>
                    2kcs
                  </span>
                </p>
                <p style={{ color: props.state ? "#7B1FA2" : "#2fc0db" }}>
                  Highestbid:{" "}
                  <span style={{ color: props.state ? "black" : "white" }}>
                    2kcs
                  </span>
                </p>
              </div>
            </div>{" "}
          </div>
        </main>
      </div>
    </div>
  );
};
export default PopularCollection;
