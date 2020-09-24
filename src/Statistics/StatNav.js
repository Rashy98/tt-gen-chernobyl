import React,{Component} from "react";
import {NavLink} from "react-router-dom";
// import nav from "../assets/css/navbar.css";
// import common from "../assets/css/common.css";
// import location from "../assets/css/location.css";

export default class StatNav extends Component{
    render() {
        return (
        <div className="navbar">
            <NavLink to="/StuStats"
                     activeClassName="navbar__link--active"
                     className="navbar__link">
                Student Statistics
            </NavLink>
            <NavLink to="/LecturerStats"
                     activeClassName="navbar__link--active"
                     className="navbar__link">
                Lecturer Statistics
            </NavLink>
            <NavLink  to="/SubjectStats"
                      activeClassName="navbar__link--active"
                      className="navbar__link">
                Subject Statistics</NavLink>
        </div>
        );
    }
}
