import React,{Component} from "react";
import nav from "../assets/css/navbar.css";
import common from "../assets/css/common.css";
import location from "../assets/css/location.css";
import {Link} from "react-router-dom";

export default class TagNav extends Component{
    render() {
        return (
            <div className="navbar">
                <Link to="/AddTag">Add a Tag</Link>
                <Link to="/ViewTag">View Tag Data</Link>
            </div>
        );
    }
}
