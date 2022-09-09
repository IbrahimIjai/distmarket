import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import data from "../data";
import styles from "../styles/index.module.css";

export default function Collections() {
  const [details, setDetails] = useState(data);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>
            All the collections in the Mackett marketplace ranked by volume and
            other statistics
          </h1>
        </div>
      </div>
      <div className={styles.collections}>
        {details.map((detail) => (
          <div className={styles.collection} key={detail.id}>
            <Link href="/collection">
              <a>
                <div>
                  <Image
                    src={detail.image}
                    layout="fill"
                    objectFit="cover"
                    className={styles.image}
                  />
                  <div className={styles.content}>
                    <div className={styles.topContent}>
                      <div className={styles.topContentImage}>
                        <div className={styles.image}>
                          <Image
                            src={detail.smallImage}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      </div>
                      <div className={styles.topContentName}>
                        <div className={styles.name}>
                          <span>{detail.snippet}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.bottomContent}>
                      <div className={styles.bottomHeader}>
                        <h1>{detail.collectionName}</h1>

                        <div>{detail.floor}KCS</div>
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
