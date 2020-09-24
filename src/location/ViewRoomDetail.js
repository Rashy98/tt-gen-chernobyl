import React, { Component } from 'react';
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css"
import common from "../assets/css/common.css"
import LocNav from "./locationNav";
import {Link} from 'react-router-dom';
import {Button, Container, Spinner, Table} from "react-bootstrap";
import axios from 'axios';
// import {connect} from "react-redux";


const Room = props => (

    <tr>
        <td>{props.room.building}</td>
        <td>{props.room.room}</td>
        <td>{props.room.capacity}</td>
        <td>{props.room.type}</td>
        <td>
            <button className="btn my-1" ><Link style={{color:"lavender"}}
                to={"/UpdateRoom/"+props.room._id}
            >Edit</Link></button>
            &nbsp;
            <button className="btn my-1">

                <a href="#" style={{color:"lavender"}}
                   onClick={() => {props.RemoveRoom(props.room._id)}}
                >
                    Delete</a></button>
        </td>
    </tr>
)


class ViewRoomDetail extends Component {
    constructor(props) {
        super(props);

        this.RemoveRoom = this.RemoveRoom.bind(this);

        this.state = {
            rooms: [],
            loading: true,
        };

    }

    componentDidMount() {
        axios.get('http://localhost:8000/room/')
            .then(response => {
                this.setState({
                    rooms: response.data,
                    loading:false
                })
                console.log(response.data);

            })
            .catch((error) => {
                console.log(error);
            })


    }

    RemoveRoom(id) {
        axios.delete('http://localhost:8000/room/' + id)
            .then(res => console.log(res.data));

        this.setState({
            rooms: this.state.rooms.filter(rm => rm._id != id)
        })

    }

    RoomList() {
        return this.state.rooms.map(currentRoom => {
            return <Room room={currentRoom} RemoveRoom={this.RemoveRoom}
                             key={currentRoom._id}/>;
        })
    }

    render() {

        return (
            <div id="page-container" className='main'>
                <LocNav/>

                <Container>
                    <h3>View Room Details</h3>
                    <Table responsive className='table-striped bg-light'>
                        <thead>
                        {this.state.loading ? <center><Spinner animation="border" /></center> :
                            <tr>
                                <th>Building</th>
                                <th>Room</th>
                                <th>Capacity</th>
                                <th>Type</th>
                                <th>Action</th>
                            </tr>
                        }
                        </thead>
                        <tbody>
                        {this.RoomList()}
                        </tbody>
                    </Table>
                </Container>



            </div>
        );
    }
}
export default ViewRoomDetail;


