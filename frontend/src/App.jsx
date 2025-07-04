import React from "react";
import { Routes, Route, Router } from "react-router-dom";
import Homepage from "./Pages/Pghomepage";
import PGDetails from "./Pages/PgDetails";
import PgApplyForm from "./Pages/Applypgfrom";
import Main from "./Pages/homepage";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import "./App.css"; 


const App = () => {
  return (
      <div className="app-root">
        <Navbar />
        <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/all-pgs" element={<Homepage />} />
          <Route path="/pg-details/:id" element={<PGDetails />} />
          <Route path="/apply-pg" element={<PgApplyForm />} />
          <Route path="/" element={<Main />} />
        </Routes>
      </main>
      <Footer />
    </div>    
  );
};
  
export default App;
