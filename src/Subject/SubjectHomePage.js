import React, {Component} from "react";
import SubNav from "./Common/SubNav";
import Carousel from "react-bootstrap/Carousel";
import Img1 from "./Common/book3.jpg";
import Img2 from "./Common/book2.jpg";
import Img3 from "./Common/book1.jpg";

export default class SubjectHomePage extends Component{

    render() {
        return(
            <div className="main">
                {/*<div className="form">*/}
                    <form>
                        <SubNav/><br/>
                        <h3> Subject Details </h3><br/>
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
                {/*</div>*/}
            </div>
        );
    }
}
