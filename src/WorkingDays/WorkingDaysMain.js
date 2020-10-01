import React, { Component } from 'react';
import axios from 'axios';
import workingDays from "../assets/css/workingdays.css";
import {Link} from "react-router-dom";
import history from "./Common/history";

export default class WorkingDaysMain extends Component{

    handleAddWorkingDaysClick = () => {
        history.push('/AddWeekdayWorkingDays');
    }

    handleViewWorkingDaysClick = () => {
        history.push('/ViewWeekdayWorkingDays');
    }

    render(){
        return(
            <div className="main">
                <div className="form">
                    <form>
                        <button type="submit"
                            className="btn mb-2"
                            style={{backgroundColor: "#312450", color: "white", float: "left"}}
                            id="addWorkingDays"
                        ><Link to={'/AddWeekdayWorkingDays'} />
                        Add Working Days</button>

                        <button type="submit"
                            className="btn mb-2"
                            style={{backgroundColor: "#312450", color: "white", float: "right"}}
                            id="viewWorkingDays"
                            onClick={this.handleViewWorkingDaysClick}
                        >View Working Days</button>
                    </form>
                </div>
            </div>
        )
    }
}
