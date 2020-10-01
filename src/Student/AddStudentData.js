import React, { Component } from 'react';
import location from "../assets/css/location.css"
import stat from "../assets/css/stats.css";
import StudNav from "./studentNav.js";
import axios from 'axios';


export default class AddStudentData extends Component{

    constructor(props) {
        super(props);

        this.state={
            year :"",
            programme:"",
            groups:"",
            subgroup:"",
            groupId:"",
            Students:[],

        }
        this.onChangeYear = this.onChangeYear.bind(this);
        this.onChangeProgramme = this.onChangeProgramme.bind(this);
        this.onChangeGroups = this.onChangeGroups.bind(this);
        this.onChangeSubgroup = this.onChangeSubgroup.bind(this);
        this.onChangeGroupId = this.onChangeGroupId.bind(this);

        this.AddStudent = this.AddStudent.bind(this);

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
            groups: e.target.value
        })
    }
    onChangeSubgroup(e){
        this.setState({
            subgroup: e.target.value
        })
    }
    onChangeGroupId(e){
        this.setState({
            groupId: e.target.value
        })
    }

    // handleValidation(){
    //     let valid = true;
    //     if(this.state.tag !== '') {
    //         this.state.Tags.map(tag => {
    //             if (tag.tag === this.state.tag) {
    //                 valid = false;
    //                 alert("Tag already exists")
    //                 // this.setState({
    //                 //     tagVal: "This Tag already exists",
    //                 // })
    //
    //             }
    //         })
    //     }
    //     return valid;
    // }
    componentDidMount() {
        axios.get('http://localhost:8000/students/')
            .then(res => {
                this.setState({
                    Students: res.data,
                })
            });
    }

    AddStudent(e){
        const student = {
                year: this.state.year,
                programme: this.state.programme,
                groups: this.state.groups,
                subgroup: this.state.subgroup,
                groupId: this.state.year +"."+ this.state.programme +"."+ this.state.groups +"."+ this.state.subgroup,
                rooms:[],

            }
            console.log(this.state.student);
            axios.post("http://localhost:8000/students/add", student)
                .then(res => console.log(res.data))
                .catch(err => console.log(err))
                 alert('Item Added')

            this.setState({
                year: "",
                programme: "",
                groups: "",
                subgroup: "",
                groupId: ""

            })
             window.location = '/ViewStudent';
        //     alert("Tag added!")
        // // }
        // else{
        //     alert("Tag NOT added!")
        // }
    }

    render() {
        // const students = this.state.Tags;
        return (
            <div className="main">
                <StudNav/>
                <h3> Add Student Details</h3>
                <div className="form">
                    <form className=" " >
                        <div className="form-group mx-sm-3 mb-2">
                            <label style={{fontSize: '16px', color: "mediumslateblue"}} htmlFor="YearInputSelect">Offered Year</label><br/>
                            <select className="form-control " id="YearInputSelect"
                                    onChange={this.onChangeYear}
                                    required
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
                                    required
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
                                   value={this.state.groups}
                                   required
                            />
                        </div>
                        <div className="form-group mx-sm-3 mb-2">
                            <label htmlFor="CodeInput" style={{fontSize: '16px', color: "mediumslateblue"}}>Sub Group Number</label>
                            <input type="number" className="form-control" id="CodeInput" placeholder="Sub group number"
                                   onChange={this.onChangeSubgroup}
                                   value={this.state.subgroup}
                                   required
                            />
                        </div>
                        <button className="btn mb-2" style={{marginLeft: "40%",marginTop: "5%"}} onClick={this.AddStudent}>
                            Add Students
                        </button>
                    </form>


                </div>
            </div>
        );
    }
}



