import React, { Component } from 'react';
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css"
import common from "../assets/css/common.css"
import LocNav from "./locationNav";
import {Link} from 'react-router-dom';
import {Button, Container, Spinner, Table} from "react-bootstrap";
import axios from 'axios';
// import {connect} from "react-redux";


const Building = props => (

    <tr>
        <td>{props.building.building}</td>
        <td>
            <button className="btn my-1"  ><Link style={{color:"lavender"}}
                                                 onClick={()=>props.EditBuilding(props.building._id)}
            >Edit</Link></button>
            &nbsp;
            <button className="btn my-1">

                <a href="#" style={{color:"lavender"}}
                   onClick={() => {props.RemoveBuilding(props.building._id)}}
                >
                    Delete</a></button>
        </td>
    </tr>
)


class ViewBuildings extends Component {
    constructor(props) {
        super(props);

        this.RemoveBuilding = this.RemoveBuilding.bind(this);
        this.editableChange = this.editableChange.bind(this);
        this.UpdateBuilding = this.UpdateBuilding.bind(this);
        this.onChangeBuilding = this.onChangeBuilding.bind(this);

        this.state = {
            buildings: [],
            building:"",
            loading: true,
            Bid:"",
        };

    }

    onChangeBuilding(e){
        this.setState({
            building: e.target.value
        })
    }

    editableChange(id){
        this.state.buildings.map((b,index) =>{
            console.log(id,index)
            if(id === b._id){
                console.log(id)
                this.setState({
                    building: b.building,
                    Bid:b._id
                })
            }
        })
        console.log(this.state.building)
    }
    componentDidMount() {
        axios.get('http://localhost:8000/building/')
            .then(response => {
                this.setState({
                    buildings: response.data,
                    loading:false
                })
                console.log(response.data);

            })
            .catch((error) => {
                console.log(error);
            })


    }

    RemoveBuilding(id) {
        axios.delete('http://localhost:8000/building/' + id)
            .then(res => console.log(res.data));

        this.setState({
            buildings: this.state.buildings.filter(rm => rm._id != id)
        })

    }
    UpdateBuilding(e){
        e.preventDefault();
        // if(this.handleRoomValidation()) {
            const build = {
                building: this.state.building
            }
            axios.post("http://localhost:8000/building/update/" + this.state.Bid, build)
                .then(res => console.log(res.data));

            alert('Building Updated!');
            this.setState({
                building:''
            })
        window.location = '/ViewBuilding';
        // }
    }

    BuildingList() {
        return this.state.buildings.map(currentBuilding => {
            return <Building building={currentBuilding} EditBuilding={this.editableChange} RemoveBuilding={this.RemoveBuilding}
                         key={currentBuilding._id} />;
        })
    }

    render() {

        return (
            <div id="page-container" className='main'>
                <LocNav/>

                <Container>
                    <h3>View Building Details</h3>
                    <Table responsive className='table-striped bg-light'>
                        <thead>
                        {this.state.loading ? <center><Spinner animation="border" /></center> :
                            <tr>
                                <th>Building</th>
                                <th>Action</th>
                            </tr>
                        }
                        </thead>
                        <tbody>
                        {this.BuildingList()}
                        </tbody>
                    </Table>

                </Container>

                <div className='form'>
                    <h5>Update Building</h5>
                    <form className='form-inline'>
                    <input type='text' value={this.state.building} className='form-control' style={{width: '70%'}} onChange={this.onChangeBuilding}></input>
                    &nbsp;
                    <button className="btn my-1">
                        <Link style={{color: "lavender"}}
                              onClick={this.UpdateBuilding}>Update
                        </Link>
                    </button>
                    </form>
                </div>

            </div>
        );
    }
}
export default ViewBuildings;


