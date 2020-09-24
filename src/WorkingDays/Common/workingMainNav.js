import React,{Component} from "react";
import nav from "../../assets/css/navbar.css";
// import common from "../assets/css/common.css";
// import location from "../assets/css/location.css";
import {NavLink} from "react-router-dom";

export default class WorkNav extends Component{
    render() {
        return (
            <nav className="navbar">
                <NavLink
                    exact
                    activeClassName="navbar__link--active"
                    className="navbar__link"
                    to="/AddWeekdayWorkingDays"
                >
                   Add working days
                </NavLink>

                <NavLink
                    activeClassName="navbar__link--active"
                    className="navbar__link"
                    to="/ViewWeekdayWorkingDays"
                >
                   View working days
                </NavLink>
            </nav>
        );
    }
}
