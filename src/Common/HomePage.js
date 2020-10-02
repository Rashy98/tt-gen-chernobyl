import React, {Component} from "react";
// import SubNav from "./Common/SubNav";
import axios from 'axios';
import Lecturer from "../assets/Images/lecture.png";
import Subject from "../assets/Images/subject.png";
import Working from "../assets/Images/workingDays.png";
import Student from "../assets/Images/student.png";
import Tags from "../assets/Images/labs.png";
import Session from "../assets/Images/session.png";
import TimeAll from "../assets/Images/time_all.png";
import Location from "../assets/Images/location.png";
import RoomAll from "../assets/Images/roomAll.png";
import Stats from "../assets/Images/stats.png";
import {Container,Row,Col,Button} from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import {Link} from "react-router-dom";
export default class HomePage extends Component{

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="main">
                <Container>
                    <Row style={{marginTop:'3.5em'}}>
                        <Col xs={6} md={3} >
                            <button style={{backgroundColor:'white',border:'none'}}>
                            <Image src={Lecturer} roundedCircle  style={{width:'8em'}}/>
                            <Link to={'/LecHome'}>Lecturer Details</Link>
                            </button>
                        </Col> <Col xs={6} md={3}>
                            <button style={{backgroundColor:'white',border:'none'}}>
                            <Image src={Subject} roundedCircle style={{width:'8em'}} />
                            <Link to={'/SubHome'}>Subjects</Link>
                            </button>
                        </Col>
                        <Col xs={6} md={3}>
                            <button style={{backgroundColor:'white',border:'none'}}>
                            <Image src={Working} roundedCircle style={{width:'8em'}}/>
                            <Link to={'/AddWeekdayWorkingDays'}>Working Days</Link>
                            </button>
                        </Col>
                        <Col xs={6} md={3}>
                            <button style={{backgroundColor:'white',border:'none'}}>
                                <Image src={Student} roundedCircle style={{width:'8em'}}/>
                                <Link to={'/AddStudent'}>Student Details</Link>
                            </button>
                        </Col>
                    </Row>
                    <Row className='mt-5'>
                        <Col xs={6} md={3}>
                            <button style={{backgroundColor:'white',border:'none'}}>
                                <Image src={Tags} roundedCircle style={{width:'8em'}}/>
                                <Link to={'/AddTag'}>Tags</Link>
                            </button>
                        </Col>
                        <Col xs={6} md={3}>
                            <button style={{backgroundColor:'white',border:'none'}}>
                                <Image src={Location} roundedCircle style={{width:'8em'}}/>
                                <Link to={'/AddLocation'}>Locations</Link>
                            </button>
                        </Col>
                        <Col xs={6} md={3}>
                            <button style={{backgroundColor:'white',border:'none'}}>
                                <Image src={Session} roundedCircle style={{width:'8em'}}/>
                                <Link to={'/AddSession'}>Sessions</Link>
                            </button>
                        </Col>
                        <Col xs={6} md={3}>
                            <button style={{backgroundColor:'white',border:'none'}}>
                                <Image src={TimeAll} roundedCircle style={{width:'8em'}}/>
                                <Link to={'/TimeAllocationMain'}>Time allocation</Link>
                            </button>
                        </Col>
                    </Row>
                    <Row className='mt-5'>
                        <Col xs={6} md={3}></Col>
                        <Col xs={6} md={3}>
                            <button style={{backgroundColor:'white',border:'none'}}>
                                <Image src={RoomAll} roundedCircle style={{width:'8em'}}/>
                                <Link to={'/RoomAlMain'}>Room allocation</Link>
                            </button>
                        </Col>

                        <Col xs={6} md={3}>
                            <button style={{backgroundColor:'white',border:'none'}}>
                                <Image src={Stats} roundedCircle style={{width:'8em'}}/>
                                <Link to={'/StuStats'}>Statistics</Link>
                            </button>
                        </Col>
                    </Row>


                </Container>
            </div>
        );
    }
}
