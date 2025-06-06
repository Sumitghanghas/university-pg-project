import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Pghomepage";
import PGDetails from "./Pages/PgDetails";
import PgApplyForm from "./Pages/Applypgfrom"; // Uncomment if you want to use the apply form
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/pg-details/:id" element={<PGDetails />} />
      <Route path="/apply-pg" element={<PgApplyForm />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;
