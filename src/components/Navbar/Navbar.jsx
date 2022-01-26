import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({state}) => {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="container m-0">
      
        <button
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNav" className="collapse navbar-collapse">
          <ul
            style={{ fontSize: "0.8rem", letterSpacing: "0.15rem" }}
            className="navbar-nav ml-auto"
          >
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/mint" className="nav-link">
                Mint Tokens
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/marketplace" className="nav-link">
                Shroomie Marketplace
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/marketplace-hero" className="nav-link">
                Hero Marketplace
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/my-tokens" className="nav-link">
                My Shroomies
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/my-hero" className="nav-link">
                My Heroes
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/queries" className="nav-link">
                Queries
              </Link>
            </li>
            {(state.contractOwner === state.accountAddress) ?
              <li className="nav-item">
                <Link to="/change-price" className="nav-link">
                  Mint Prices
                </Link>
              </li>
              : null}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
