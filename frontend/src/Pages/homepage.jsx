import React from "react";
import { useNavigate } from "react-router-dom";
import "./style/home.css";
import famImg from "../assets/fam.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Main = () => {
  const navigate = useNavigate();

  const handleCardClick = (category) => {
    navigate("/all-pgs", { state: { category } });
  };

  return (
    <>
    <section className="intro">
      <div className="content">
        <p className="intropara">
          From <span className="pink">admissions to accommodation</span> - we've got you.
        </p>
        <h1>
          Helping you <span className="pink">find a comfort zone</span>, right <span className="highlight-pink">near</span> campus.
        </h1>
        <div className="pg-options-cards">
          <div className="pg-card girls" onClick={() => handleCardClick("Girls")}>
            <h2>Girls PG</h2>
            <p>Safe, comfortable, and friendly hostels for girls.</p>
          </div>
          <div className="pg-card boys" onClick={() => handleCardClick("Boys")}>
            <h2>Boys PG</h2>
            <p>Affordable and convenient hostels for boys.</p>
          </div>
          <div className="pg-card coed" onClick={() => handleCardClick("Coed")}>
            <h2>Coed PG</h2>
            <p>Modern, inclusive hostels for everyone.</p>
          </div>
        </div>
      </div>
      <div className="famimg">
        <img src={famImg} alt="Family" />
      </div>
    </section>
    </>
    );
};

export default Main;