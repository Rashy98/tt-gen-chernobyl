import React,{Component} from "react";
import nav from "../assets/css/navbar.css";
import common from "../assets/css/common.css";
import location from "../assets/css/location.css";
import {Link} from "react-router-dom";

export default class timeNav extends Component{
    render() {
        return (
            <div className="navbar" >
                <Link style={{width:'25%'}} to="/TimeAllocationMain">Not Available</Link>
                <Link style={{width:'25%'}} to="/ConsecutiveSessions">Consecutive Sessions</Link>
                <Link style={{width:'25%'}} to="/ParallelSessions">Parallel Sessions</Link>
                <Link style={{width:'25%'}} to="/OverlapSessions">Sessions Should Not Overlap</Link>
            </div>
        );
    }
}
