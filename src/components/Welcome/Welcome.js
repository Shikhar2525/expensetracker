import React from "react";
import "./Welcome.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

function Welcome() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    <div className="main2 container">
      <div className="welcomeBody container-fluid col-12">
        <div className="heading">
          <h1>Welcome To Expense Tracker</h1>
          <h5 className="mt-3">- Manage your expenses like a Pro.</h5>
          <div className="buttons">
            {isAuthenticated ? (
              <>
                <Link to="/manage">
                  <input
                    type="submit"
                    className="btn btnLogin btn-dark mt-4 "
                    value="Add Expenses"
                  />
                </Link>
                <Link to="/stats">
                  <input
                    type="submit"
                    className="btn btnLogin btn-primary mt-4 m-2"
                    value="View Stats"
                  />
                </Link>
              </>
            ) : (
              <input
                type="submit"
                className="btn btnLogin btn-dark mt-4 "
                value="Login"
                onClick={() => loginWithRedirect()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
