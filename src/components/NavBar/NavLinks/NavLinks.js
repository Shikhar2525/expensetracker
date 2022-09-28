import React from "react";
import "./NavLinks.css";
function NavLinks() {
  return (
    <div className="navLinks container mt-4">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <a href="/">Home</a>
        </li>
        <li className="breadcrumb-item">
          <a href="/add">Add Expense</a>
        </li>
        <li className="breadcrumb-item">
          <a href="/stats">Statistics</a>
        </li>
      </ol>
    </div>
  );
}

export default NavLinks;
