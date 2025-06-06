import React, { useState } from "react";
import "./style/PgApplyForm.css";
import usePgStore from "../store/PgStore";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PgApplyForm() {
  const { submitPgForm, isSubmitting } = usePgStore();
  const navigate = useNavigate();
  const [pgData, setPgData] = useState({
    pgName: "",
    ownerName: "",
    description: "",
    address: {
      location: "",
      nearbyLandmark: ""
    },
    type: {
      gender: ""
    },
    occupancyDetails: [],
    amenities: {
      food: {
        provided: false,
        timings: ""
      },
      wifi: true,
      powerBackup: true,
      cctvSecurity: true
    },
    rules: {
      guardianAllowed: true,
      gender: "",
      preferredOccupants: []
    },
    media: {
      images: []
    },
    contactInfo: {
      phone: "",
      alternateContact: ""
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name.includes('.')) {
      const keys = name.split('.');
      setPgData(prev => {
        const updated = { ...prev };
        let current = updated;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        const lastKey = keys[keys.length - 1];
        current[lastKey] = type === 'checkbox' ? checked : value;
        
        return updated;
      });
    } else if (name === "images") {
      setPgData(prev => ({
        ...prev,
        media: { ...prev.media, images: Array.from(files) }
      }));
    } else if (name === "preferredOccupants") {
      setPgData(prev => {
        const currentOccupants = prev.rules.preferredOccupants;
        const updated = currentOccupants.includes(value)
          ? currentOccupants.filter(occ => occ !== value)
          : [...currentOccupants, value];
        
        return {
          ...prev,
          rules: { ...prev.rules, preferredOccupants: updated }
        };
      });
    } else {
      setPgData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const addOccupancyDetail = () => {
    setPgData(prev => ({
      ...prev,
      occupancyDetails: [
        ...prev.occupancyDetails,
        {
          roomType: "",
          airConditioning: "",
          rentPerBed: 0,
          securityDepositPerBed: 0,
          extraCharges: 0
        }
      ]
    }));
  };

  const updateOccupancyDetail = (index, field, value) => {
    setPgData(prev => ({
      ...prev,
      occupancyDetails: prev.occupancyDetails.map((detail, i) =>
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const removeOccupancyDetail = (index) => {
    setPgData(prev => ({
      ...prev,
      occupancyDetails: prev.occupancyDetails.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = [
      "pgName",
      "ownerName",
      "address.location",
      "type.gender",
      "contactInfo.phone"
    ];

    for (const field of requiredFields) {
      const keys = field.split('.');
      let value = pgData;
      for (const key of keys) {
        value = value[key];
      }
      if (!value || value.toString().trim() === "") {
        alert(`Please fill the required field: ${field.replace('.', ' ')}`);
        return;
      }
    }

    if (pgData.occupancyDetails.length === 0) {
      alert("Please add at least one occupancy detail");
      return;
    }

    // Phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(pgData.contactInfo.phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    if (pgData.contactInfo.alternateContact && !phoneRegex.test(pgData.contactInfo.alternateContact)) {
      alert("Alternate contact must be exactly 10 digits");
      return;
    }

    try {
      await submitPgForm(pgData);
      navigate("/"); // Redirect to PG listings after successful submission
      alert("PG submitted successfully!");
      // Reset form if needed
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <>
    <Navbar />
    <div className="form-container">
      <form onSubmit={handleSubmit} className="pg-form" encType="multipart/form-data">
        <h2 className="form-title">PG Submission Form</h2>

        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label>PG Name <span className="required">*</span></label>
            <input 
              type="text" 
              name="pgName" 
              value={pgData.pgName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Owner Name <span className="required">*</span></label>
            <input 
              type="text" 
              name="ownerName" 
              value={pgData.ownerName} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={pgData.description} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="form-section">
          <h3>Address Information</h3>
          
          <div className="form-group">
            <label>Location <span className="required">*</span></label>
            <textarea 
              name="address.location" 
              value={pgData.address.location} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Nearby Landmark</label>
            <input 
              type="text" 
              name="address.nearbyLandmark" 
              value={pgData.address.nearbyLandmark} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Type Information */}
        <div className="form-section">
          <h3>PG Type</h3>
          
          <div className="form-group">
            <label>Gender Type <span className="required">*</span></label>
            <select 
              name="type.gender" 
              value={pgData.type.gender} 
              onChange={handleChange} 
              required
            >
              <option value="">--Select--</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Coed">Coed</option>
            </select>
          </div>
        </div>

        {/* Occupancy Details */}
        <div className="form-section">
          <h3>Occupancy Details</h3>
          
          <div className="help-note">
            <p><strong>Note:</strong> Add different room configurations available in your PG (e.g., AC Single, Non-AC Double, etc.)</p>
          </div>

          {pgData.occupancyDetails.map((detail, index) => (
            <div key={index} className="occupancy-detail">
              <h4>Room Option {index + 1}</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Room Type</label>
                  <select 
                    value={detail.roomType}
                    onChange={(e) => updateOccupancyDetail(index, 'roomType', e.target.value)}
                  >
                    <option value="">--Select--</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                    <option value="Quad">Quad</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Air Conditioning</label>
                  <select 
                    value={detail.airConditioning || ""}
                    onChange={(e) => updateOccupancyDetail(index, 'airConditioning', e.target.value)}
                  >
                    <option value="">--Select--</option>
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rent Per Bed</label>
                  <input 
                    type="number" 
                    value={detail.rentPerBed}
                    onChange={(e) => updateOccupancyDetail(index, 'rentPerBed', parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Security Deposit Per Bed</label>
                  <input 
                    type="number" 
                    value={detail.securityDepositPerBed}
                    onChange={(e) => updateOccupancyDetail(index, 'securityDepositPerBed', parseInt(e.target.value))}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Extra Charges</label>
                  <input 
                    type="number" 
                    value={detail.extraCharges}
                    onChange={(e) => updateOccupancyDetail(index, 'extraCharges', parseInt(e.target.value))}
                    min="0"
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => removeOccupancyDetail(index)}
                className="remove-btn"
              >
                Remove Room Option
              </button>
            </div>
          ))}

          <button type="button" onClick={addOccupancyDetail} className="add-btn">
            Add Room Option
          </button>
        </div>

        {/* Amenities */}
        <div className="form-section">
          <h3>Amenities</h3>
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="amenities.food.provided" 
                checked={pgData.amenities.food.provided} 
                onChange={handleChange} 
              />
              Food Provided
            </label>
          </div>

          {pgData.amenities.food.provided && (
            <div className="form-group">
              <label>Food Timings</label>
              <input 
                type="text" 
                name="amenities.food.timings" 
                value={pgData.amenities.food.timings} 
                onChange={handleChange}
                placeholder="e.g., Breakfast: 7-9 AM, Lunch: 12-2 PM, Dinner: 7-9 PM"
              />
            </div>
          )}

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="amenities.wifi" 
                checked={pgData.amenities.wifi} 
                onChange={handleChange} 
              />
              WiFi Available
            </label>
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="amenities.powerBackup" 
                checked={pgData.amenities.powerBackup} 
                onChange={handleChange} 
              />
              Power Backup
            </label>
          </div>

          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="amenities.cctvSecurity" 
                checked={pgData.amenities.cctvSecurity} 
                onChange={handleChange} 
              />
              CCTV Security
            </label>
          </div>
        </div>

        {/* Rules */}
        <div className="form-section">
          <h3>Rules & Restrictions</h3>
          
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                name="rules.guardianAllowed" 
                checked={pgData.rules.guardianAllowed} 
                onChange={handleChange} 
              />
              Guardian Visits Allowed
            </label>
          </div>

          <div className="form-group">
            <label>Allowed Gender</label>
            <select 
              name="rules.gender" 
              value={pgData.rules.gender} 
              onChange={handleChange}
            >
              <option value="">--Select--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Occupants</label>
            <div className="checkbox-group">
              {["Students", "Working Professionals", "Any"].map((type) => (
                <label key={type}>
                  <input
                    type="checkbox"
                    name="preferredOccupants"
                    value={type}
                    checked={pgData.rules.preferredOccupants.includes(type)}
                    onChange={handleChange}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h3>Contact Information</h3>
          
          <div className="form-group">
            <label>Phone Number <span className="required">*</span></label>
            <input 
              type="tel" 
              name="contactInfo.phone" 
              value={pgData.contactInfo.phone} 
              onChange={handleChange} 
              pattern="[0-9]{10}"
              placeholder="10-digit phone number"
              required 
            />
          </div>

          <div className="form-group">
            <label>Alternate Contact</label>
            <input 
              type="tel" 
              name="contactInfo.alternateContact" 
              value={pgData.contactInfo.alternateContact} 
              onChange={handleChange}
              pattern="[0-9]{10}"
              placeholder="10-digit phone number"
            />
          </div>
        </div>

        {/* Media */}
        <div className="form-section">
          <h3>Images</h3>
          
          <div className="help-note">
            <p><strong>Note:</strong> Please select at least 5 images to showcase your PG properly. Include photos of rooms, common areas, kitchen, and exterior.</p>
          </div>
          
          <div className="form-group">
            <label>Upload Images</label>
            <input 
              type="file" 
              name="images" 
              accept="image/*" 
              multiple 
              onChange={handleChange} 
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting} >
          {isSubmitting ? 'Submitting...' : 'Submit PG'}
        </button>
      </form>
    </div>
    <Footer />
    </>
  );
}