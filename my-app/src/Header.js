import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo-title">
        <img src="/logo192.png" alt="Bay Management Logo" className="logo" />
        <h1 className="title">Bay Management</h1>
      </div>
    </header>
  );
}

export default Header;
