import Typical from "react-typical";
import { RingLoader } from "react-spinners";
import styles from "../styles/nftId.module.css";

// Loader helper variable
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
export default function Loader() {
  return (
    <div className={styles.PageLoadingModal}>
      <div className={styles.internalLoadingModal}>
        <RingLoader
          color={"#ffffff"}
          loading={true}
          cssOverride={override}
          size={150}
        />
      </div>
      <div className={styles.loadingText}>
        <Typical
          steps={[
            "",
            2000,
            "Enter...",
            4000,
            "Enter the Void",
            3000,
            "Enter the Void...",
            1000,
          ]}
          loop={1}
          wrapper={"h1"}
        />
      </div>
    </div>
  );
}
