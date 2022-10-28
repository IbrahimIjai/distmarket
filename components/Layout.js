import Navbar from "./Nav";
import Footer from "./Footer";
import styles from "../styles/Layout.module.css"
export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.Navbar}>
        <Navbar />
      </div>
      {children}
      <Footer />
    </div>
  );
}
