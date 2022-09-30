import React from "react";
import "./NavLinks.css";
import { Link } from "react-router-dom";
function NavLinks() {
  return (
    <div className="navLinks container mt-4">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/add">Add Expense</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/stats">Statistics</Link>
        </li>
      </ol>
    </div>
  );
}

export default NavLinks;
