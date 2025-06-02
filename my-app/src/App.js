import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Header from "./Header";
import Footer from "./Footer";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Router>
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
