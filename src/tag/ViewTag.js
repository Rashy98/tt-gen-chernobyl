import React, { Component } from 'react';
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css"
import common from "../assets/css/common.css"
import TagNav from "./tagNav";
import {Link} from 'react-router-dom';
import {Button, Container, Spinner, Table} from "react-bootstrap";
import axios from 'axios';
// import {connect} from "react-redux";


const Tag = props => (
    <tr>
        <td>{props.tag.tag}</td>
        <td>
            <button className="btn my-1" ><Link style={{color:"lavender"}}
                to={{pathname:"/UpdateTag",tagid:{id:props.tag._id}}}
            >Edit</Link></button>
            &nbsp;
            <button className="btn my-1">

                <Link href="#" style={{color:"lavender"}}
                    onClick={()=>{props.RemoveTag(props.tag._id)}}
                >
                    Delete</Link></button>
        </td>
    </tr>
)


class ViewTag extends Component {
    constructor(props) {
        super(props);

        this.RemoveTag = this.RemoveTag.bind(this);

        this.state = {
            tags: [],
            loading: true,
        };

    }

    componentDidMount() {
        axios.get('http://localhost:8000/tag/')
            .then(response => {
                this.setState({
                    tags: response.data,
                    loading:false
                })
                console.log(response.data);

            })
            .catch((error) => {
                console.log(error);
            })


    }

    RemoveTag(id) {
        axios.delete('http://localhost:8000/tag/' + id)
            .then(res => console.log(res.data));

        this.setState({
            tags: this.state.tags.filter(rm => rm._id != id)
        })
    }

    TagList() {
        return this.state.tags.map(tag => {
            return <Tag tag={tag} RemoveTag={this.RemoveTag}
                        key={tag._id}/>;
        })
    }

    render() {

        return (
            <div id="page-container" className='main'>
                <TagNav/>

                <Container>
                    <h3>View Tag Details</h3>
                    <Table responsive style={{bgColor:"lavender"}}>
                        <thead className="thead-light">
                        {this.state.loading ? <center><Spinner animation="border" /></center> :
                            <tr>
                                <th>Tag</th>
                                <th>Action</th>
                            </tr>
                        }
                        </thead>
                        <tbody>
                        {this.TagList()}
                        </tbody>
                    </Table>
                </Container>



            </div>
        );
    }
}
export default ViewTag;
