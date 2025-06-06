// src/pages/Homepage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import usePgStore from "../store/PgStore";
import "./style/homepage.css";

const Homepage = () => {
  const navigate = useNavigate();
  const { pgListings, isLoading, error, fetchPgListings } = usePgStore();
 

  useEffect(() => {
    fetchPgListings();
  }, []);

  const girlsPG = pgListings.filter(pg => pg.type?.gender === "Girls");
  const boysPG = pgListings.filter(pg => pg.type?.gender === "Boys");
  const coedPG = pgListings.filter(pg => pg.type?.gender === "Coed");

  return (
    <>
      <Navbar />
      <main>
        <h2 className="title">Available PGs</h2>
        <hr />
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!isLoading && !error && (
          <>
            {[{ title: "Girls PG", listings: girlsPG },
              { title: "Boys PG", listings: boysPG },
              { title: "Coed PG", listings: coedPG }
            ].map(({ title, listings }, i) => (
              <section key={i}>
                <h3 className="category-title">{title}</h3>
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
                    <p>No {title.toLowerCase()} available.</p>
                  )}
                </div>
                <hr />
              </section>
            ))}
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Homepage;
