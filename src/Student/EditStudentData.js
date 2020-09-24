import React, { Component } from 'react';
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css";
import StudNav from "./studentNav";
import axios from 'axios';


export default class EditStudentData extends Component{

    constructor(props) {
        super(props);

        this.state={
            year :"",
            programme:"",
            groups:"",
            subgroup:"",
            groupId:"",
            studentid:"",
            Students:[],

        }
        this.onChangeYear = this.onChangeYear.bind(this);
        this.onChangeProgramme = this.onChangeProgramme.bind(this);
        this.onChangeGroups = this.onChangeGroups.bind(this);
        this.onChangeSubgroup = this.onChangeSubgroup.bind(this);
        this.onChangeGroupId = this.onChangeGroupId.bind(this)
        this.UpdateStudent = this.UpdateStudent.bind(this);
    }
    onChangeYear(e){
        this.setState({
            year: e.target.value
        })
    }
    onChangeProgramme(e){
        this.setState({
            programme: e.target.value
        })
    }
    onChangeGroups(e){
        this.setState({
            groups:e.target.value
        })
    }
    onChangeSubgroup(e){
        this.setState({
            subgroup:e.target.value
        })
    }
    onChangeGroupId(e){
        this.setState({
            groupId:e.target.value
        })
    }

    // handleRoomValidation(){
    //     let valid = true;
    //     if(this.state.room !== '') {
    //         this.state.rooms.map(room => {
    //             if (room.room === this.state.room) {
    //                 valid = false;
    //                 alert("Room already exists")
    //             }
    //         })
    //     }
    //     return valid;
    // }
    componentDidMount() {
        this.setState({
            studentid:this.props.location.studentid.id
        })
        axios.get('http://localhost:8000/students/names',{params:{id:this.props.location.studentid.id}})
            .then(response => {
                this.setState({
                    year: response.data.year,
                    programme: response.data.programme,
                    groups: response.data.groups,
                    subgroup: response.data.subgroup,
                    groupId: response.data.groupId,

                })

            })
            .catch(function (error) {
                console.log(error);
            })

    }


    UpdateStudent(e){
        e.preventDefault();
        // if(this.handleRoomValidation()) {
            const student = {
                year: this.state.year,
                programme: this.state.programme,
                groups: this.state.groups,
                subgroup: this.state.subgroup,
                groupId: this.state.year +"." + this.state.programme +"."+ this.state.groups +"."+ this.state.subgroup
            }
        console.log("Frontend "+ this.props.match.params.id)
        axios.post("http://localhost:8000/students/update/"+this.state.studentid, student)
                .then(res => console.log(res.data));

            alert('Group Updated!');
            this.setState({
                year: '',
                programme:'',
                groups:'',
                subgroup:''
            })
            window.location = '/ViewStudent';
        // }
        // else
        // {
        //     // alert('Room not Added!');
        // }
    }

    render() {
        return (
            <div className="main">
                <StudNav/>
                <h3> Edit Student details</h3>
                <div className="form">

                    <div className="form-group mx-sm-3 mb-2">
                        <label style={{fontSize: '16px', color: "mediumslateblue"}} htmlFor="YearInputSelect">Offered Year</label><br/>
                        <select className="form-control " id="YearInputSelect"
                                onChange={this.onChangeYear}
                                value={this.state.year}

                        >
                            <option selected style={{fontSize:'15px'}}>Choose Year...</option>
                            <option value="Y1.S1">1st Year 1st Semester</option>
                            <option value="Y1.S2">1st Year 2nd Semester</option>
                            <option value="Y2.S1">2nd Year 1st Semester</option>
                            <option value="Y2.S2">2nd Year 2nd Semester</option>
                            <option value="Y3.S1">3rd Year 1st Semester</option>
                            <option value="Y3.S2">3rd Year 2nd Semester</option>
                            <option value="Y4.S1">4th Year 1st Semester</option>
                            <option value="Y4.S2">4th Year 2nd Semester</option>

                        </select>
                    </div>
                    <div className="form-group mx-sm-3 mb-2">
                        <label style={{fontSize: '16px', color: "mediumslateblue"}} htmlFor="ProgInputSelect">Programme</label>
                        <select className="form-control " id="ProgInputSelect"
                                onChange={this.onChangeProgramme}
                                value={this.state.programme}

                        >
                            <option selected style={{fontSize:'15px'}}>Choose Programme...</option>
                            <option value="IT">IT</option>
                            <option value="SE">SE</option>
                            <option value="CN">CN</option>
                            <option value="IM">IM</option>
                            <option value="DS">DS</option>
                            <option value="ISE">ISE</option>

                        </select>
                    </div>
                    <div className="form-group mx-sm-3 mb-2">
                        <label htmlFor="GrpInput" style={{fontSize: '16px', color: "mediumslateblue"}}>Group Number</label>
                        <input type="number" className="form-control" id="GrpInput" placeholder="Group Number"
                               onChange={this.onChangeGroups}
                               value={this.state.groups}/>
                    </div>
                    <div className="form-group mx-sm-3 mb-2">
                        <label htmlFor="CodeInput" style={{fontSize: '16px', color: "mediumslateblue"}}>Sub Group Number</label>
                        <input type="number" className="form-control" id="CodeInput" placeholder="Subject Code"
                               onChange={this.onChangeSubgroup}
                               value={this.state.subgroup}/>
                    </div>
                    <div className="form-group mx-sm-3 mb-2" style={{textAlign: "center"}}>
                        <button type="submit" className="btn my-1 " onClick={this.UpdateStudent}>Update
                        </button>
                    </div>

                </div>
            </div>
        );
    }
}



