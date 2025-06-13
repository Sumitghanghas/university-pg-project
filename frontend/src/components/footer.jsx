import React, { useState } from "react";
import "./style/footer.css";

const Footer = () => {
  const [showInitials, setShowInitials] = useState(false);

  const handleFooterClick = () => {
    setShowInitials((prev) => !prev);
  };

  return (
    <footer className="footer" onClick={handleFooterClick} style={{ cursor: "pointer" }}>
      <p>
        &copy; {new Date().getFullYear()} CBLU Hostel Explorer. All rights reserved.
        {showInitials && (
          <span className="footer-initials" style={{ marginLeft: "12px",color: "#555" }}>
          ASARKNBSPS 
          </span>
        )}
      </p>
    </footer>
  );
};

export default Footer;