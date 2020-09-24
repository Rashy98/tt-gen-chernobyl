import React,{Component} from "react";
import {Link, NavLink} from "react-router-dom";

export default class SubNav extends Component{
    render() {
        return (
            <div>
                <nav className="navbar">
                    <Link
                        exact
                        activeClassName="navbar__link--active"
                        className="navbar__link"
                        to="/AddSub"
                    >
                        Add Subject
                    </Link>

                    <Link
                        activeClassName="navbar__link--active"
                        className="navbar__link"
                        to="/ViewSub"
                    >
                        View Subject
                    </Link>
                </nav>
            </div>
        );
    }
}
