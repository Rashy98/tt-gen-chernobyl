import React, {Component} from "react";
import LecNav from "./Common/LecNav";
import AddLecturerDetails from "./AddLecturerDetails";
import ViewLecturerDetails from "./ViewLecturerDetails";
import LecPic from "./Common/lec3.jpg";
import history from "./Common/history";
import Carousel from "react-bootstrap/Carousel";
import Img1 from "./Common/lec3.jpg";
import Img2 from "./Common/lec2.jpg";
import Img3 from "./Common/lec1.jpg";

export default class LecturerHomePage extends Component{

    render() {
        return (
            <div className="main" style={{width:'100%', alignContent:"center"}}>
                <div className="form" style={{marginLeft: '3%', width: '80%'}}>
                    <form>
                        <LecNav/>
                        <br/>
                        <h3> Lecturer Details </h3><br/>
                        <div>
                            <center>
                                <Carousel>
                                    <Carousel.Item>
                                        <img
                                            className="d-block w-100"
                                            style={{height:"40rem"}}
                                            src={Img1}
                                            alt="First slide"
                                        />
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img
                                            className="d-block w-100"
                                            style={{height:"40rem"}}
                                            src={Img2}
                                            alt="Third slide"
                                        />

                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <img
                                            className="d-block w-100"
                                            style={{height:"40rem"}}
                                            src={Img3}
                                            alt="Third slide"
                                        />

                                    </Carousel.Item>
                                </Carousel>
                            </center>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}