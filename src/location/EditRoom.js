import React, { Component } from 'react';
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css";
import LocNav from "./locationNav";
import axios from 'axios';


export default class EditLocationData extends Component{

    constructor(props) {
        super(props);

        this.state={
            building :"",
            selectedBuilding:"",
            room:"",
            capacity:0,
            selectedRadio:"",
            Buildings:[],
            buildingVal:"",
            rooms:[],


        }
        this.onChangeBuilding = this.onChangeBuilding.bind(this);
        this.onChangeRoomCapacity = this.onChangeRoomCapacity.bind(this);
        this.onChangeroomBuilding = this.onChangeroomBuilding.bind(this);
        this.handleType = this.handleType.bind(this);
        this.UpdateRoom = this.UpdateRoom.bind(this);
        this.onRoomChange = this.onRoomChange.bind(this);
    }
    onChangeBuilding(e){
        this.setState({
            building: e.target.value
        })
    }
    onChangeroomBuilding(e){
        this.setState({
            selectedBuilding: e.target.value
        })
    }
    onRoomChange(e){
        this.setState({
            room:e.target.value
        })
    }
    onChangeRoomCapacity(e){
        this.setState({
            capacity:e.target.valueAsNumber
        })
    }
    handleType(e){
        this.setState({
            selectedRadio:e.target.value
        })
    }

    handleRoomValidation(){
        let valid = true;
        if(this.state.room !== '') {
            this.state.rooms.map(room => {
                if (room.room === this.state.room) {
                    valid = false;
                    alert("Room already exists")
                }
            })
        }
        return valid;
    }
    componentDidMount() {
        axios.get('http://localhost:8000/room/' + this.props.match.params.id)
            .then(response => {
                this.setState({
                    selectedBuilding: response.data.building,
                    room: response.data.room,
                    capacity: response.data.capacity,
                    selectedRadio: response.data.type,
                })

            })
            .catch(function (error) {
                console.log(error);
            })
        axios.get('http://localhost:8000/building/')
            .then(res => {
                this.setState({
                    Buildings: res.data,
                })
            });
        // axios.get('/room/')
        //     .then(res => {
        //         this.setState({
        //             rooms: res.data,
        //         })
        //     });
    }


    UpdateRoom(e){
        e.preventDefault();
        if(this.handleRoomValidation()) {
            const room = {
                building: this.state.selectedBuilding,
                room: this.state.room,
                capacity: this.state.capacity,
                type: this.state.selectedRadio
            }
            axios.post("http://localhost:8000/room/update/"+this.props.match.params.id, room)
                .then(res => console.log(res.data));

            alert('Room Updated!');
            this.setState({
                selectedBuilding: '',
                room:'',
                capacity:0,
                type:''
            })
            window.location = '/ViewRoom';
        }
        else
        {
            // alert('Room not Added!');
        }
    }

    render() {
        return (
            <div className="main">
                <LocNav/>
                <h3> Edit/Update Room details</h3>
                <div className="form">

                        <div className="form-group mx-sm-3 mb-2">
                            <h5>Room</h5>
                            <label className="sr-only" htmlFor="inlineFormCustomSelectPref">Building</label>
                            <select className="form-control " id="inlineFormCustomSelectPref"
                                    value={this.state.selectedBuilding}
                                    onChange={this.onChangeroomBuilding}
                            >
                                <option selected style={{fontSize: "15px;"}}>Choose Building...</option>
                                {
                                    this.state.Buildings.map(building => {
                                        return (<option>{building.building}</option>);
                                    })
                                }

                            </select>
                        </div>

                        <div className="form-group mx-sm-3 mb-2">
                            <label htmlFor="roomInput" className="sr-only">Room</label>
                            <input type="text" className="form-control" id="roomInput" placeholder="Room"
                                   onChange={this.onRoomChange}
                                   value={this.state.room}/>
                        </div>
                        <div className="form-group mx-sm-3 mb-2 mt-0">
                            <label htmlFor="roomInput" style={{fontSize:'15px',color:'mediumslateblue'}}>Capacity</label>
                            <input type="number" className="form-control" id="capacityInput" placeholder="Capacity"
                                   onChange={this.onChangeRoomCapacity}
                                   value={this.state.capacity}/>
                        </div>

                        <div className="form-check form-check-inline mx-sm-3 mb-2">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Lecture hall"
                                   checked={this.state.selectedRadio === 'Lecture hall'}
                                   onChange={this.handleType}/>
                            <label className="form-check-label" htmlFor="inlineRadio1"  style={{fontSize: "16px",color: "#312450"}}>Lecture Hall</label>

                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Lab"
                                   checked={this.state.selectedRadio === 'Lab'}
                                   onChange={this.handleType}
                            />
                            <label className="form-check-label" htmlFor="inlineRadio2"
                                   style={{fontSize: "16px",color: "#312450"}}>Laboratory</label>

                        </div>
                        <div className="form-group mx-sm-3 mb-2" style={{textAlign: "center"}}>
                            <button type="submit" className="btn my-1 " onClick={this.UpdateRoom}>Update Room
                            </button>
                        </div>

                </div>
            </div>
        );
    }
}



