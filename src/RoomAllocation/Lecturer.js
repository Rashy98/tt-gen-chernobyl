import React,{Component} from "react";
import axios from "axios";
import RoomAllocationMain from "./RoomAllocationMain";

class LecturerRoomAll extends Component{
    constructor(props) {
        super(props);

        this.state={
            rooms:[{room:""}],
            Newrooms:[],
            lecturers:[],
            roomData:[],
            selectedLecturer:"",
            roomsInDB:[],
            valid: false,
            lecSel:"",
            roomVal:"",

        }

        this.handleRoomsNameChange = this.handleRoomsNameChange.bind(this);
        this.handleAddRooms = this.handleAddRooms.bind(this);
        this.handleRemoveRoom = this.handleRemoveRoom.bind(this);
        this.onChangeRooms = this.onChangeRooms.bind(this);
        this.onChangeLec = this.onChangeLec.bind(this);
        this.GetID = this.GetID.bind(this);
        this.AddRoomAllocation = this.AddRoomAllocation.bind(this);
    }

    handleRoomsNameChange = idx => evt => {
        const newRooms = this.state.rooms.map((Nroom, ridx) => {
            if (idx !== ridx)
                return Nroom;
            return { ...Nroom, room: evt.target.value };
        });

        const newr = this.state.Newrooms.map((Nroom, ridx) => {
            if (idx !== ridx)
                return Nroom;
            return { ...Nroom, room: evt.target.value };
        });

        this.setState({ rooms: newRooms });
        this.setState({
            Newrooms:newr
        })

        console.log(this.state.roomsInDB);
    };

    handleAddRooms = () => {
        this.setState({
            rooms: this.state.rooms.concat([{room:" " }])
        });
    };

    handleRemoveRoom = idx => () => {
        this.setState({
            rooms: this.state.rooms.filter((s, ridx) => idx !== ridx)
        });
    };

    onChangeRooms(e){
        this.setState({
            rooms: e.target.value
        })

    }
    onChangeLec(e){
        this.setState({
            selectedLecturer:e.target.value
        })

        this.state.lecturers.map(lec =>{
            if(lec.fullName === e.target.value){
                this.setState({
                    roomsInDB: lec.rooms
                })

            }
        })
    }


    componentDidMount() {
        axios.get('http://localhost:8000/lecturer/')
            .then(response => {
                this.setState({
                    lecturers: response.data,
                })
            })
        axios.get('http://localhost:8000/room/')
            .then(response => {
                this.setState({
                    roomData: response.data,
                })
            })

    }

    GetID(){
        let newRooms = [];
        this.state.rooms.map(room =>{
            newRooms.push(room.room);
        })

        return newRooms;

    }

    Validation(){
        let valid = true;

            this.state.roomsInDB.map(room =>{
                this.state.rooms.map(r =>{
                    if(room === r.room){
                        console.log(room,r);
                        this.setState({
                            roomVal : "**One,some or all rooms are already allocated to the lecturer"
                        })
                        valid = false;
                    }
                })
            })

        if(this.state.selectedLecturer === ""){
            this.setState({
                lecSel : "**Please select a tag"
            })
            valid = false;
        }
        else
        {
            this.setState({
                lecSel : ""
            })
        }

        return valid;
    }
    AddRoomAllocation(e) {
        e.preventDefault();

        // console.log(this.Validation());

        if(this.Validation()) {

            let lecId = this.state.lecturers.map(lec => {
                if (lec.fullName === this.state.selectedLecturer) {
                    return lec._id
                }
            })
            const rooms = {
                _id: lecId,
                rooms: this.GetID()
            }
            console.log(rooms);
            axios.post("http://localhost:8000/lecturer/pushRooms/", rooms)
                .then(res => console.log(res.data));

            alert('Rooms Allocated!');
            this.setState({
                rooms: [{room: ""}],
                selectedLecturer: "",
            })
        }
        else{
            alert('Room not allocated');
        }

    }

    render() {
        return(
            <div >

                <h5 className='mt-4'>Lecturer</h5>
                <label className="sr-only" htmlFor="inlineFormCustomSelectPref">Tag</label>
                <select className="form-control w-50" id="inlineFormCustomSelectPref" value={this.state.selectedLecturer}
                        onChange={this.onChangeLec}>
                    <option selected style={{fontSize: '15px'}}>Choose Lecturer...</option>
                    {this.state.lecturers.map(lecturer =>{
                        return(
                            <option value={lecturer.fullName}>{lecturer.fullName}</option>
                        )

                    })}

                </select>
                <p style={{color:"red",fontSize:'14px'}}>{this.state.lecSel}</p>

                <form className="form-inline">
                    <h5 className='mt-3'>Room</h5>
                    <button id="add_field_button" className="btn btn-success"
                            type='button'
                            style={{width: '30px',
                                height: '30px',
                                padding: '2px',
                                borderRadius: '15px',
                                textAlign: 'center',
                                fontSize: '15px',
                                // lineHeight: '1.42857',
                                marginLeft:'5px',
                            }}
                            onClick={this.handleAddRooms}
                    >+
                    </button>
                </form>
                <p style={{color:"red",fontSize:'14px'}}>{this.state.roomVal}</p>
                {this.state.rooms.map((room, idx) => (

                    <div className="room">

                        <form className="form-inline">

                            <select className="form-control rooms w-25" id="room"
                                    style={{width: "50%"}}
                                    placeholder={`Room #${idx+1}`}
                                    value={room.room}
                                    onChange={this.handleRoomsNameChange(idx)}
                            >
                                <option selected style={{fontSize: "15px"}}>Choose room...</option>
                                {this.state.roomData.map(room =>{
                                    return(
                                        <option value={room.room}>{room.room}</option>
                                    )
                                })}

                            </select>

                            &nbsp;
                            <button
                                type="button"
                                onClick={this.handleRemoveRoom(idx)}
                                className="btn btn-danger btn-sm"
                            >
                                X
                            </button>
                        </form>

                    </div>
                ))}

                <br/>
                <div className="form-group mx-sm-3 mb-2 text-center">
                    <button type="submit" className="btn my-1" onClick={this.AddRoomAllocation}>
                        Add Room Allocation
                    </button>
                </div>
            </div>
        );
    }

}
export default LecturerRoomAll;
