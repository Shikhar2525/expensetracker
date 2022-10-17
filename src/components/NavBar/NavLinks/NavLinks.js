import React from "react";
import "./NavLinks.css";
import { Link } from "react-router-dom";
function NavLinks(props) {
  return (
    <div className="navLinks container mt-4">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/manage">Manage Expense</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/stats">Statistics</Link>
        </li>
      </ol>
      <div className="toggler">
        <input
          type="checkbox"
          class="checkbox123"
          id="checkbox"
          onClick={() => props.toggler()}
        />
        <label for="checkbox" class="label123">
          <i class="fas fa-moon"></i>
          <i class="fas fa-sun"></i>
          <div class="ball" />
        </label>
      </div>
    </div>
  );
}

export default NavLinks;
