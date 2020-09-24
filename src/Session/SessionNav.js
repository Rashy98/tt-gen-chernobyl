import React,{Component} from "react";
import {NavLink} from "react-router-dom";

export default class SessionNav extends Component{
    render() {
        return (
            <div>
                <nav className="navbar">
                    <NavLink
                        exact
                        activeClassName="navbar__link--active"
                        className="navbar__link"
                        to="/AddSession"
                    >
                        Create Session
                    </NavLink>

                    <NavLink
                        activeClassName="navbar__link--active"
                        className="navbar__link"
                        to="/ViewSession"
                    >
                        View Session
                    </NavLink>
                </nav>
            </div>
        );
    }
}