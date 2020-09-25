import React,{Component} from "react";
// import workingDays from "../assets/css/workingdays.css";
import axios from "axios";
// import location from "../assets/css/location.css"
// import stat from "../assets/css/stats.css";

export default class TimeTable extends Component{

    constructor(props) {
        super(props);

        this.state = {
            weekdayWorkingDuration : 0,
            weekendWorkingDuration : 0,
            weekdayWorkingTimeSlot : '',
            weekendWorkingTimeSlot : ''
        }
    }

    async componentDidMount() {
        let workingDays;
        let weekday;
        let weekend;

        workingDays = await axios.get('http://localhost:8000/table/getWorkingDays');

        console.log(workingDays)

    }

    render() {
        return(
            <div className="main">
                <div className="row mt-5 align-content-center">
                    <div className="room">
                        <form className="form-inline">
                            <div className="ml-3">
                                <div className="form-inline">
                                    <input type="radio" value="Male" name="gender" /> Student
                                    <input type="radio" value="Female" name="gender" /> Lecturer
                                    <input type="radio" value="Other" name="gender" /> Room
                                </div>
                            </div>

                            <div className="ml-5 form-inline">
                                {/*<h5 className="mt-1">Time Table</h5>*/}
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter Name"
                                    // style={{height : "25px"}}
                                />
                                {/*<label >Time Table : </label>*/}
                            </div>
                            {/*<div className="ml-3">*/}
                            {/*    */}
                            {/*</div>*/}
                            <div className="ml-3">
                                <button className="rounded-circle">SEARCH</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                                <th>Saturday</th>
                                <th>Sunday</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>8.30</td>
                                <td>Manujaya</td>
                                <td>Manujaya</td>
                                <td>Manujaya</td>
                                <td>Manujaya</td>
                                <td>Manujaya</td>
                                <td>Manujaya</td>
                                <td>Manujaya</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}