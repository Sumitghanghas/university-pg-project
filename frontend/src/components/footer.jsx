import "./style/footer.css";

import React, { useState } from "react";

const Footer = () => {
  const [showInitials, setShowInitials] = useState(false);

  const handleFooterClick = () => {
    setShowInitials((prev) => !prev);
  };

  return (
    <footer className="footer" onClick={handleFooterClick} style={{ cursor: "pointer" }}>
      <p>
        &copy; {new Date().getFullYear()} Hostel App. All rights reserved.
        {showInitials && (
          <span className="footer-initials" style={{ marginLeft: "12px",color: "#555" }}>
          ASARBSKNSP 
          </span>
        )}
      </p>
    </footer>
  );
};


export default Footer;