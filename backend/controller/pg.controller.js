const PgData = require('../models/PG'); 

// POST: Add PG Data
const addPgData = async (req, res) => {
  try {
    const {
      pgName,
      ownerName,
      description,
      address,
      type,
      occupancyDetails,
      amenities,
      rules,
      contactInfo
    } = req.body;

    const imageFiles = req.files || [];
    // Validate required fields
    if (!pgName || !ownerName || !contactInfo) {
      return res.status(400).json({ 
        message: "Required fields are missing.",
        requiredFields: ["pgName", "ownerName", "contactInfo"]
      });
    }

    // Parse JSON fields safely
    let parsedAddress, parsedType, parsedOccupancyDetails, parsedAmenities, parsedRules, parsedContactInfo;
    
    try {
      parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
      parsedType = typeof type === 'string' ? JSON.parse(type) : type;
      parsedOccupancyDetails = typeof occupancyDetails === 'string' ? JSON.parse(occupancyDetails) : occupancyDetails;
      parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
      parsedRules = typeof rules === 'string' ? JSON.parse(rules) : rules;
      parsedContactInfo = typeof contactInfo === 'string' ? JSON.parse(contactInfo) : contactInfo;
    } catch (parseError) {
      return res.status(400).json({ 
        message: "Invalid JSON format in one of the fields",
        error: parseError.message
      });
    }

    // Validate nested required fields
    if (!parsedAddress?.location) {
      return res.status(400).json({ message: "Address location is required" });
    }

    if (!parsedType?.gender) {
      return res.status(400).json({ message: "Gender type is required" });
    }

    if (!parsedContactInfo?.phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    if (!parsedOccupancyDetails || parsedOccupancyDetails.length === 0) {
      return res.status(400).json({ message: "At least one occupancy detail is required" });
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(parsedContactInfo.phone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    if (parsedContactInfo.alternateContact && !phoneRegex.test(parsedContactInfo.alternateContact)) {
      return res.status(400).json({ message: "Alternate contact must be exactly 10 digits" });
    }

    const newPg = new PgData({
      pgName,
      ownerName,
      description: description || null,
      address: parsedAddress,
      type: parsedType,
      occupancyDetails: parsedOccupancyDetails,
      amenities: parsedAmenities || {
        food: { provided: false, timings: "" },
        wifi: true,
        powerBackup: true,
        cctvSecurity: true
      },
      rules: parsedRules || {
        guardianAllowed: true,
        gender: "",
        preferredOccupants: []
      },
      media: {
        images: imageFiles.map((file) => file.filename)
      },
      contactInfo: parsedContactInfo
    });

    await newPg.save();

    res.status(201).json({ 
      message: "PG submitted successfully", 
      data: newPg 
    });
  } catch (error) {
    console.error("Error submitting PG data:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET: All PGs with optional filtering
const Pgdata = async (req, res) => {
  try {
    const { gender, roomType, minRent, maxRent, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (gender) filter['type.gender'] = gender;
    if (roomType) filter['occupancyDetails.roomType'] = roomType;
    
    // Calculate skip for pagination
    const skip = (Number(page) - 1) * Number(limit);

    const pgData = await PgData.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Sort by newest first

    const total = await PgData.countDocuments(filter);

    res.status(200).json({
      data: pgData,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching PG data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET: PG by ID
const PgdataById = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid PG ID format" });
    }

    const pgData = await PgData.findById(id);
    
    if (!pgData) {
      return res.status(404).json({ message: "PG data not found" });
    }
    
    res.status(200).json(pgData);
  } catch (error) {
    console.error("Error fetching PG by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// // PUT: Update PG Data
// const updatePgData = async (req, res) => {
//   const { id } = req.params;
  
//   try {
//     // Validate ObjectId format
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ message: "Invalid PG ID format" });
//     }

//     const {
//       pgName,
//       ownerName,
//       description,
//       address,
//       type,
//       occupancyDetails,
//       amenities,
//       rules,
//       contactInfo
//     } = req.body;

//     const imageFiles = req.files || [];

//     // Parse JSON fields safely if they exist
//     const updateData = {};
    
//     if (pgName) updateData.pgName = pgName;
//     if (ownerName) updateData.ownerName = ownerName;
//     if (description !== undefined) updateData.description = description;
    
//     if (address) {
//       try {
//         updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
//       } catch (parseError) {
//         return res.status(400).json({ message: "Invalid JSON format in address" });
//       }
//     }
    
//     if (type) {
//       try {
//         updateData.type = typeof type === 'string' ? JSON.parse(type) : type;
//       } catch (parseError) {
//         return res.status(400).json({ message: "Invalid JSON format in type" });
//       }
//     }
    
//     if (occupancyDetails) {
//       try {
//         updateData.occupancyDetails = typeof occupancyDetails === 'string' ? JSON.parse(occupancyDetails) : occupancyDetails;
//       } catch (parseError) {
//         return res.status(400).json({ message: "Invalid JSON format in occupancyDetails" });
//       }
//     }
    
//     if (amenities) {
//       try {
//         updateData.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
//       } catch (parseError) {
//         return res.status(400).json({ message: "Invalid JSON format in amenities" });
//       }
//     }
    
//     if (rules) {
//       try {
//         updateData.rules = typeof rules === 'string' ? JSON.parse(rules) : rules;
//       } catch (parseError) {
//         return res.status(400).json({ message: "Invalid JSON format in rules" });
//       }
//     }
    
//     if (contactInfo) {
//       try {
//         updateData.contactInfo = typeof contactInfo === 'string' ? JSON.parse(contactInfo) : contactInfo;
//       } catch (parseError) {
//         return res.status(400).json({ message: "Invalid JSON format in contactInfo" });
//       }
//     }

//     if (imageFiles.length > 0) {
//       updateData['media.images'] = imageFiles.map((file) => file.filename);
//     }

//     const updatedPg = await PgData.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedPg) {
//       return res.status(404).json({ message: "PG data not found" });
//     }

//     res.status(200).json({ 
//       message: "PG updated successfully", 
//       data: updatedPg 
//     });
//   } catch (error) {
//     console.error("Error updating PG data:", error);
    
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ 
//         message: "Validation error", 
//         errors: Object.values(error.errors).map(e => e.message)
//       });
//     }
    
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // DELETE: Delete PG Data
// const deletePgData = async (req, res) => {
//   const { id } = req.params;
  
//   try {
//     // Validate ObjectId format
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ message: "Invalid PG ID format" });
//     }

//     const deletedPg = await PgData.findByIdAndDelete(id);
    
//     if (!deletedPg) {
//       return res.status(404).json({ message: "PG data not found" });
//     }
    
//     res.status(200).json({ 
//       message: "PG deleted successfully",
//       data: deletedPg
//     });
//   } catch (error) {
//     console.error("Error deleting PG data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

module.exports = {
  Pgdata,
  PgdataById,
  addPgData,
};