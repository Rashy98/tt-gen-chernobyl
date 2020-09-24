import React,{Component} from "react";
import axios from "axios";
import stat from "../assets/css/roomAllo.css";
import TimeAllocationMain from "./TimeAllocationMain";

class GroupNA extends Component{
    constructor(props) {
        super(props);

        this.state={
            rooms:[{room:""}],
            group:"",
            times:[{day:"", intime:"", outtime:""}],
            Newrooms:[],
            groups:[],
            roomData:[],
            selectedTag:"",

        }

        this.handleGroupNameChange = this.handleGroupNameChange.bind(this);
        this.handleAddTime = this.handleAddTime.bind(this);
        this.handleRemoveTimes = this.handleRemoveTimes.bind(this);
        this.onChangeGroups = this.onChangeGroups.bind(this);

        this.AddTimeAllocation = this.AddTimeAllocation.bind(this);
    }
    handleGroupNameChange(e) {
        this.setState({
            room: e.target.value
        })
    }

    handleDayChange = idx => evt => {
        const newDay = this.state.times.map((day, ridx) => {
            if (idx !== ridx)
                return day;
            return { ...day, day: evt.target.value };
        });

        this.setState({ times: newDay });
    };

    handleInTimeChange = idx => evt =>{
        const newInTime = this.state.times.map((intime, ridx) => {
            if (idx !== ridx)
                return intime;
            return { ...intime, intime: evt.target.value };
        });

        this.setState({ times: newInTime });
    }
    handleOutTimeChange = idx => evt =>{
        const newOutTime = this.state.times.map((outtime, ridx) => {
            if (idx !== ridx)
                return outtime;
            return { ...outtime, outtime: evt.target.value };
        });

        this.setState({ times: newOutTime });
    }
    handleAddTime = () => {
        this.setState({
            times: this.state.times.concat([{day:" ", intime:" ", outtime:" " }])
        });
    };

    handleRemoveTimes = idx => () => {
        this.setState({
            times: this.state.times.filter((s, ridx) => idx !== ridx)
        });
    };

    onChangeGroups(e){
        this.setState({
            selectedgroup: e.target.value
        })
    }


    componentDidMount() {
        axios.get('http://localhost:8000/students/')
            .then(response => {
                this.setState({
                    groups: response.data,
                })
            })
    }
    GetID(){
        let newGroups = [];
        this.state.group.map(group =>{
            newGroups.push(group.group);
        })

        return newGroups;

    }

    AddTimeAllocation(e) {
        e.preventDefault();


        let groupId =  this.state.groups.map(groups=>{
            if(groups.groupId === this.state.selectedgroup){
                return groups._id
            }
        })
        const times = {
            _id:groupId,
            times:  this.state.times
        }
        console.log(times);
        axios.post("http://localhost:8000/students/pushTimes/",times)
            .then(res => console.log(res.data));

        alert('Time Allocated!');
        this.setState({
            selectedgroup:"",
            day:"",
            times:[{day:"", time:""}],
        })

    }

    render() {
        return(

            <div>
                <form className="form-inline">

                    <h5 className='mt-3'>Group</h5> &nbsp;
                </form>


                <div className="room">

                    <form className="form-inline">

                        <select className="form-control "
                                style={{width: "50%"}}
                                placeholder='Room'
                                value={this.state.selectedgroup}
                                onChange={this.onChangeGroups}
                        >
                            <option selected style={{fontSize: "15px",width: "100%"}}>Choose Group...</option>
                            {this.state.groups.map(group =>{
                                return(
                                    <option value={group.groupId}>{group.groupId}</option>
                                )
                            })}

                        </select>
                    </form>

                    <form className='form-inline'>
                        <h5 className='mt-3'>Date </h5>
                        <h5 style={{marginLeft:'21%'}} className='mt-3'>Start Time</h5>
                        <h5 style={{marginLeft:'7%'}}className='mt-3'>End Time</h5>
                        <button id="add_field_button" className="btn btn-success"
                                type='button'
                                style={{width: '30px',
                                    height: '30px',
                                    padding: '2px',
                                    borderRadius: '15px',
                                    textAlign: 'center',
                                    fontSize: '15px',
                                    // lineHeight: '1.42857',
                                    marginLeft:'20px',
                                }}
                                onClick={this.handleAddTime}
                        >+
                        </button>
                    </form>
                    {this.state.times.map((time, idx) => (
                        <div>
                            <form className='form-inline'>
                                <select className="form-control rooms w-25" id="room"
                                        style={{width: "50%"}}
                                        placeholder={`Day`}
                                        value={time.day}
                                        onChange={this.handleDayChange(idx)}
                                >
                                    <option selected style={{fontSize: "15px"}}>Choose Day..</option>
                                    <option>Monday</option>
                                    <option>Tuesday</option>
                                    <option>Wednesday</option>
                                    <option>Thursday</option>
                                    <option>Friday</option>
                                    <option>Saturday</option>
                                    <option>Sunday</option>

                                </select>
                                <input className='form-control-sm ml-2' type='time' onChange={this.handleInTimeChange(idx)} value={time.time}/>
                                &nbsp;
                                <input className='form-control-sm ml-2' type='time' onChange={this.handleOutTimeChange(idx)} value={time.time}/>
                                &nbsp;
                                <button
                                    type="button"
                                    onClick={this.handleRemoveTimes(idx)}
                                    className="btn btn-danger btn-sm"
                                >
                                    X
                                </button>
                            </form>
                        </div>
                    ))}



                    <br/>
                    <div className="form-group mx-sm-3 mb-2 text-center">
                        <button type="submit" className="btn my-1" onClick={this.AddTimeAllocation}>
                            Add Time Allocation
                        </button>
                    </div>
                </div>
            </div>
        );
    }

}
export default GroupNA
