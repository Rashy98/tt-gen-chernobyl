import React,{Component} from "react";
import workingDays from "../assets/css/workingdays.css";
import WorkingDaysNav from "./Common/ViewWorkingDaysNav";
import {Table} from "react-bootstrap";
import axios from "axios";
import { withRouter } from 'react-router-dom';
import WorkNav from "./Common/workingMainNav";
import {Link} from 'react-router-dom';

class ViewWeekendWorkingDays extends Component{

    constructor(props){
        super(props);

        this.state = {
            dayType : '',
            noOfWorkingDays : 0,
            arr_workingDays : [],
            workingHours : 0,
            workingMinutes : 0,
            timeSlot : '',
            days : ''
        };

        this.deleteData = this.deleteData.bind(this);
    }

    componentDidMount() {

        axios.get('http://localhost:8000/workingdays/get', { params : {dayType : 'Weekend'}})
            .then(res => {

                if(res.data.success){

                    this.setState({
                        dayType : res.data.result.dayType,
                        noOfWorkingDays : res.data.result.noOfDays,
                        arr_workingDays : res.data.result.workingDays,
                        workingHours : res.data.result.workingHours.hours,
                        workingMinutes : res.data.result.workingHours.minutes,
                        timeSlot : res.data.result.workingTimeSlot
                    }, () => {

                        let tempArr = [];

                        this.state.arr_workingDays.map(day => {
                            tempArr.push(day)
                            tempArr.push(<br/>)
                        });

                        this.setState({ days : tempArr})
                    })
                } else {
                    alert("Empty data set")
                }

            })
            .catch(err => alert("Error Reading Data"))

    }

    /* ---------------------------------------------- Delete Data --------------------------------------------------- */
    deleteData(){
        axios.delete('http://localhost:8000/workingdays/delete', {data : {dayType : "Weekend"}})
            .then(result => {

                if(result.data.success){
                    alert('Successfully deleted');

                    // this.props.history.push({
                    //     pathname : '/WorkingDaysMain'
                    // });
                } else {
                    alert('Failed to delete. Try again!')
                }
            })
            .catch(err => alert( err))
    }

    handleEditClick = () => {

        const params = {
            dayType : this.state.dayType,
            noOfWorkingDays : this.state.noOfWorkingDays,
            arr_workingDays : this.state.arr_workingDays,
            workingHours : this.state.workingHours,
            workingMinutes : this.state.workingMinutes,
            timeSlot : this.state.timeSlot
        }

        this.props.history.push({
            pathname : '/AddWeekendWorkingDays',
            state : { params }
        });
    }

    render() {
        return (
            <div className="main">
                <WorkNav/>

                <div className="form">
                    <WorkingDaysNav/>
                    <h3>Weekend</h3>
                    <Table style={{width:"100%"}} className='table-striped '>

                        {/* ---------------------------------------------------------------------------------------- */}
                        {/* ----------------------------      No.of Working Days     ------------------------------- */}
                        {/* ---------------------------------------------------------------------------------------- */}
                        <tr>
                            <th style={{fontSize:"15px"}}>Total Working Days</th>
                            <td style={{fontSize:"15px"}}>{this.state.noOfWorkingDays}</td>
                        </tr>

                    <tr></tr>
                        {/* ---------------------------------------------------------------------------------------- */}
                        {/* ----------------------------      Working Days     ------------------------------------- */}
                        {/* ---------------------------------------------------------------------------------------- */}
                        <tr>
                            <th style={{fontSize:"15px"}}>Days</th>
                            <td style={{fontSize:"15px"}}>{this.state.days}</td>
                        </tr>

                        {/* ---------------------------------------------------------------------------------------- */}
                        {/* ----------------------------      Working Hours     ------------------------------------ */}
                        {/* ---------------------------------------------------------------------------------------- */}
                        <tr>
                            <th style={{fontSize:"15px"}}>Working Hours</th>
                            <td style={{fontSize:"15px"}}>{this.state.workingHours} hours {this.state.workingMinutes} minutes</td>
                        </tr>

                        {/* ---------------------------------------------------------------------------------------- */}
                        {/* ----------------------------      Time Slot     ---------------------------------------- */}
                        {/* ---------------------------------------------------------------------------------------- */}
                        <tr>
                            <th style={{fontSize:"15px"}}>Time Slot</th>
                            <td style={{fontSize:"15px"}}>{this.state.timeSlot}</td>
                        </tr>
                    </Table>
                    <br/>

                    <div className="row">
                        <div className="column">
                        {/* ---------------------------------------------------------------------------------------- */}
                        {/* ----------------------------      Edit Button     -------------------------------------- */}
                        {/* ---------------------------------------------------------------------------------------- */}
                            <button type="submit"
                                    className="btn mb-2"
                                    style={{backgroundColor: "#312450", color: "white", marginLeft: "50%", width: "100px"}}
                                    onClick = { this.handleEditClick }
                            >Edit</button>
                        </div>
                        <div className="column">
                        {/* ---------------------------------------------------------------------------------------- */}
                        {/* ----------------------------      Delete Button     ------------------------------------ */}
                        {/* ---------------------------------------------------------------------------------------- */}
                            <button type="submit"
                                    className="btn mb-2"
                                    style={{backgroundColor: "#312450", color: "white", marginLeft: "40px", width: "100px"}}
                                    // onClick={this.deleteData}
                            >
                                <Link style={{color:'white'}}
                                      onClick={()=>this.deleteData}>
                                Delete
                            </Link>
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ViewWeekendWorkingDays);
