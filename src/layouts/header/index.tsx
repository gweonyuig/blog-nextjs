import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import Link from "next/link";

const Header = () => (
  <header className={styles.header}>
    <div className={styles.logo}>
      <Link href="/">
        <Image
          src="/bualapha.png"
          alt="Logo"
          width={50}
          height={50}
          className={styles.logoImage}
        />
      </Link>
      <h1 className={styles.logoText}>BUALAPHA</h1>
    </div>
  </header>
);

export default Header;
