import React from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import Image from "next/image";

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.footerContent}>
      <h2>Link</h2>
      <div className={styles.socialIcons}>
        <Link
          href="https://github.com/gweonyuig"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/icons/logo_github.svg"
            alt="no-image"
            width={32}
            height={32}
          />
        </Link>
        <Link
          href="https://www.facebook.com/profile.php?id=61554287387689"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/icons/logo_facebook.svg"
            alt="no-image"
            width={32}
            height={32}
          />
        </Link>
        <Link
          href="https://www.instagram.com/weoyui/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/icons/logo_instagram.svg"
            alt="no-image"
            width={32}
            height={32}
          />
        </Link>
      </div>
    </div>
    <div className={styles.underline}>
      <span>© 2023 Your Company Name. All rights reserved.</span>
      <span>
        <Link href="/privacy-policy">Privacy Policy</Link> |{" "}
        <Link href="/terms-of-service">Terms of Service</Link>
      </span>
    </div>
  </footer>
);

export default Footer;
