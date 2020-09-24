import React,{Component} from "react";
import workingDays from "../assets/css/workingdays.css";
import WorkingDaysNav from "./Common/AddWorkingDaysNav";
import axios from "axios";
import { withRouter } from 'react-router-dom';
import WorkNav from "./Common/workingMainNav";

class AddWeekendWorkingDays extends Component{

    constructor(props){
        super(props);

        this.state = {
            dayType : 'Weekend',
            noOfWorkingDays : 0,
            arr_workingDays : [],
            workingHours : 0,
            workingMinutes : 0,
            timeSlot : '',
            edit : false
        };

        this.onChangeNoOfWorkingDays = this.onChangeNoOfWorkingDays.bind(this);
        this.onChangeWorkingHours = this.onChangeWorkingHours.bind(this);
        this.onChangeWorkingMinutes = this.onChangeWorkingMinutes.bind(this);
        this.onChangeWorkingDays = this.onChangeWorkingDays.bind(this);
        this.onChangeTimeSlot = this.onChangeTimeSlot.bind(this);
        this.checkByDefault = this.checkByDefault.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        if(this.props.location.state && this.props.location.state.params){

            this.setState({
                edit : true,
                noOfWorkingDays : this.props.location.state.params.noOfWorkingDays,
                arr_workingDays : this.props.location.state.params.arr_workingDays,
                workingHours : this.props.location.state.params.workingHours,
                workingMinutes : this.props.location.state.params.workingMinutes,
                timeSlot : this.props.location.state.params.timeSlot
            })
        }
    }

    /* --------------------------------------    No.of Days    ---------------------------------------------- */
    onChangeNoOfWorkingDays = (e) => {
        this.setState({
            noOfWorkingDays : e.target.value
        })
    }

    /* --------------------------------------    Working Hours    ---------------------------------------------- */
    onChangeWorkingHours = (e) => {
        this.setState({
            workingHours : e.target.value
        })
    }

    /* --------------------------------------    Working Minutes    ---------------------------------------------- */
    onChangeWorkingMinutes = (e) => {
        this.setState({
            workingMinutes : e.target.value
        })
    }

    /* --------------------------------------    Working Days    ---------------------------------------------- */
    onChangeWorkingDays = (e) => {

        const target = e.target;
        var value = target.value;

        if(target.checked){
            this.setState(prevState => ({
                arr_workingDays : [...(prevState.arr_workingDays || []), value]
            }))
        }else{
            var arr_temp = [...this.state.arr_workingDays]
            var index = arr_temp.indexOf(value);

            if(index !== -1){
                arr_temp.splice(index, 1);
                this.setState({
                    arr_workingDays : arr_temp
                })
            }
        }

    }

    /* --------------------------------------    Time Slots    ---------------------------------------------- */
    onChangeTimeSlot = (e) => {
        this.setState({
            timeSlot : e.target.value
        })
    }

    /* --------------------------------------    Check Days    ---------------------------------------------- */
    checkByDefault = (e) => {

        var value = e;
        let result = false;

        this.state.arr_workingDays.map(day => {

            if(value === day){
                result = true;
            }
        })

        return result;
    }

    /* --------------------------------------    Form Submit    ---------------------------------------------- */
    onSubmit = (e) => {
        e.preventDefault();

        const day = {
            dayType : this.state.dayType,
            noOfDays : this.state.noOfWorkingDays,
            workingDays : this.state.arr_workingDays,
            workingHours : {
                hours : this.state.workingHours,
                minutes : this.state.workingMinutes
            },
            workingTimeSlot : this.state.timeSlot
        }

        if(!this.state.edit){
            axios.post('http://localhost:8000/workingdays/add', day)
                .then(res => {
                    if(res.data.success){
                        alert('Successfully Added')
                    } else {
                        alert('Error! Already Added')
                    }
                })
                .catch(err => alert("Error! Cannot perform action"))
        } else {
            axios.put('http://localhost:8000/workingdays/update', day)
                .then(res => {
                    if(res.data.success){
                        alert('Successfully Updated')
                    } else {
                        alert('Error! Cannot Update')
                    }
                })
                .catch(err => alert("Error! Cannot perform action"))
        }

        var millisecondsToWait = 1500;
            setTimeout(() => {
                this.props.history.push({
                    pathname : '/ViewWeekdayWorkingDays'
                    });
        }, millisecondsToWait);
    }

