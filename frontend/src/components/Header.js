import React from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useHistory } from "react-router-dom";

// For the bar icons at the top of the homepage
import { FaHome, FaNetworkWired, FaBriefcase, FaCommentDots, FaBell, FaUser, FaCog } from 'react-icons/fa';

// For the Sign out icon 
import { LuLogOut } from "react-icons/lu";

const Header = () => {
  const { user } = useContext(AuthContext);
  if (!user || (user && user.isAdmin === "yes")) return null;

  
  return (
    <div style={{position: "sticky", top: "0", zIndex: "2"}}>
      <header className="App-header p-3">
        <h1>Linked in</h1>
      </header>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">LinkedIn</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
              <li className="nav-item text-center">
                  <NavLink className="nav-link" to="/home" activeStyle={{color: 'blue'}}>
                    <FaHome size={24} /><br />
                    Αρχική Σελίδα
                  </NavLink>
              </li>
              <li className="nav-item text-center" >
                  <NavLink className="nav-link" to="/connections" exact activeStyle={{color: 'blue'}}>
                    <FaNetworkWired size={24} /><br />
                    Δίκτυο
                  </NavLink>
              </li>
              <li className="nav-item text-center">
                  <NavLink className="nav-link" to="/jobs" activeStyle={{color: 'blue'}}>
                    <FaBriefcase size={24} /><br />
                    Αγγελίες
                  </NavLink>
              </li>
              <li className="nav-item text-center">
                  <NavLink className="nav-link" to="/chat" activeStyle={{color: 'blue'}}>
                    <FaCommentDots size={24} /><br />
                    Συζητήσεις
                  </NavLink>
              </li>
              <li className="nav-item text-center">
                  <NavLink className="nav-link" to="/notifications" activeStyle={{color: 'blue'}}>
                    <FaBell size={24} /><br />
                    Ειδοποιήσεις
                  </NavLink>
              </li>
              <li className="nav-item text-center">
                  <NavLink className="nav-link" to="/personal" activeStyle={{color: 'blue'}}>
                    <FaUser size={24} /><br />
                    Προσωπικά Στοιχεία
                  </NavLink>
              </li>
              <li className="nav-item text-center">
                  <NavLink className="nav-link" to="/settings" activeStyle={{color: 'blue'}}>
                    <FaCog size={24} /><br />
                    Ρυθμίσεις
                  </NavLink>
              </li>
              <li className="nav-item text-center">
                  <a className="nav-link" href="https://localhost:8443/api/logout">
                    <LuLogOut size={24} /><br />
                    Sign Out
                  </a>
              </li>
          </ul>
        </div>
      </nav>

    </div>
  );
};

export default Header;