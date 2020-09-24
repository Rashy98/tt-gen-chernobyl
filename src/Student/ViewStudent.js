import React, { Component } from 'react';
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css"
import common from "../assets/css/common.css"
import TagNav from "./studentNav";
import {Link} from 'react-router-dom';
import {Button, Container, Spinner, Table} from "react-bootstrap";
import axios from 'axios';
// import {connect} from "react-redux";


const Student = props => (

    <tr>
        <td>{props.student.year}</td>
        <td>{props.student.programme}</td>
        <td>{props.student.groups}</td>
        <td>{props.student.subgroup}</td>
        <td>{props.student.groupId}</td>

        <td>
            <button className="btn my-1" ><Link style={{color:"lavender"}}
               to={{pathname:"/UpdateGroup",studentid:{id:props.student._id}}}
            >Edit</Link></button>
            &nbsp;
            <button className="btn my-1">

                <a href="#" style={{color:"lavender"}}
                    onClick={() => {props.RemoveStudent(props.student._id)}}
                >
                    Delete</a></button>
        </td>
    </tr>
)


class ViewStudent extends Component {
    constructor(props) {
        super(props);

        this.RemoveStudent = this.RemoveStudent.bind(this);

        this.state = {
            students: [],
            loading: true,
        };

    }

    componentDidMount() {
        axios.get('http://localhost:8000/students/')
            .then(response => {
                this.setState({
                    students: response.data,
                    loading:false
                })
                console.log(response.data);

            })
            .catch((error) => {
                console.log(error);
            })


    }

    RemoveStudent(id) {
        axios.delete('http://localhost:8000/students/' + id)
            .then(res => console.log(res.data));

        this.setState({
            students: this.state.students.filter(rm => rm._id != id)
        })

    }

    StudentList() {
        return this.state.students.map(student => {
            return <Student student={student} RemoveStudent={this.RemoveStudent}
                        key={student._id}/>;
        })
    }

    render() {

        return (
            <div id="page-container" className='main'>
                <TagNav/>

                <Container>
                    <h3>View Student Details</h3><br/>
                    <Table responsive className='table-striped'>
                        <thead>
                        {this.state.loading ? <center><Spinner animation="border" /></center> :
                            <tr>
                                <th>Year and Semester</th>
                                <th>Programme</th>
                                <th>Group</th>
                                <th>Subgroup</th>
                                <th>Group ID</th>
                                <th>Action</th>

                            </tr>
                        }
                        </thead>
                        <tbody>
                        {this.StudentList()}
                        </tbody>
                    </Table>
                </Container>



            </div>
        );
    }
}
export default ViewStudent;
