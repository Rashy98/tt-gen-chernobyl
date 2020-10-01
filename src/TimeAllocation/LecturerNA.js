import React,{Component} from "react";
import axios from "axios";
import stat from "../assets/css/roomAllo.css";
import TimeAllocationMain from "./TimeAllocationMain";

class LecturerNA extends Component{
    constructor(props) {
        super(props);

        this.state={
            rooms:[{room:""}],
            lecturer:"",
            times:[{day:"", intime:"", outtime:""}],
            Newrooms:[],
            lecturers:[],
            roomData:[],
            selectedTag:"",

        }

        this.handleLecturersNameChange = this.handleLecturersNameChange.bind(this);
        this.handleAddTime = this.handleAddTime.bind(this);
        this.handleRemoveTimes = this.handleRemoveTimes.bind(this);
        this.onChangeLecturers = this.onChangeLecturers.bind(this);
        // this.onChangeTag = this.onChangeTag.bind(this);
        // this.GetID = this.GetID.bind(this);
        this.AddTimeAllocation = this.AddTimeAllocation.bind(this);
    }
    handleLecturersNameChange(e) {
        this.setState({
            lecturer: e.target.value
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

    onChangeLecturers(e){
        this.setState({
            selectedlecturer: e.target.value
        })
    }
    // onChangeTag(e){
    //     this.setState({
    //         selectedTag:e.target.value
    //     })
    // }

    componentDidMount() {
        axios.get('http://localhost:8000/lecturer/')
            .then(response => {
                this.setState({
                    lecturers: response.data,
                })
            })
        // axios.get('/room/')
        //     .then(response => {
        //         this.setState({
        //             roomData: response.data,
        //         })
        //     })
    }

    GetID(){
        let newLecturers = [];
        this.state.lecturer.map(lecturer =>{
            newLecturers.push(lecturer.lecturer);
        })

        return newLecturers;

    }

    AddTimeAllocation(e) {
        e.preventDefault();


        let lecId =  this.state.lecturers.map(lecturers=>{
            if(lecturers.fullName === this.state.selectedlecturer){
                return lecturers._id
            }
        })
        const times = {
            _id:lecId,
            times:  this.state.times
        }
        console.log(times);
        axios.post("http://localhost:8000/lecturer/pushTimes/",times)
            .then(res => console.log(res.data));

        alert('Time Allocated!');
        this.setState({
            selectedlecturer:"",
            day:"",
            times:[{day:"", time:""}],

        })

    }

    render() {
        return(

            <div>
                <form className="form-inline">

                    <h5 className='mt-3'>Lecturer Name</h5> &nbsp;
                </form>


                <div className="room">
                <form onSubmit={this.AddTimeAllocation}>

                    <form className="form-inline">

                        <select className="form-control "
                                style={{width: "50%"}}
                                placeholder='Lecturer'
                                value={this.state.selectedlecturer}
                                onChange={this.onChangeLecturers}
                                required
                        >
                            <option selected style={{fontSize: "15px",width: "100%"}}>Choose Lecturer...</option>
                            {this.state.lecturers.map(lecturer =>{
                                return(
                                    <option value={lecturer.fullName}>{lecturer.fullName}</option>
                                )
                            })}

                        </select>
                    </form>

                    <form className='form-inline'>
                        <h5 className='mt-3'>Date </h5>
                        <h5 style={{marginLeft:'18%'}} className='mt-3'>Start Time</h5>
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
                    {this.state.times.map((time,idx) => (
                        <div className='custom-control-inline'>
                            {/*<form className='form-inline'>*/}
                                <select className="form-control rooms w-50" id="room"
                                        style={{width: "80%"}}
                                        placeholder={`Day`}
                                        value={time.day}
                                        onChange={this.handleDayChange(idx)}
                                        required
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
                                <input required className='form-control-sm ml-2' type='time' onChange={this.handleInTimeChange(idx)} value={time.intime}/>
                                &nbsp;
                                <input required className='form-control-sm ml-2' type='time' onChange={this.handleOutTimeChange(idx)} value={time.outtime}/>
                                &nbsp;
                                <button
                                    type="button"
                                    onClick={this.handleRemoveTimes(idx)}
                                    className="btn btn-danger btn-sm"
                                >
                                    X
                                </button>
                            {/*</form>*/}
                        </div>
                    ))}



                    <br/>
                    <div className="form-group mx-sm-3 mb-2 mt-5 text-center">
                        <button type="submit" className="btn my-1" >
                            Add Time Allocation
                        </button>
                    </div>
                </form>
                </div>
            </div>
        );
    }

}
export default LecturerNA
