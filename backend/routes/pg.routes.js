const express = require("express");
const upload = require("../middleware/upload");
const { Pgdata, PgdataById , addPgData} = require("../controller/pg.controller");
const router = express.Router();

// Route to get all PG data
router.get("/", Pgdata);
// Route to get PG data by ID
router.get("/pg/:id", PgdataById);

// Route to add new PG data and image with id
router.post("/add", upload.array("images", 10), addPgData);


module.exports = router;