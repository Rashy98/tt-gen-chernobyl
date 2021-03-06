import React, { Component } from 'react';
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css";
import TagNav from "./tagNav.js";
import axios from 'axios';


export default class AddTagDetails extends Component{

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
                tag: this.state.tag,
                rooms:[]
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
        // window.location = '/ViewTag';
    }

    render() {
        const tags = this.state.Tags;
        return (
            <div className="main">
                <TagNav/>
                <h3> Add Tag Details</h3>
                <div className="form ">
                    <form className="form-inline ml-lg-5" onSubmit={this.AddTag}>
                        <div className="form-group mx-sm-3 mb-2" >
                            <label htmlFor="btagInput" className="sr-only ml-5">Tag</label>
                            <input type="text" className="form-control ml-5" id="tagInput" placeholder="Tag Name"
                                //    value={this.state.tag}
                                   style={{marginLeft:'80%'}}
                                   onChange={this.onChangeTag}
                                   required/>
                            <br/>
                            <p className='text-danger small'>{this.state.tagVal}</p>
                        </div>
                        <button className="btn mb-2" type='submit' >
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



