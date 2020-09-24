import React,{Component} from "react";
import axios from "axios";
import stat from "../assets/css/roomAllo.css";
import TimeAllocationMain from "./TimeAllocationMain";

class LecturerNA extends Component{
    constructor(props) {
        super(props);

        this.state={
            rooms:[{room:""}],
            session:"",
            times:[{day:"", intime:"", outtime:""}],
            Newrooms:[],
            sessions:[],
            roomData:[],
            selectedTag:"",

        }

        this.handleSessionNameChange = this.handleSessionNameChange.bind(this);
        this.handleAddTime = this.handleAddTime.bind(this);
        this.handleRemoveTimes = this.handleRemoveTimes.bind(this);
        this.onChangeSession = this.onChangeSession.bind(this);
        // this.onChangeTag = this.onChangeTag.bind(this);
        // this.GetID = this.GetID.bind(this);
        this.AddTimeAllocation = this.AddTimeAllocation.bind(this);
    }
    handleSessionNameChange(e) {
        this.setState({
            session: e.target.value
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

    onChangeSession (e){
        let index = e.target.selectedIndex;
        let el = e.target.childNodes[index]
        let selectedId=  el.getAttribute('id');

        this.setState({
            selectedSession:e.target.value,
            S_session:e.target.value,
            selectedID:selectedId
        })

        console.log(selectedId,e.target.value)
    }
    selectedID(id){
        this.setState(
            {
                selectedID : id
            }
        )
    }


    componentDidMount() {
        axios.get('http://localhost:8000/generatedSession/viewGeneratedSession')
            .then(response => {
                this.setState({
                    sessions: response.data,


                })
                console.log(this.state.sessions[0].GeneratedSession);
            })
        axios.get('http://localhost:8000/session/viewSession')
            .then(response => {
                this.setState({sessData: response.data})
                console.log(response.data);
            })
    }

    GetID(){
        let newSessions = [];
        this.state.sessions.map(session =>{
            newSessions.push(session.session);
        })

        return newSessions;

    }

    AddTimeAllocation(e) {
        e.preventDefault();


        let sessionId =  this.state.sessions.map(session=>{
            console.log(session.GeneratedSession, this.state.selectedSession)
            if(session.GeneratedSession === this.state.selectedSession){
                return session.GeneratedSessionID
            }
        })
        console.log(this.state.selectedID);
        const times = {
            _id:this.state.selectedID,
            times:  this.state.times
        }
        // const times = {
        //     _id:sessionId,
        //     times:  this.state.times
        // }
        console.log(times);
        axios.post("http://localhost:8000/session/pushTimes/",times)
            .then(res => console.log(res.data));

        alert('Time Allocated!');
        this.setState({
            selectedSession:"",
            day:"",
            times:[{day:"", time:""}],

        })

    }

    render() {
        return(

            <div>
                <form className="form-inline">

                    <h5 className='mt-3'>Session</h5> &nbsp;
                </form>


                <div className="room">

                    <form className="form-inline">

                        <select className="form-control w-50" id={this.state.selectedID}
                                value={this.state.selectedSession}
                                onChange={this.onChangeSession}>
                            <option selected style={{fontSize: '15px'}}>Choose Session...</option>
                            {this.state.sessions.map((sess,id) => {
                                return (
                                    <option value={sess.GeneratedSession} id={sess.GeneratedSessionID}>
                                        {sess.GeneratedSession}
                                    </option>
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
export default LecturerNA
