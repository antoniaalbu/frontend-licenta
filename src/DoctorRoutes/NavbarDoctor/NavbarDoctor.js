import React, { Component } from "react";
import "./NavbarDoctor.css";
import { Link } from "react-router-dom";
import LogoImage from "../../assets/logo_blue.jpg";

class NavbarDoctor extends Component {
    state = { clicked: false };

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked });
    };

    render() {
        return (
            <nav className="NavbarItems">
                <Link to="/" className="navbar-logo">
                    <img src={LogoImage} alt="Logo" />
                </Link>
                <div className="menu-icons" onClick={this.handleClick}></div>
                <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={index}>
                                <Link className={item.cName} to={item.url}>
                                    {item.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }
}

export default NavbarDoctor;

export const MenuItems = [
    {
        url: "/homeDoctor",
        cName: "nav-links",
        title: "Home",
    },
    
    {
        url: "/registerBaby",
        cName: "nav-links",
        title: "Baby Menu",
    },
    
    {
        url: "/manageParents",
        cName: "nav-links",
        title: "Parent Menu",
    },
    
    {
        url: "/sensors",
        cName: "nav-links",
        title: "Sensors",
    },

    {
        url: "/incubatorPage",
        cName: "nav-links",
        title: "Incubators",
    },

    {
        url: "/notifications",
        cName: "nav-links",
        title: "Inbox",
    },

    {
        url: "/doctorAccount",
        cName: "nav-links",
        title: "My Account",
    },
    

    {
        url: "/",
        cName: "nav-links",
        title: "Logout",
    },
];
