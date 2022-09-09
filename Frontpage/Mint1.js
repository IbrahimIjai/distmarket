import styles from "./styles/mint.module.css";
import iconDark from "./img/ionic-dark.png";
import searchDark from "./img/search-dark.png";
import iconlight from "./img/ionic-light.png";
import searchlight from "./img/search-light.png";
import Image from "next/image";
const Mint1 = () => {
  return (
    <main className={styles.mint1}>
      <div className={styles.content}>
        <div className={styles.create}>
          <div className={styles.imageContainer}>
            <Image src={iconDark} layout="fill" objectFit="contain" />{" "}
            <h2 style={{ margin: "10px" }}>Create</h2>
          </div>
          <div className={styles.textContent}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            faucibus pulvinar elementum integer. Orci phasellus egestas tellus
            rutrum tellus pellentesque eu tincidunt. Condimentum id venenatis a
            condimentum vitae sapien pellentesque. Sapien faucibus et molestie
            ac feugiat sed lectus vestibulum mattis.
          </div>
        </div>
        <div className={styles.discover}>
          <div className={styles.imageContainer}>
            <Image src={searchDark} layout="fill" objectFit="contain" />{" "}
            <h2 style={{ margin: "10px" }}>Discover</h2>
          </div>
          <div className={styles.textContent}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            faucibus pulvinar elementum integer. Orci phasellus egestas tellus
            rutrum tellus pellentesque eu tincidunt. Condimentum id venenatis a
            condimentum vitae sapien pellentesque. Sapien faucibus et molestie
            ac feugiat sed lectus vestibulum mattis.
          </div>
        </div>
      </div>
    </main>
  );
};

export default Mint1;
