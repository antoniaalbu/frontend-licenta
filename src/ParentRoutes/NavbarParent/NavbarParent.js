import React, { Component } from "react";
import "./NavbarParent.css";
import { Link } from "react-router-dom";
import LogoImage from "../../assets/logo_blue.jpg";

class NavbarParent extends Component {
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

export default NavbarParent;

export const MenuItems = [
    {
        url: "/homeParent",
        cName: "nav-links",
        title: "Home",
    },
    
    {
        url: "/dashboardParent",
        cName: "nav-links",
        title: "Dashboard",
    },

    {
        url: "/notificationsParent",
        cName: "nav-links",
        title: "Inbox",
    },

    {
        url: "/parentAccount",
        cName: "nav-links",
        title: "My Account",
    },

    {
        url: "/",
        cName: "nav-links",
        title: "Logout",
    },
];
