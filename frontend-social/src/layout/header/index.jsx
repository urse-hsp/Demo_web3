import React from "react";
import { Link } from "react-router-dom";
import Wallet from "./wallet/index.jsx";

import "./index.scss";

export default function Header() {
  return (
    <header id="header">
      <nav className="navbar">
        <div className="container">
          <div className="header-main flex justify">
            <div className="left">
              <Link className="logo-wrap" to={`/`}>
                <img
                  src={process.env.PUBLIC_URL + "/logo-text.png"}
                  className="logo"
                  alt="logo"
                />
              </Link>
            </div>
            <div className="middle"></div>
            <div className="right">
              <Wallet />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
