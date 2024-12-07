import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/368px-Google_2015_logo.svg.png"
            alt="Logo"
            className="logo-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
