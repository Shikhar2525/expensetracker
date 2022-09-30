import React from "react";
import "./NavBar.css";
import NavLinks from "./NavLinks/NavLinks";

function NavBar() {
  return (
    <div className={`navBar m-2`}>
      <div className={`navElements`}>
        <div className="searchbar col-4">
          <input
            type="text"
            className="form-control search"
            name=""
            id=""
            aria-describedby=""
            placeholder="Search an expense"
          />
        </div>
        <div className="m-2">
          <input
            type="button"
            className="btn btn-dark"
            placeholder="Search"
            value="Search"
          />
        </div>
      </div>
      <div className="navLink">
        <NavLinks />
      </div>
      <div className="head d-flex justify-content-center">
      <img src={process.env.PUBLIC_URL + '/logo.png'} alt="logo" />
      </div>
    </div>
  );
}

export default NavBar;
