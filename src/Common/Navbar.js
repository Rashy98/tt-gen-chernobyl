import React,{Component} from "react";
import nav from "../assets/css/navbar.css";
import common from "../assets/css/common.css";
import logo from "../assets/Images/logo.png"
import {Link} from "react-router-dom";
import axios from "axios";
import { withRouter } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'



class NavBar extends Component{

    constructor(props) {
        super(props);
        this.state={
            isLoading : false
        }

        this.createTable = this.createTable.bind(this);
    }

    GoHome(){
        window.location = '/'
    }

    async createTable(e){
        e.preventDefault();

        this.setState({
            isLoading:true
        })
        let response = await axios.get('http://localhost:8000/generateTable/getStudentTable');

        if (response.data.success){
            this.setState({
                isLoading:false
            })
            this.props.history.push({
                pathname : '/TimeTable'
            });

        } else {
            alert('Failed to generate table')
        }

    }
    render() {
        return (
            <div>
            <div className="sidenav">

                    <img src={logo} style={{width:'12em', height:'12em',marginLeft:'-2%'}} onClick={this.GoHome}/>
                    <ul className="nav flex-sm-column">
                    <li className="nav-item">
                    <Link className="nav-link" to="/LecHome">Lecture Details</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to="/SubHome">Subjects</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to="/AddWeekdayWorkingDays" id="WorkingDaysMain">Working days</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link"  id="addStu" to="/AddStudent">Student Details</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link " to="/AddTag">Tags</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link " to="/AddLocation" id="addLoc">Locations</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link " id="addSession" to="/AddSession">Sessions</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link " to="/TimeAllocationMain">Time allocation</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link " to="/RoomAlMain" id="roomAl">Room allocation</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link " to="/StuStats" id="stats">Statistics</Link>
                    </li>
                    <br/>
                    <li className="nav-item">
                    <Link className="nav-link " to="/TimeTable" id="timeTab">Time Table</Link>
                    </li>
                    <br/>
                    <button onClick={this.createTable} disabled={this.state.isLoading}>{this.state.isLoading?"Loading...":"Generate"}</button>
                    </ul>
            </div>


            </div>
        );
    }
}

export default withRouter(NavBar);
