const mongoose = require("mongoose");

const pgSchema = new mongoose.Schema({
  pgName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  address: {
    location: {
      type: String,
      required: true,
    },
    nearbyLandmark: {
      type: String,
    },
  },
  type: {
    gender: {
      type: String,
      enum: ["Boys", "Girls", "Coed"],
      required: true,
    },
  },
  occupancyDetails: [
    {
      roomType: {
        type: String,
        enum: ["Single", "Double", "Triple", "Quad", "Custom"],
      },
      airConditioning: {
        type: String,
        enum: ["AC", "Non-AC"],
      },
      rentPerBed: {
        type: Number,
        required: true,
      },
      securityDepositPerBed: {
        type: Number,
        required: true,
      },
      extraCharges: {
        type: Number,
      },
      extraChargesDescription: {
        type: String,
      },
    },
  ],
  amenities: {
    food: {
      provided: {
        type: Boolean,
        default: false,
      },
      timings: {
        type: String,
      },
    },
    wifi: {
      type: Boolean,
      default: true,
    },
    powerBackup: {
      type: Boolean,
      default: true,
    },
    cctvSecurity: {
      type: Boolean,
      default: true,
    },
  },
  rules: {
    guardianAllowed: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Any"],
    },
    preferredOccupants: {
      type: [String],
      enum: ["Students", "Working Professionals", "Any"],
    },
    timingRestrictions: {
      restriction: {
        type: String,
        default: "None",
      },
      time: {
        type: String,
      },
    },
  },
  media: {
    images: [String], // Store image filenames
  },
  contactInfo: {
    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
      required: true,
    },
    alternateContact: {
      type: String,
      match: [/^\d{10}$/, "Alternate contact must be 10 digits"],
    },
  },
}, { timestamps: true });

const PgData = mongoose.model("PgData", pgSchema);

module.exports = PgData;