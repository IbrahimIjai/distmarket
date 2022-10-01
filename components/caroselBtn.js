import React from "react";
import styles from "../styles/carosel.module.css"

export const DotButton = ({ selected, onClick }) => (
    <div>
        {
            selected?  <button
            className={styles.emb} 
            type="button"
            onClick={onClick}
          /> :    <button
          className={`${styles.embla__dot}`}
          type="button"
          onClick={onClick}
        />
        }
    </div>
 
);

{/* <button
            className={`${"styles.embla__dot."}${"is-selected"}`} 
            type="button"
            onClick={onClick} */}

