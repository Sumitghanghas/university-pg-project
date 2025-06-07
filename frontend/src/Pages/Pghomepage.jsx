// src/pages/AllPgs.jsx
import React, { useEffect } from "react";
import useStore from "../store/Pgstore";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import "./style/Pghomepage.css"; 


const AllPgs = () => {
  const { pgListings, fetchPgListings, isLoading, error } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedCategory = location.state?.category || "All";

  useEffect(() => {
    fetchPgListings();
  }, [fetchPgListings]);

  // Filter functions
  const girlsPG = pgListings.filter(pg => pg.type?.gender === "Girls");
  const boysPG = pgListings.filter(pg => pg.type?.gender === "Boys");
  const coedPG = pgListings.filter(pg => pg.type?.gender === "Coed");

  // Handle filtered view if a specific category is selected
  const sectionsToRender = selectedCategory === "All"
    ? [
        { title: "Girls PG", listings: girlsPG },
        { title: "Boys PG", listings: boysPG },
        { title: "Coed PG", listings: coedPG },
      ]
    : [
        {
          title: `${selectedCategory} PG`,
          listings: pgListings.filter(pg => pg.type?.gender === selectedCategory),
        },
      ];

  return (
    <main className="allpgs-main">
      {/* <button className="homepage-button" onClick={() => navigate("/")}>
        ← Home
      </button> */}
      <h3 className="category-title">
        {selectedCategory === "All"
          ? "All PG Listings"
          : `All ${selectedCategory} PGs`}
      </h3>

      {isLoading && <p className="loading-text">Loading PGs...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {!isLoading && !error &&
        sectionsToRender.map(({ title, listings }, i) => (
          <section key={i}>
            <h4 className="category-subtitle">{title}</h4>
            <div className="card-container">
              {listings.length > 0 ? (
                listings.map(pg => (
                  <Card
                    key={pg._id}
                    pg={pg}
                    onClick={() => navigate(`/pg-details/${pg._id}`)}
                  />
                ))
              ) : (
                <p className="no-pgs-text">No {title.toLowerCase()} available.</p>
              )}
            </div>
            <hr />
          </section>
        ))}
    </main>
  );
};

export default AllPgs;
