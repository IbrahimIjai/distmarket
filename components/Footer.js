import styles from "../Frontpage/styles/footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.socials}>
          <h2>
            Community <span>✨</span>
          </h2>
          <ul>
            <li>
              <a href="https://twitter.com/Distant_Finance" target="_blank">
                {" "}
                Twitter{" "}
              </a>
            </li>
            <li>
              <a href="https://t.me/Distant_Finance" target="_blank">
                {" "}
                Telegram{" "}
              </a>
            </li>
            <li className={styles.cross}>
              <a href="#"> Discord </a>
            </li>
            <li>
              <a href="https://medium.com/@Distant_Finance" target="_blank">
                {" "}
                Medium{" "}
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.resources}>
          <h2>
            Resources <span>📋</span>
          </h2>
          <ul>
            <li className={styles.cross}>
              <a href="#"> Protocol Code </a>
            </li>
            <li>
              <a href="https://docs.distant.finance" target="_blank">
                {" "}
                Documentation{" "}
              </a>
            </li>
            <li className={styles.cross}>
              <a href="#"> Statistics </a>
            </li>
          </ul>
        </div>
        <div className={styles.jobs}>
          <h2>
            Careers <span>💼</span>
          </h2>
          <ul>
            <li className={styles.cross}>
              <a href="#"> Available Positions </a>
            </li>
          </ul>
        </div>

        <div className={styles.contact}>
          <h2>
            Contact <span>📌</span>
          </h2>
          <ul>
            <li>
              <a href="./FAQ/faq.html" target="_blank">
                {" "}
                FAQ section{" "}
              </a>
            </li>
            <li>
              <a href="mailto:contact@distant.finance" target="_blank">
                {" "}
                Contact us{" "}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.hr}>
        <hr
          className={styles.copyright}
          data-content="© 2022 | Distance Labs"
        />
      </div>
    </footer>
  );
}
