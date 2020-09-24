import React,{Component} from "react";
import {NavLink} from "react-router-dom";
// import nav from "../assets/css/navbar.css";
// import common from "../assets/css/common.css";
// import location from "../assets/css/location.css";

export default class LocNav extends Component{
    render() {
        return (
            <div className="navbar">
                <NavLink to="/AddLocation"
                   activeClassName="navbar__link--active"
                   className="navbar__link">
                    Add Building and Room
                </NavLink>
                <NavLink to="/ViewBuilding"
                         activeClassName="navbar__link--active"
                         className="navbar__link">
                    View Building Data
                </NavLink>
                <NavLink  to="/ViewRoom"
                    activeClassName="navbar__link--active"
                    className="navbar__link">
                    View Room Data</NavLink>
            </div>
        );
    }
}
