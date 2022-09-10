import Image from "next/image";
import Link from "next/link";
import styles from "../styles/collections.module.css";
import banner from "../Frontpage/img/banner.jpg";
import SupportedCollections from "../SupportedCollections";

export default function Collections() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerImage}>
          <Image src={banner} objectFit="cover" layout="fill" alt="2818" />
        </div>
        <div className={styles.headerContent}>
          <h1 className={styles.headerHeader}>mART Collections</h1>
          <p className={styles.headerDescription}>
            A curated NFT set of Artwork, Game Items and Characters, and Name
            service NFTs
          </p>
        </div>
      </div>
      <div className={styles.collections}>
        {SupportedCollections.map((collection, i) => (
          <div className={styles.collection} key={i}>
            <Link
              href={`/collection/${collection.collectionAddress}`}
              passHref
              prefetch={false}
            >
              <a>
                <div>
                  <Image
                    src="/5951.png"
                    layout="fill"
                    alt="2818.jpeg"
                    objectFit="cover"
                    className={styles.image}
                  />
                  <div className={styles.content}>
                    <div className={styles.topContent}>
                      <div className={styles.topContentImage}>
                        <div className={styles.image}>
                          <Image
                            src="/5951.png"
                            layout="fill"
                            alt="2818"
                            objectFit="cover"
                          />
                        </div>
                      </div>
                      <div className={styles.topContentName}>
                        <div className={styles.name}>
                          <span>{collection.collectionTicker}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.bottomContent}>
                      <div className={styles.bottomHeader}>
                        <h1>{collection.collectionName}</h1>
                        <div>{collection.collectionSupply} Supply</div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
