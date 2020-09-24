import React,{Component} from "react";
import {NavLink} from "react-router-dom";

export default class LecNav extends Component{
    render() {
        return (
            <div>
                {/*<a href="/AddLec">Add LecturerNA Details</a>*/}
                {/*<a href="/ViewLec">View LecturerNA Details</a>*/}
                <nav className="navbar">
                    <NavLink
                        exact
                        activeClassName="navbar__link--active"
                        className="navbar__link"
                        to="/AddLec"
                    >
                        Add Lecturer
                    </NavLink>

                    <NavLink
                        activeClassName="navbar__link--active"
                        className="navbar__link"
                        to="/ViewLec"
                    >
                        View Lecturer
                    </NavLink>
                </nav>
            </div>
        );
    }
}