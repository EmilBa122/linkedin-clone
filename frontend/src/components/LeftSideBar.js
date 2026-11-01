import React from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

// For the icon add contact which exists at the very bottom of the left side bar
import { MdPersonAddAlt1 } from "react-icons/md";

const LeftSideBar = () => {
    const { user } = useContext(AuthContext);
    if (!user || (user && user.isAdmin === "yes")) return null;
    const link = `/personal`;

    return ( 
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-light position-fixed vh-100" style={{ width: '15%' }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <span className="fs-4"></span>
            </a>
        
            <ul className="nav nav-pills flex-column mb-auto">
                <li>
                    <div className="text-center">
                        <Link to={link}>
                            <img 
                                src={`https://localhost:8443/pics/${user.profile_pic}`}
                                alt="Profile"
                                className="rounded-circle"
                                width="50" // Adjust size as needed
                                height="50" // Adjust size as needed
                            />
                        </Link>
                    </div>
                </li>
                <li>
                    <Link to={link} className="link-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                        {`${user.first_name}`} {`${user.last_name}`}
                    </Link>
                </li>
                <hr /> {/* for the large horizontal line that exists below the profile pic and name */}
                <li> 
                    <Link to="/connections" className="link-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                        Connections
                        <br />
                        Grow your network
                    </Link>
                    <Link to="/connections" className="nav-link link-dark">
                        <MdPersonAddAlt1 className="ms-2" size={20} />
                    </Link>
                </li>
                {/* <li>
                    <Link to="/about" className="nav-link link-dark">
                        <FaNetworkWired className="bi me-2" size={20} /> Discover more  
                    </Link>
                </li> */}
            </ul>
        </div>
    );
};

export default LeftSideBar;