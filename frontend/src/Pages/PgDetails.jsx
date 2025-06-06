// src/components/PGDetail.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import usePgStore from "../store/PgStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./style/PgDetails.css";

function PGDetail() {
  const { id } = useParams();

  const pgId = id;



  // Get state and actions from store
  const {
    selectedPg: pg,
    isLoading,
    error,
    fetchPgDetails,
    clearSelectedPg
  } = usePgStore();

  useEffect(() => {
    if (pgId) {
      fetchPgDetails(pgId);
    }

    // Cleanup on unmount
    return () => {
      clearSelectedPg();
    };
  }, [pgId, fetchPgDetails, clearSelectedPg]);

  if (isLoading) {
    return (
      <div className="pg-loading">
        <p>Loading PG details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pg-error">
        <p>Error: {error}</p>
        <button onClick={() => fetchPgDetails(pgId)} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="pg-empty">
        <p>No PG data available.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pg-detail-container">
        {/* Images */}
        <div className="media-section">
          {pg.media?.images?.length > 0 ? (
            <Carousel
              showThumbs={false}
              infiniteLoop
              autoPlay
              interval={3000}
              showStatus={false}
              className="carousel-wrapper"
            >
              {pg.media.images.map((img, index) => (
                <div key={index}>
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/uploads/pgImages/${img}`}
                    alt={`PG image ${index + 1}`}
                    className="carousel-img"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="no-images">
              <p>No images available</p>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="pg-header">
          <h1>{pg.pgName}</h1>
          <h3>Owner: {pg.ownerName}</h3>
        </div>

        {/* Description */}
        <div className="pg-section">
          <h2>Description</h2>
          <p>{pg.description}</p>
        </div>

        {/* Address */}
        <div className="pg-section">
          <h2>Address</h2>
          <p><strong>Location:</strong> {pg.address?.location}</p>
          <p><strong>Landmark:</strong> {pg.address?.nearbyLandmark}</p>
        </div>

        {/* Occupancy */}
        <div className="pg-section">
          <h2>Occupancy Details</h2>
          <div className="occupancy-cards-container">
            {pg.occupancyDetails?.map((room, i) => (
              <div key={i} className="occupancy-card">
                <h4>{room.roomType} Room ({room.airConditioning})</h4>
                <p><strong>Rent:</strong> ₹{room.rentPerBed}</p>
                <p><strong>Security:</strong> ₹{room.securityDepositPerBed}</p>
                {room.extraCharges > 0 && (
                  <>
                    <p><strong>Extra:</strong> ₹{room.extraCharges}</p>
                    <p>{room.extraChargesDescription}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="pg-section">
          <h2>Amenities</h2>
          <div className="amenities-list">
            {pg.amenities?.wifi ? <p>📶 Wifi Available</p> : <p>❌ No Wifi</p>}
            {pg.amenities?.powerBackup ? <p>🔌 Power Backup</p> : <p>❌ No Backup</p>}
            {pg.amenities?.cctvSecurity ? <p>🎥 CCTV Security</p> : <p>❌ No CCTV</p>}
            <p>
              🍴 Meals: {pg.amenities?.food?.provided ? pg.amenities.food.timings : "Not Provided"}
            </p>
          </div>
        </div>

        {/* Rules */}
        <div className="pg-section">
          <h2>Rules</h2>
          <div className="rules-section">
            <p>👨‍👩‍👧‍👦 Guardian Allowed: {pg.rules?.guardianAllowed ? "Yes" : "No"}</p>
            <p>🚹 Gender Restriction: {pg.type?.gender}</p>
            <p>👥 Preferred: {pg.rules?.preferredOccupants?.join(", ")}</p>
            <p>⏰ Entry Time Restriction: {pg.rules?.timingRestrictions?.restriction}</p>
            {pg.rules?.timingRestrictions?.time && (
              <p>⏱ Entry Time: {pg.rules.timingRestrictions.time}</p>
            )}
            <p>🚬 Smoking: {pg.rules?.smokingAllowed ? "Allowed" : "Not Allowed"}</p>
            <p>🍺 Drinking: {pg.rules?.drinkingAllowed ? "Allowed" : "Not Allowed"}</p>
          </div>
        </div>

        {/* Contact */}
        <div className="pg-section">
          <h2>Contact</h2>
          <div className="contact-section">
            <p>📞 {pg.contactInfo?.phone}</p>
            <p>📱 Alt: {pg.contactInfo?.alternateContact || "Not Provided"}</p>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <Footer />
    </>
  );
}

export default PGDetail;