import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="footer">
      <p>&copy; 2024 MaiQuocHuy. All Rights Reserved</p>
      <div className="footer__links">
        {["Home", "About", "Contact", "Terms of Service", "Privacy Policy"].map(
          (link, index) => (
            <Link
            scroll={false}
              key={index}
              href={`/${link.toLowerCase().split(" ").join("-")}`}
              className="footer__link"
            >
              {link}
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Footer;
