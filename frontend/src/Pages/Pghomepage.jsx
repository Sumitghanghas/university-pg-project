// src/pages/AllPgs.jsx
import React, { useEffect } from "react";
import useStore from "../store/Pgstore";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/card";
import "./style/Pghomepage.css"; // Keep your original styles
import OOPS from "../assets/OOPS.png"; // Adjust the path if needed

const AllPgs = () => {
  const { pgListings, fetchPgListings, isLoading, error } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedCategory = location.state?.category || "All";

  useEffect(() => {
    fetchPgListings();
  }, [fetchPgListings]);

  // Filter based on selected category
  const filteredPGs =
    selectedCategory === "All"
      ? pgListings
      : pgListings.filter(
          (pg) =>
            pg.type?.gender &&
            pg.type.gender.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <main className="allpgs-main">
      <button className="homepage-button" onClick={() => navigate("/")}>
        ← Home
      </button>
      <h3 className="category-title">
        All {selectedCategory === "All" ? "" : selectedCategory + " "}PGs
      </h3>

      {isLoading && <p className="loading-text">Loading PGs...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {!isLoading && !error && (
        <section>
          <div className="card-container">
            {filteredPGs.length > 0 ? (
              filteredPGs.map((pg) => (
                <Card
                  key={pg._id}
                  pg={pg}
                  onClick={() => navigate(`/pg-details/${pg._id}`)}
                />
              ))
            ) : (
              <div className="no-pgs-wrapper">
                <img
                  src={OOPS}
                  alt="No PGs"
                  className="no-pgs-img"
                />
                <p className="no-pgs-text">
                  No {selectedCategory.toLowerCase()} PGs available.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default AllPgs;
