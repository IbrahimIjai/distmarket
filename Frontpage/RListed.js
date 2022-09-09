import styles from "./styles/RListed.module.css";
import Image from "next/image";
import cb1 from "./img/2818.png";
import cb2 from "./img/5346.png";
import cb3 from "./img/5951.png";
import lomen1 from "./img/lomen.jpeg";
import lomen2 from "./img/6190.png";
import me from "./img/me.jpeg";

const RListed = (props) => {
  return (
    <main className={styles.main}>
      <div className={styles.text}>Marketplace for KCC</div>

      <div className={styles.SliderContainer}>
        <div className={styles.cards}>
          <div className={styles.imageContainer}>
            <Image
              src={cb1}
              layout="fill"
              objectFit="cover"
              style={{ padding: "0 20px" }}
            />
            <div
              className={styles.description}
              style={{
                color: props.state ? "black" : "white",
                background: props.state
                  ? "rgba(255, 255, 255, 0.33)"
                  : "rgba(0, 0, 0, 0.44)",
              }}
            >
              <h3>Lomen NFT</h3>
              <p>Price tag</p>
              components and styles using components as a low-level styling
            </div>
          </div>
          <div className={styles.imageContainer}>
            <Image
              src={cb2}
              layout="fill"
              objectFit="cover"
              style={{ padding: "0 20px" }}
            />
            <div
              className={styles.description}
              style={{
                color: props.state ? "black" : "white",
                background: props.state
                  ? "rgba(255, 255, 255, 0.33)"
                  : "rgba(0, 0, 0, 0.44)",
              }}
            >
              <h3>Lomen NFT</h3>
              <p>Price tag</p>
              components and styles using components as a low-level styling
            </div>
          </div>
          <div className={styles.imageContainer}>
            <Image
              src={cb3}
              layout="fill"
              objectFit="cover"
              style={{ padding: "0 20px" }}
            />
            <div
              className={styles.description}
              style={{
                color: props.state ? "black" : "white",
                background: props.state
                  ? "rgba(255, 255, 255, 0.33)"
                  : "rgba(0, 0, 0, 0.44)",
              }}
            >
              <h3>Lomen NFT</h3>
              <p>Price tag</p>
              components and styles using components as a low-level styling
            </div>
          </div>
          <div className={styles.imageContainer}>
            <Image
              src={lomen1}
              layout="fill"
              objectFit="cover"
              style={{ padding: "0 20px" }}
            />
            <div
              className={styles.description}
              style={{
                color: props.state ? "black" : "white",
                background: props.state
                  ? "rgba(255, 255, 255, 0.33)"
                  : "rgba(0, 0, 0, 0.44)",
              }}
            >
              <h3>Lomen NFT</h3>
              <p>Price tag</p>
              components and styles using components as a low-level styling
            </div>
          </div>
          <div className={styles.imageContainer}>
            <Image
              src={lomen2}
              layout="fill"
              objectFit="cover"
              style={{ padding: "0 20px" }}
            />
            <div
              className={styles.description}
              style={{
                color: props.state ? "black" : "white",
                background: props.state
                  ? "rgba(255, 255, 255, 0.33)"
                  : "rgba(0, 0, 0, 0.44)",
              }}
            >
              <h3>Lomen NFT</h3>
              <p>Price tag</p>
              components and styles using components as a low-level styling
            </div>
          </div>
          <div className={styles.imageContainer}>
            <Image
              src={me}
              layout="fill"
              objectFit="cover"
              style={{ padding: "0 20px" }}
            />
            <div
              className={styles.description}
              style={{
                color: props.state ? "black" : "white",
                background: props.state
                  ? "rgba(255, 255, 255, 0.33)"
                  : "rgba(0, 0, 0, 0.44)",
              }}
            >
              <h3>Lomen NFT</h3>
              <p>Price tag</p>
              components and styles using components as a low-level styling
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default RListed;
