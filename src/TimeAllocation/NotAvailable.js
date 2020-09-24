import React, { Component } from 'react';
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css";
import TagNav from "./timeNav.js";
import axios from 'axios';


export default class NotAvailable extends Component{

    constructor(props) {
        super(props);

        this.state={
            tag :"",
            selectedTag:"",
            Tags:[],

        }
        this.onChangeTag = this.onChangeTag.bind(this);
        this.AddTag = this.AddTag.bind(this);

    }
    onChangeTag(e){
        this.setState({
            tag: e.target.value
        })
    }

    handleValidation(){
        let valid = true;
        if(this.state.tag !== '') {
            this.state.Tags.map(tag => {
                if (tag.tag === this.state.tag) {
                    valid = false;
                    alert("Tag already exists")
                    // this.setState({
                    //     tagVal: "This Tag already exists",
                    // })

                }
            })
        }
        return valid;
    }
    componentDidMount() {
        axios.get('http://localhost:8000/tag/')
            .then(res => {
                this.setState({
                    Tags: res.data,
                })
            });
    }

    AddTag(e){
        e.preventDefault();
        if(this.handleValidation()) {
            const tag = {
                tag: this.state.tag
            }
            console.log(this.state.tag);
            axios.post("http://localhost:8000/tag/add", tag)
                .then(res => console.log(res.data));

            this.setState({
                tag: ""
            })
            alert("Tag added!")
        }
        else{
            alert("Tag NOT added!")
        }
        window.location = '/ViewTag';
    }

    render() {
        const tags = this.state.Tags;
        return (
            <div className="main">
                <TagNav/>
                <h3> Unavailable Session Allocation</h3>
                <div className="form">
                    <form className="form-inline" >
                        <div className="form-group mx-sm-3 mb-2">
                            <label htmlFor="btagInput" className="sr-only">Tag</label>
                            <input type="text" className="form-control" id="tagInput" placeholder="Tag Name"
                                //    value={this.state.tag}
                                   onChange={this.onChangeTag}/>
                            <br/>
                            <p className='text-danger small'>{this.state.tagVal}</p>
                        </div>
                        <button className="btn mb-2" onClick={this.AddTag}>
                            Add Tag
                        </button>
                    </form>
                    <br/>
                    <br/>


                </div>
            </div>
        );
    }
}



