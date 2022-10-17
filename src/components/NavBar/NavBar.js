import React from "react";
import "./NavBar.css";
import NavLinks from "./NavLinks/NavLinks";
import { useAuth0 } from "@auth0/auth0-react";

function NavBar(props) {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();
  return (
    <div className={`navBar mt-4`}>
      <div className="allElements  container">
        <div className="logoSpinner">
          <img
            className="Logo"
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt="logo"
          />
          {isLoading ? (
            <div
              class="spinner spinner-border spinner-border-sm mt-4"
              role="status"
            >
              <span class="sr-only"></span>
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="loginDetails col-7">
          <div className="userDetails ">
            {isAuthenticated ? (
              <img
                className="profile"
                src={user.picture}
                width="50px"
                height="50px"
                alt="profile"
              />
            ) : (
              ""
            )}{" "}
            {isAuthenticated ? `${user.name || user.email}` : ""}
          </div>

          {isAuthenticated ? (
            <button
              className="logoutButton btn btn-danger"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log Out
            </button>
          ) : (
            <button
              className="btn btn-dark"
              onClick={() => loginWithRedirect()}
            >
              Log In
            </button>
          )}
        </div>
      </div>

      {isAuthenticated ? (
        <div className="navLink">
          <NavLinks toggler={()=> props.toggler()}/>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default NavBar;
