import React, { Component } from 'react';
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css"
import LocNav from "./locationNav";
import {Link} from 'react-router-dom';
import {Button, Container, Spinner, Table} from "react-bootstrap";
import axios from 'axios';
// import {connect} from "react-redux";





class ViewBuilding extends Component {
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
            selectedB:"",
            editedB:"",
            Bid:"",
            editable: false
        };

    }

    onChangeBuilding(e){
        this.setState({
            building: e.target.value
        })
    }

    editableChange(id){

        this.state.buildings.map((b,index) =>{
            if(index === id){
                this.setState({
                    building: b.building,
                    Bid:index
                })
            }
        })
        console.log(this.state.editable)
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
            buildings: this.state.buildings.filter(el => el._id != id)
        })
    }

   UpdateBuilding(id) {
       // e.preventDefault();
       // if (this.handleRoomValidation()) {
           const build = {
               building: this.state.building,
           }
           axios.post("http://localhost:8000/building/update/" +id, build)
               .then(res => console.log(res.data));

           alert('Building Updated!');
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
           // window.location = '/ViewRoom';
       // }
   }

    render() {

            return (
                <div id="page-container" className='main'>
                    <LocNav/>

                    <Container >
                            <h3>View Location</h3>

                        <Table responsive className="table-striped">
                            <thead style={{backgroundColor:"#312450",color:'white'}}>
                            {this.state.loading ? <center><Spinner animation="border" /></center> :
                                <tr>
                                    <th>Building</th>
                                    <th>Action</th>
                                </tr>
                            }
                            </thead>

                            {this.state.buildings.map((build,index) => {
                                return(

                            <tbody>
                                <tr>
                                    <td>{build.building}</td>



                                        <td>
                                            <button className="btn my-1">
                                                <Link style={{color: "lavender"}}
                                                      onClick={()=>this.editableChange(index)}>
                                                    Edit
                                                </Link>
                                            </button>
                                            &nbsp;
                                            <button className="btn my-1">

                                                <a href="#" style={{color: "lavender"}}
                                                   onClick={() => {
                                                       this.RemoveBuilding(build._id)
                                                   }}
                                                >
                                                    Delete</a></button>

                                        </td>
                                </tr>
                            </tbody>
                                )})}
                        </Table>

                        <div className='form'>
                            <h6>Update Building</h6>
                            <input type='text' value={this.state.building} className='form-control-sm' onChange={this.onChangeBuilding}></input>
                            &nbsp;
                            <button className="btn my-1">
                                <Link style={{color: "lavender"}}
                                      onClick={()=>this.UpdateBuilding(this.state.Bid)}>Update
                                </Link>
                            </button>
                        </div>

                    </Container>



                </div>

            );
    }
}
export default ViewBuilding;
