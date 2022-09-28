import Button from "./Button";
import styles from "./styles/Hero.module.css";
import cb1 from "./img/2818.png";
import cb2 from "./img/5346.png";
import cb3 from "./img/5951.png";
import Image from "next/image";
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
              <div id="slide-1">
                {" "}
                <div className={styles.all}>
                  <div className={styles.image}>
                    <Image src={cb3} layout="fill" objectFit="cover" />
                    <div>
                      <h3>Booze-o-phile</h3>
                      <p>
                        Mojito Cattles <span>Price: $0.76</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div id="slide-2">
                {" "}
                <div className={styles.all}>
                  <div className={styles.image}>
                    <Image src={cb3} layout="fill" objectFit="cover" />
                    <div>
                      <h3>Booze-o-phile</h3>
                      <p>
                        Mojito Cattles <span>Price: $0.76</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div id="slide-3">
                <div className={styles.all}>
                  <div className={styles.image}>
                    <Image src={cb2} layout="fill" objectFit="cover" />
                    <div>
                      <h3>Booze-o-phile</h3>
                      <p>
                        Mojito Cattles <span>Price: $0.76</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div id="slide-4">
                <div className={styles.all}>
                  <div className={styles.image}>
                    <Image src={cb3} layout="fill" objectFit="cover" />
                    <div>
                      <h3>Booze-o-phile</h3>
                      <p>
                        Mojito Cattles <span>Price: $0.76</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div id="slide-5">
                <div className={styles.all}>
                  <div className={styles.image}>
                    <Image src={cb1} layout="fill" objectFit="cover" />
                    <div>
                      <h3>Booze-o-phile</h3>
                      <p>
                        Mojito Cattles <span>Price: $0.76</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.links}>
              <Link href="#slide-1" scroll={false}>
                <a></a>
              </Link>
              <Link href="#slide-2" scroll={false}>
                <a></a>
              </Link>
              <Link href="#slide-3" scroll={false}>
                <a></a>
              </Link>
              <Link href="#slide-4" scroll={false}>
                <a></a>
              </Link>
              <Link href="#slide-5" scroll={false}>
                <a></a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
