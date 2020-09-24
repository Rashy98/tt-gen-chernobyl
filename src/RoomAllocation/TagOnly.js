import React,{Component} from "react";
import axios from "axios";
// import RoomAllocationMain from "./RoomAllocationMain";

class TagOnly extends Component{
    constructor(props) {
        super(props);

        this.state={
            rooms:[{room:""}],
            Newrooms:[],
            tags:[],
            roomData:[],
            selectedTag:"",
            roomsInDB:[],

        }

        this.handleRoomsNameChange = this.handleRoomsNameChange.bind(this);
        this.handleAddRooms = this.handleAddRooms.bind(this);
        this.handleRemoveRoom = this.handleRemoveRoom.bind(this);
        this.onChangeRooms = this.onChangeRooms.bind(this);
        this.onChangeTag = this.onChangeTag.bind(this);
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

        this.state.tags.map(tag =>{
            if(tag.tag === e.target.value){
                this.setState({
                    roomsInDB: tag.rooms
                })

            }
        })
    }

    componentDidMount() {
        axios.get('http://localhost:8000/tag/')
            .then(response => {
                this.setState({
                    tags: response.data,

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
                    valid = false;
                }
            })
        })

        return valid;
    }
    AddRoomAllocation(e) {
        e.preventDefault();


        this.Validation();
        if( this.Validation()){
            let tagId = this.state.tags.map(tag => {
                if (tag.tag === this.state.selectedTag) {
                    return tag._id
                }
            })
            const rooms = {
                _id: tagId,
                rooms: this.GetID()
            }
            console.log(rooms);
            axios.post("http://localhost:8000/tag/pushRooms/", rooms)
                .then(res => console.log(res.data));

            alert('Rooms Allocated!');
            this.setState({
                rooms: [{room: ""}],
                selectedTag: "",
            })
        }
        else
        {
            alert('Some or all rooms already added!');
        }
    }

    render() {
        return(
            <div>




                    {/*<RoomAllocationMain/>*/}

                <h5 className='mt-3'>Tag</h5>
                <label className="sr-only" htmlFor="inlineFormCustomSelectPref">Tag</label>
                <select className="form-control w-50" id="inlineFormCustomSelectPref" value={this.state.selectedTag}
                        onChange={this.onChangeTag}>
                    <option selected style={{fontSize: '15px'}}>Choose Tag...</option>
                    {this.state.tags.map(tag =>{
                        return(
                            <option value={tag.tag}>{tag.tag}</option>
                            )

                    })}

                </select>
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
                {this.state.rooms.map((roo, idx) => (

                    <div className="room">
                        {console.log(roo.room)}
                        <form className="form-inline">

                        <select className="form-control rooms w-25" id="room"
                                style={{width: "50%"}}
                                placeholder={`Room #${idx+1}`}
                                value={roo.room}
                                onChange={this.handleRoomsNameChange(idx)}
                        >
                            <option selected style={{fontSize: "15px"}}>Choose room...</option>
                            {this.state.roomData.map(room =>{
                                    return (
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
            // </div>
        );
    }

}
export default TagOnly
