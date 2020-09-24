import React,{Component} from "react";
import axios from "axios";
import RoomAllocationMain from "./RoomAllocationMain";

class GroupAndSub extends Component{
    constructor(props) {
        super(props);

        this.state={
            rooms:[{room:""}],
            Newrooms:[],
            subjects:[],
            students:[],
            roomData:[],
            selectedRadio:"Group",
            selectedTag:"",
            selectedGrp:"",
            roomsInDB:[],

        }

        this.handleRoomsNameChange = this.handleRoomsNameChange.bind(this);
        this.handleAddRooms = this.handleAddRooms.bind(this);
        this.handleRemoveRoom = this.handleRemoveRoom.bind(this);
        this.onChangeRooms = this.onChangeRooms.bind(this);
        this.onChangeTag = this.onChangeTag.bind(this);
        this.onChangeGrp = this.onChangeGrp.bind(this);
        this.onChangeRadioButton = this.onChangeRadioButton.bind(this);
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
    onChangeTag(e){
        this.setState({
            selectedTag:e.target.value
        })
    }
    onChangeGrp(e){
        this.setState({
            selectedGrp:e.target.value
        })

        this.state.students.map(st =>{
            if(st.groupId === e.target.value || st.groupId.substring(0,11) === e.target.value || st.groupId.substring(0,10) === e.target.value){
                this.setState({
                    roomsInDB: st.rooms
                })

            }
        })
    }

    Validation(){
        let valid = true;

        this.state.roomsInDB.map(room =>{
            this.state.rooms.map(r =>{
                if(room === r.room){
                    console.log(room,r);
                    valid = false;
                }
            })
        })

        return valid;
    }

    componentDidMount() {
        axios.get('http://localhost:8000/students/')
            .then(response => {
                this.setState({
                    students: response.data,
                })
            })
        axios.get('http://localhost:8000/room/')
            .then(response => {
                this.setState({
                    roomData: response.data,
                })
            })
        // axios.get('/subject/')
        //     .then(response => {
        //         this.setState({
        //             subjects: response.data,
        //         })
        //     })
    }

    GetID(){
        let newRooms = [];
        this.state.rooms.map(room =>{
            newRooms.push(room.room);
        })

        return newRooms;

    }

    onChangeRadioButton(e){
        this.setState({
            selectedRadio:e.target.value
        })
    }

    AddRoomAllocation(e) {
        e.preventDefault();

        if(this.Validation()) {

            let stId = this.state.students.map(st => {
                if (st.groupId === this.state.selectedGrp || st.groupId.substring(0, 11) === this.state.selectedGrp || st.groupId.substring(0, 10) === this.state.selectedGrp) {
                    return st._id
                }
            })
            const rooms = {
                _id: stId,
                rooms: this.GetID()
            }
            console.log(rooms);
            axios.post("http://localhost:8000/students/pushRooms/", rooms)
                .then(res => console.log(res.data));

            alert('Rooms Allocated!');
            this.setState({
                rooms: [{room: ""}],
                selectedRadio: "Group",
                selectedTag: "",
                selectedGrp: ""
            })
        }
        else{
            alert('One,some or all rooms are already allocated to the Group');
        }

    }


    render() {
        return(
            <div >
                <h5 className="mt-3">Group or Subgroup</h5>

                <div className="form-check form-check-inline mx-sm-3 mb-2 mr-2">
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio" value="Group" onChange={this.onChangeRadioButton} checked={this.state.selectedRadio == 'Group'}/>
                    <label className="form-check-label" htmlFor="inlineRadio"  style={{fontSize: "16px",color:"mediumslateblue"}}>Group</label>
                    &nbsp;&nbsp;
                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio" value="Subgroup" onChange={this.onChangeRadioButton}/>
                    <label className="form-check-label" htmlFor="inlineRadio"  style={{fontSize: "16px",color: "mediumslateblue"}}>Subgroup</label>
                    &nbsp;&nbsp;
                </div>
                {this.state.selectedRadio === "Subgroup" ?
                    <div>
                    <h5 className='mt-3'>Subgroup</h5>
                    <label className="sr-only" htmlFor="inlineFormCustomSelectPref">Tag</label>
                    <select className="form-control w-50" id="inlineFormCustomSelectPref" value={this.state.selectedGrp}
                    onChange={this.onChangeGrp}>
                    <option selected style={{fontSize: '15px'}}>Choose Subgroup...</option>
                    {this.state.students.map(group =>{
                        return(
                            group.groupId.length == 13 ?
                                <option value={group.groupId}>{group.groupId}</option> :
                                <option value={group.groupId}>{group.groupId}</option>
                        )

                    })}

                    </select>
                    </div>
                    :
                    <div>
                    <h5 className='mt-4'>Group</h5>
                    <label className="sr-only" htmlFor="inlineFormCustomSelectPref">Tag</label>
                    <select className="form-control w-50" id="inlineFormCustomSelectPref" value={this.state.selectedGrp}
                    onChange={this.onChangeGrp}>
                    <option selected style={{fontSize: '15px'}}>Choose Group...</option>
                    {this.state.students.map(group =>{
                        return(
                            group.groupId.length == 13 ?
                                <option value={group.groupId.substring(0,11)}>{group.groupId.substring(0,11)}</option>:
                                <option value={group.groupId.substring(0,10)}>{group.groupId.substring(0,10)}</option>
                        )

                    })}

                    </select>
                    </div>
                }



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
export default GroupAndSub
