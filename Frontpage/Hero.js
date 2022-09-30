import Button from "./Button";
import styles from "./styles/Hero.module.css";
import Image from "next/image";
import Socials from "../Socials";
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
        <div className={styles.heroImage}>
          <div className={styles.slider}>
            <div className={styles.slides}>
              {Socials.map((item, i) => (
                <div id={`slide-${i}`} key={i}>
                  <Link
                    href={`/collection/${item.collectionAddress}/${item.tokenId}`}
                  >
                    <a>
                      <div className={styles.all}>
                        <div className={styles.image}>
                          <Image
                            src={item.image}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div>
                            <h3>{item.name}</h3>
                            <p>
                              {item.collection}{" "}
                              <span>Price: ${item.price}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
            <div className={styles.links}>
              {Socials.map((item, i) => (
                <Link href={`#slide-${i}`} key={i} scroll={false}>
                  <a></a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
