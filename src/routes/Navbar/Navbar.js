import React, { Component } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import LogoImage from "../../assets/logo_blue.jpg"; // Import your logo image

class Navbar extends Component {
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

export default Navbar;

export const MenuItems = [
    {
        url: "/",
        cName: "nav-links",
        title: "Home",
    },
    {
        url: "/register",
        cName: "nav-links",
        title: "Register",
    },
    {
        url: "/login",
        cName: "nav-links",
        title: "Login",
    },
];