    render() {
            return (
                <div className="main">
                    <WorkNav/>
                    <div className="form">
                        <WorkingDaysNav/>
                        <h3>{this.state.edit? "Update" : "Add"} Weekend</h3>
                        <br/>
                        <form onSubmit = {this.onSubmit}>
                            <div classNameName="form-group mx-sm-3 mb-0">

                                {/* ---------------------------------------------------------------------------------------- */}
                                {/* ----------------------------      Add No.of Working Days     --------------------------- */}
                                {/* ---------------------------------------------------------------------------------------- */}
                                <h5>Add Working Days</h5>
                                <label for="workingDays" className="sr-only">No.of Working Days</label>
                                <input  type="number"
                                        className="form-control"
                                        id="workingDays"
                                        min="0"
                                        max="7"
                                        placeholder="Days"
                                        value={this.state.edit ? this.state.noOfWorkingDays : undefined}
                                        onChange = {this.onChangeNoOfWorkingDays}
                                /><br/>

                                {/* ---------------------------------------------------------------------------------------- */}
                                {/* ----------------------------      Add Working Days     --------------------------------- */}
                                {/* ---------------------------------------------------------------------------------------- */}
                                <h5>Select Working Days</h5>
                                <div className="row col-centered">
                                    <div className="column">
                                        <label style={{fontSize:"15px"}}>
                                            <input  type="checkbox"
                                                    id="Monday"
                                                    value="Monday"
                                                    placeholder="Monday"
                                                    checked={this.state.edit? this.checkByDefault("Monday") : undefined}
                                                    onChange = {this.onChangeWorkingDays}
                                            /> Monday
                                        </label><br/>
                                        <label style={{fontSize:"15px"}}>
                                            <input  type="checkbox"
                                                    id="Tuesday"
                                                    value="Tuesday"
                                                    checked={this.state.edit? this.checkByDefault("Tuesday") : undefined}
                                                    onChange = {this.onChangeWorkingDays}
                                            /> Tuesday
                                        </label><br/>
                                        <label style={{fontSize:"15px"}}>
                                            <input  type="checkbox"
                                                    id="Wednesday"
                                                    value="Wednesday"
                                                    checked={this.state.edit? this.checkByDefault("Wednesday") : undefined}
                                                    onChange = {this.onChangeWorkingDays}
                                            /> Wednesday
                                        </label><br/>
                                        <label style={{fontSize:"15px"}}>
                                            <input  type="checkbox"
                                                    id="Thursday"
                                                    value="Thursday"
                                                    checked={this.state.edit? this.checkByDefault("Thursday") : undefined}
                                                    onChange = {this.onChangeWorkingDays}
                                            /> Thursday
                                        </label><br/>
                                        <label style={{fontSize:"15px"}}>
                                            <input  type="checkbox"
                                                    id="Friday"
                                                    value="Friday"
                                                    checked={this.state.edit? this.checkByDefault("Friday") : undefined}
                                                    onChange = {this.onChangeWorkingDays}
                                            /> Friday
                                        </label>
                                    </div>
                                   <div className="column">
                                        <label style={{fontSize:"15px"}}>
                                            <input  type="checkbox"
                                                    id="Saturday"
                                                    value="Saturday"
                                                    checked={this.state.edit? this.checkByDefault("Saturday") : undefined}
                                                    onChange = {this.onChangeWorkingDays}
                                            /> Saturday
                                        </label><br/>
                                        <label style={{fontSize:"15px"}}>
                                            <input  type="checkbox"
                                                    id="Sunday"
                                                    value="Sunday"
                                                    checked={this.state.edit? this.checkByDefault("Sunday") : undefined}
                                                    onChange = {this.onChangeWorkingDays}
                                            /> Sunday
                                        </label>
                                    </div>
                               </div>
                                <br/>

                                {/* ---------------------------------------------------------------------------------------- */}
                                {/* ----------------------------      Add Working Hours     -------------------------------- */}
                                {/* ---------------------------------------------------------------------------------------- */}
                                <h5>Add Working Hours</h5>
                                <div className="row">
                                    <div className="column">
                                        <input  type="number"
                                                className="form-control"
                                                id="Hours"
                                                min="0"
                                                max="24"
                                                placeholder="Hours"
                                                value={this.state.edit ? this.state.workingHours : undefined}
                                                onChange = {this.onChangeWorkingHours}
                                        />
                                    </div>
                                    <div className="column">
                                        <input  type="number"
                                                className="form-control"
                                                id="Minutes"
                                                min="0"
                                                max="59"
                                                placeholder="Minutes"
                                                value={this.state.edit ? this.state.workingMinutes : undefined}
                                                onChange = {this.onChangeWorkingMinutes}
                                        />
                                    </div>
                                </div>
                                <br/>

                                {/* ---------------------------------------------------------------------------------------- */}
                                {/* ----------------------------      Add Time Slot       ---------------------------------- */}
                                {/* ---------------------------------------------------------------------------------------- */}
                                <h5>Select Time Slot</h5>
                                <div className="row col-centered">
                                    <div className="column">
                                        <label style={{fontSize:"15px"}}>
                                            <input  type="radio"
                                                    id="oneHour"
                                                    name="timeSlot"
                                                    value = "One Hour"
                                                    checked={this.state.timeSlot === "One Hour"}
                                                    onChange = {this.onChangeTimeSlot}
                                            /> One Hour
                                       </label>
                                    </div>
                                    <div className="column">
                                        <label style={{fontSize:"15px"}}>
                                            <input  type="radio"
                                                    id="thirtyMinutes"
                                                    name="timeSlot"
                                                    value="Thirty Minutes"
                                                    checked={this.state.timeSlot === "Thirty Minutes"}
                                                    onChange = {this.onChangeTimeSlot}
                                            /> Thirty Minutes
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <br/>
                             <div className="form-group mx-sm-3 mb-2">
                                <button type="submit"
                                        className="btn my-1"
                                        style={{backgroundColor: "#312450", color: "white"}}
                                >{this.state.edit? "Update" : "Add"}</button>
                           </div>
                        </form>
                    </div>
                </div>
            );
        }
}

export default withRouter(AddWeekendWorkingDays);
