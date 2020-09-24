import React,{Component} from "react";
import axios from "axios";
import {Row,Col,Container} from 'react-bootstrap';
import mongoose from "mongoose"

import RoomAllocationMain from "./RoomAllocationMain";
import {any} from "prop-types";

class SessionRoomAll extends Component{
    constructor(props) {
        super(props);

        this.state={
            rooms:[{room:""}],
            valRooms :[],
            Newrooms:[],
            lecturers:[],
            sessions:[],
            roomData:[],
            selectedSession:"",
            selectedID:any,
            S_session:"",
            selectedDSession:"",
            genSessions:[],
            sessData:[],
            consSession :"",
            consectID:any,
            selectedSess:"",
            roomsInDB:[],





        }

        this.handleRoomsNameChange = this.handleRoomsNameChange.bind(this);
        this.handleAddRooms = this.handleAddRooms.bind(this);
        this.handleRemoveRoom = this.handleRemoveRoom.bind(this);
        this.onChangeRooms = this.onChangeRooms.bind(this);
        this.onChangeSession = this.onChangeSession.bind(this);
        this.onChangeLec = this.onChangeLec.bind(this);
        this.GetID = this.GetID.bind(this);
        this.AddRoomAllocation = this.AddRoomAllocation.bind(this);
        this.selectedID= this.selectedID.bind(this);
        this.setData = this.setData.bind(this);
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
    onChangeLec(e){
        this.setState({
            selectedTag:e.target.value
        })
    }
     onChangeSession (e){
        let index = e.target.selectedIndex;
        let el = e.target.childNodes[index]
        let selectedId=  el.getAttribute('id');


        this.state.sessData.map(session =>{
            if(session._id === selectedId){
                if(session.ConsecutiveSessionID  !==""){
                    this.state.sessData.map(consS =>{
                        if(consS._id === session.ConsecutiveSessionID){
                            this.state.sessions.map(gen =>{
                                if(gen.GeneratedSessionID === consS._id) {
                                    this.setData(gen.GeneratedSession,gen.GeneratedSessionID);
                                }

                            })
                            }

                            }

                            )

                        }
                else{
                    this.setState({
                        consSession:"",
                        consectID:any
                    })
                }
                    }
        })

        // console.log(this.state.actualID);

        this.setState({
            selectedSession:e.target.value,
            S_session:e.target.value,
            selectedID:selectedId
        })

         this.state.sessData.map(session =>{
             if(session._id === selectedId){
                 this.setState({
                     roomsInDB: session.Rooms,

                 })

             }
         })

        console.log(selectedId,e.target.value)
    }

    setData(a,b){

        // console.log('SetData : '+ a,b);
        console.log('Consession :'+a);
        console.log('conId :'+b);

        this.state.sessions.map(session =>{
            if(b === session.GeneratedSessionID){
                console.log(session.GeneratedSession);
                this.setState({
                    consSession:session.GeneratedSession,
                    consectID:session.GeneratedSessionID
                })
            }

        })
    }
    selectedID(id){
        this.setState(
            {
                selectedID : id
            }
        )
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
        axios.get('http://localhost:8000/generatedSession/viewGeneratedSession')
            .then(response => {
                this.setState({
                    sessions: response.data,


                })

            })
        axios.get('http://localhost:8000/session/viewSession')
            .then(response => {
               this.setState({ sessData:response.data})
                console.log(response.data);
            })


        console.log(this.state.sessions)
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

    AddRoomAllocation(e) {
        e.preventDefault();


       if(this.Validation()) {

           console.log(this.state.selectedID);
           const rooms = {
               _id: this.state.selectedID,
               rooms: this.GetID()
           }

           const conRooms = {
               _id: this.state.consectID,
               rooms: this.GetID()
           }
           console.log(rooms);

           axios.post("http://localhost:8000/session/pushRooms/", rooms)
               .then(res => console.log(res.data));
           axios.post("http://localhost:8000/session/pushRooms/", conRooms)
               .then(res => console.log(res.data));

           alert('Rooms Allocated!');
           this.setState({
               selectedSession: "",
               rooms: [{room: ""}],
               S_session: "",
               consSession: "",

           })
       }
       else{

               alert('One,some or all rooms are already allocated to the session/sessions');

       }

    }

    render() {
        return(
            <div >

                <h5 className='mt-4'>Session</h5>
                <label className="sr-only" htmlFor="inlineFormCustomSelectPref">Session</label>

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



                {console.log("Consecutive "+this.state.consSession)}
                {console.log("selected"+this.state.S_session)}
                <Container>
                    <Row>
                        <Col> <h5 className='mt-4'>Selected Session</h5> </Col>
                        <Col> <h5 className='mt-4'>Consecutive Session</h5> </Col>
                    </Row>
                    <Row>
                        <Col><p style={{fontSize:'18px'}}>{this.state.S_session.split('\n').map( (it, i) => <div key={'x'+i}>{it}</div>)}</p></Col>
                        <Col><p style={{fontSize:'18px'}}>{this.state.consSession.split('\n').map( (it, i) => <div key={'x'+i}>{it}</div>)}</p></Col>
                    </Row>
                </Container>



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
        );
    }

}
export default SessionRoomAll;
