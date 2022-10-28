import React from 'react'
import styles from "./Error.module.css"

const Error = () => {
  return (
    <div>
        <div className={styles.errorModal}>
            <p>Ya not admin</p>
        </div>
    </div>
  )
}

export default Error