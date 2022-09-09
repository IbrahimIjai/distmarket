import styles from "../styles/navbar.module.css";
import Link from "next/link";
import { useWeb3React } from "@web3-react/core";
import Connect from "../constants/Connect";
import { useState, useRef, useEffect } from "react";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { CgClose } from "react-icons/cg";

export default function Navbar() {
  const { active } = useWeb3React();
  const [hamburger, setHamburger] = useState(false);
  let hamRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!hamRef.current.contains(e.target)) {
        setHamburger(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [hamburger]);
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link href="/">
          <a>mART</a>
        </Link>
      </div>
      <div className={styles.mobileFallback}>
        <div className={styles.connect}>
          <div className={styles.connectBtn}>
            <Connect />
          </div>
        </div>
        {active && (
          <div className={styles.mobile}>
            <div
              onClick={() => setHamburger((ham) => !ham)}
              className={styles.ham}
              ref={hamRef}
            >
              {hamburger ? <CgClose /> : <HiOutlineMenuAlt4 />}
            </div>
            <div className={styles.navbar}>
              <ul
                className={styles.ul}
                style={{ transform: hamburger ? "translateX(0%)" : "" }}
              >
                <Link href="/collections">
                  <a>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className={styles.list}
                    >
                      Collection
                    </li>
                  </a>
                </Link>
                <Link href="/profile">
                  <a>
                    <li
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className={styles.list}
                    >
                      Profile
                    </li>
                  </a>
                </Link>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className={styles.tab}>
        <div className={styles.collections}>
          <Link href="/collections">
            <a> Collections</a>
          </Link>
        </div>
        {active && (
          <div className={styles.profile}>
            <Link href="/profile">
              <a>Profile</a>
            </Link>
          </div>
        )}
        <div className={styles.connect}>
          <div className={styles.connectBtn}>
            <Connect />
          </div>
        </div>
      </div>
    </nav>
  );
}
