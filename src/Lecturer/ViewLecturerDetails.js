import React, {Component} from "react";
import LecNav from "./Common/LecNav";
import ViewLecturer from "../assets/css/location.css";
import stat from "../assets/css/stats.css"
import common from "../assets/css/common.css"
import {Container, Spinner, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import axios from "axios";

const Lecturer = props => (
    <tr>
        <td style={{fontSize: '15px'}}>{props.lecturer.empID}</td>
        <td style={{fontSize: '15px'}}>{props.lecturer.fullName}</td>
        <td style={{fontSize: '15px'}}>{props.lecturer.faculty}</td>
        <td style={{fontSize: '15px'}}>{props.lecturer.department}</td>
        <td style={{fontSize: '15px'}}>{props.lecturer.center}</td>
        <td style={{fontSize: '15px'}}>{props.lecturer.building}</td>
        <td style={{fontSize: '15px'}}>{props.lecturer.level}</td>
        <td style={{fontSize: '15px'}}>{props.lecturer.rank}</td>
        <td style={{fontSize: '15px'}}>
            <button className="btn my-1" >
                <Link style={{color:"lavender"}}
                      to={"/UpdateLec/"+props.lecturer._id}>
                    Edit
                </Link>
            </button>
            &nbsp;
            <button className="btn my-1">
                <Link href="#" style={{color:"lavender"}}
                   onClick={() => {props.RemoveLecturer(props.lecturer._id)}}>
                    Delete
                </Link>
            </button>
        </td>
    </tr>
)
class ViewLecturerDetails extends Component {

    constructor(props) {
        super(props);

        this.RemoveLecturer = this.RemoveLecturer.bind(this);

        this.state = {
            lecturerDetails: [],
            loading: true,
        };
    }

    componentDidMount() {
        axios.get('http://localhost:8000/lecturer/viewLec')
            .then(res => {
                this.setState({
                    lecturerDetails:res.data,
                    loading:false
                })
            });
    }

    RemoveLecturer(id) {
        axios.delete('http://localhost:8000/lecturer/' + id)
            .then(res => console.log(res.data));

        this.setState({
            lecturerDetails: this.state.lecturerDetails.filter(el => el._id != id)
        })
    }

    LecturerList() {
        return this.state.lecturerDetails.map(lecturer => {
            return <Lecturer lecturer={lecturer} RemoveLecturer={this.RemoveLecturer}
                            key={lecturer._id}/>;
        })
    }

    render() {
        return(
            <div id="page-container" className='main'>
                <LecNav/><br/>

                <Container>
                    {/*/!*<div className="form"*!/*/}
                    {/*     // style={{width:"60%"}}*/}
                    {/*/!*>*!/*/}
                        <h3> Lecturer Details </h3><br/>
                        <Table responsive>
                            <thead>
                            {this.state.loading ? <center><Spinner animation="border" /></center> :
                                <tr>
                                    <th style={{fontSize: '15px'}}>Employee ID</th>
                                    <th style={{fontSize: '15px'}}>Full Name</th>
                                    <th style={{fontSize: '15px'}}>Faculty</th>
                                    <th style={{fontSize: '15px'}}>Department</th>
                                    <th style={{fontSize: '15px'}}>Center</th>
                                    <th style={{fontSize: '15px'}}>Building</th>
                                    <th style={{fontSize: '15px'}}>Level</th>
                                    <th style={{fontSize: '15px'}}>Rank</th>
                                    <th style={{fontSize: '15px',width:'50%'}}>Edit Or Delete</th>
                                </tr>
                            }
                            </thead>
                            <tbody>
                            {this.LecturerList()}
                            </tbody>
                        </Table>
                    {/*</div>*/}
                </Container>
            </div>
        );
    }
}

export default ViewLecturerDetails;
