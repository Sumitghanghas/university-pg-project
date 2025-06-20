
import React from "react";
import { Link } from "react-router-dom";
import "./style/navbar.css";
import logo from "../assets/cblu_logo.png";

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-logo">
      <Link to="/">
        <img
          src={logo}
          alt="Logo"
        />
        <span className="hostel-app-title full-title">CBLU Hostel Explorer</span>
<span className="hostel-app-title short-title">Hostel Explorer</span>
      </Link>
    </div>
    <ul className="navbar-links">
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/apply-pg">Add PG</Link>
      </li>
      <li>
        <Link to="/contact">Contact</Link>
      </li>
    </ul>
  </nav>
);

export default Navbar;