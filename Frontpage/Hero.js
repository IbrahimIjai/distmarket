import Button from "./Button";
import styles from "./styles/Hero.module.css";
import Image from "next/image";
import Socials from "../Socials";
import Carosel from "./carousel";
import Link from "next/link";
const Hero = () => {
  return (
    <div className={styles.blur}>
      <main className={styles.main}>
        <aside>
          <div className={styles.center}>
            <h1>
              A <span> Haven</span> for{" "}
              <div>
                <div className={styles.mid}>
                  your <span>NFTs</span>
                </div>
              </div>
            </h1>{" "}
          </div>
          <p>
            {" "}
            Discover a community-centric platform offering limitless connections
            for NFT creators and collectors.{" "}
          </p>
          <Link href="/collections">
            <a>
              <Button props={"Explore"} />
            </a>
          </Link>
        </aside>
        {/* <div className={styles.heroImage}>
            <Carosel/>
        </div> */}
      </main>
    </div>
  );
};

export default Hero;
