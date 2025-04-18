import React from "react";
import { Link } from "react-router-dom";
import styles from "./home_page.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome To NutriMap & Smart Comparision</h1>
      <div className={styles.buttonContainer}>
        <Link to='/Login' className={styles.button}>
          SignIn
        </Link>
        <Link to='/SignUp' className={styles.button}>
          SignUp
        </Link>
      </div>
    </div>
  );
}

export default Home;