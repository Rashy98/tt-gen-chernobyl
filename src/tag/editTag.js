import React, { Component } from 'react';
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css";
import TagNav from "./tagNav";
import axios from 'axios';


export default class EditTag extends Component{

    constructor(props) {
        super(props);

        this.state={
            tag :"",
            Tags:[],
            tagid:"",
        }
        this.onChangeTag = this.onChangeTag.bind(this);
        this.UpdateTag = this.UpdateTag.bind(this);
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
        this.setState({
            tagid:this.props.location.tagid.id
        })
        axios.get('http://localhost:8000/tag/name', {params:{id:this.props.location.tagid.id}} )
            .then(response => {
                console.log(response)
                this.setState({
                    tag: response.data.tag,
                })

            })
            .catch(function (error) {
                console.log(error);
            })

    }


    UpdateTag(e){
        e.preventDefault();
        if(this.handleValidation()) {
            const tag = {
                tag: this.state.tag
            }
            console.log("Frontend "+ this.props.match.params.id)
            axios.post("http://localhost:8000/tag/update/"+this.state.tagid, tag)
                .then(res => console.log(res.data));

            alert('Tag Updated!');
            this.setState({
                tag: '',

            })
            window.location = '/ViewTag';
        }
        else
        {
            // alert('Room not Added!');
        }
    }

    render() {
        return (
            <div className="main">
                <TagNav/>
                <h3> Edit/Update Room details</h3>
                <div className="form">

                    <div className="form-group mx-sm-3 mb-2">
                        <label htmlFor="btagInput" className="sr-only">Tag</label>
                        <input type="text" className="form-control" id="tagInput" placeholder="Tag Name"
                               value={this.state.tag}
                               onChange={this.onChangeTag}/>
                        <br/>
                    </div>
                    <div className="form-group mx-sm-3 mb-2" style={{textAlign: "center"}}>
                        <button type="submit" className="btn my-1 " onClick={this.UpdateTag}>Update
                        </button>
                    </div>

                </div>
            </div>
        );
    }
}



