import React, {Component} from "react";
import SubNav from "./Common/SubNav";
import {Container, Spinner, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import loc from "../assets/css/location.css"
import stat from "../assets/css/stats.css"
import common from "../assets/css/common.css"
import ViewLecturer from "../assets/css/location.css";
import axios from "axios";

const Subject = props => (
    <tr>
        <td style={{fontSize: '15px'}}>{props.subject.offYear}</td>
        <td style={{fontSize: '15px'}}>{props.subject.offSem}</td>
        <td style={{fontSize: '15px'}}>{props.subject.subject}</td>
        <td style={{fontSize: '15px'}}>{props.subject.subjectCode}</td>
        <td style={{fontSize: '15px'}}>{props.subject.lecHr}</td>
        <td style={{fontSize: '15px'}}>{props.subject.tutHr}</td>
        <td style={{fontSize: '15px'}}>{props.subject.labHr}</td>
        <td style={{fontSize: '15px'}}>{props.subject.eveHr}</td>
        <td style={{fontSize: '15px'}}>
            <button className="btn my-1" >
                <Link style={{color:"lavender"}}
                      to={"/UpdateSub/"+props.subject._id}>
                    Edit
                </Link>
            </button>
            &nbsp;
            <button className="btn my-1">
                <a href="#" style={{color:"lavender"}}
                    onClick={() => {props.RemoveSubject(props.subject._id)}}>
                    Delete
                </a>
            </button>
        </td>
    </tr>
)

class ViewSubjectDetails extends Component {

    constructor(props) {
        super(props);

        this.RemoveSubject = this.RemoveSubject.bind(this);

        this.state = {
            subjectDetails: [],
            loading: true,
        };
    }

    componentDidMount() {
        axios.get('http://localhost:8000/subject/viewSub')
            .then(res => {
                this.setState({
                    subjectDetails:res.data,
                    loading:false
                })
            });
    }

    RemoveSubject(id) {
        axios.delete('http://localhost:8000/subject/' + id)
            .then(res => console.log(res.data));

        this.setState({
            subjectDetails: this.state.subjectDetails.filter(el => el._id != id)
        })
    }

    SubjectList() {
        return this.state.subjectDetails.map(subject => {
            return <Subject subject={subject} RemoveSubject={this.RemoveSubject}
                             key={subject._id}/>;
        })
    }

    render() {
        return(
            <div id="page-container" className="main">

                <SubNav/><br/>
                <Container>
                        <h3> Subject Details </h3><br/>
                        <Table responsive className='table-striped'>
                            <thead>
                            {this.state.loading ? <center><Spinner animation="border" /></center> :
                                <tr>
                                    <th style={{fontSize: '15px'}}>Offered Year</th>
                                    <th style={{fontSize: '15px'}}>Offered Semester</th>
                                    <th style={{fontSize: '15px'}}>Subject Name</th>
                                    <th style={{fontSize: '15px'}}>Subject Code</th>
                                    <th style={{fontSize: '15px'}}>Lecture hours</th>
                                    <th style={{fontSize: '15px'}}>Tutorial hours</th>
                                    <th style={{fontSize: '15px'}}>Lab hours</th>
                                    <th style={{fontSize: '15px'}}>Evaluation hours</th>
                                    <th style={{fontSize: '15px'}}>Edit Or Delete</th>
                                </tr>
                            }
                            </thead>
                            <tbody>
                            {this.SubjectList()}
                            </tbody>
                        </Table>
                </Container>
            </div>
        );
    }
}
export default ViewSubjectDetails;

