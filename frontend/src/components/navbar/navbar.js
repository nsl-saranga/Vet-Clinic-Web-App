import React, { useState } from 'react';
import { FaPaw, FaBars, FaTimes } from 'react-icons/fa';
import './navbar.css'; // Ensure you have a CSS file for styling

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="logo">
          <FaPaw className="logo-icon" />
          <span className="logo-text">Vet Care</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <a href="/home" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/services" className="nav-link">Services</a>
          <a href="/my-pets" className="nav-link">My Pets</a>
          <a href="/my-appointments" className="nav-link">Appointments</a>
          <a href="/contact" className="nav-link">Contact</a>
        </div>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <a href="/login" className="login-btn">Login</a>
          <a href="/register" className="signup-btn">Sign Up</a>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <a href="/home" className="mobile-link" onClick={toggleMenu}>Home</a>
          <a href="/about" className="mobile-link" onClick={toggleMenu}>About</a>
          <a href="/services" className="mobile-link" onClick={toggleMenu}>Services</a>
          <a href="/my-pets" className="mobile-link" onClick={toggleMenu}>My Pets</a>
          <a href="/my-appointments" className="mobile-link" onClick={toggleMenu}>Appointments</a>
          <a href="/contact" className="mobile-link" onClick={toggleMenu}>Contact</a>
          <div className="mobile-auth-buttons">
            <a href="/login" className="mobile-login-btn" onClick={toggleMenu}>Login</a>
            <a href="/register" className="mobile-signup-btn" onClick={toggleMenu}>Sign Up</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
