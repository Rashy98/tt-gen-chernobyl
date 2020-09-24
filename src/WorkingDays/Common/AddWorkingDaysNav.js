import React,{Component} from "react";
import { NavLink } from 'react-router-dom';
import "../../assets/css/workingdays.css";

export default class AddWorkingDaysNav extends Component{
    render() {
        return (
            <nav className="navbar">
                <NavLink
                    exact
                    activeClassName="navbar__link--active"
                    className="navbar__link"
                    to="/AddWeekdayWorkingDays"
                >
                    Weekday
                </NavLink>

                <NavLink
                    activeClassName="navbar__link--active"
                    className="navbar__link"
                    to="/AddWeekendWorkingDays"
                >
                    Weekend
                </NavLink>
              </nav>

//        <div class="topnav">
//                <a href="/AddWeekdayWorkingDays" activeClassName="active">Weekday</a>
//                <a href="/AddWeekendWorkingDays" activeClassName="active">Weekend</a>
//        </div>
//            <div className="navbar">
//                <a href="/AddWeekdayWorkingDays">Weekday</a>
//                <a  href="/AddWeekendWorkingDays">Weekend</a>
//            </div>
        );
    }
}