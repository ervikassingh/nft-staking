import React from "react";
import icon from "./favicon100.png";

import { Link } from "react-router-dom";

const Footbar = ({state}) => {
  return (
    <foot className="footer footer-expand-sm footer-dark bg-dark">
      <div className="container">
      <img src={icon} alt="" />
        <Link to="/" className="footer-brand ml-2">    
        </Link>
        <button
          className="footer-toggler"
          data-toggle="collapse"
          data-target="#footbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="footbarNav" className="collapse navbar-collapse">
          
        </div>
      </div>
    </nav>
  );
};

export default Footbar;
