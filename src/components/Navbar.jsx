import React from "react";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        SafariTix
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#about-us">About Us</a>
        <a href="#features">Features</a>
        <a href="#company">Company</a>
        <a href="#products">Products</a>
      </div>

      {/* Auth Buttons */}
      <div className="auth-buttons">
        <button className="signup">Signup</button>
        <button className="login">Login</button>
      </div>
    </nav>
  );
}

export default Navbar;
