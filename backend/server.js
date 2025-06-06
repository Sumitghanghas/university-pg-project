require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const Pgroutes = require("./routes/pg.routes");
const connectdb = require("./lib/db");

const app = express(); 

app.use(express.urlencoded({ extended: true }));

//cors 
app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
}));

app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/home", Pgroutes);

// Server
const port = process.env.PORT;

// Connect DB and Start Server
app.listen(port, "0.0.0.0", () => {
  console.log("Server started on port", port);
  connectdb();
});
