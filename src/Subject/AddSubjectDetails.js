import React, {Component} from "react";
import SubNav from "./Common/SubNav";
import axios from 'axios';

export default class AddSubjectDetails extends Component{

    constructor(props) {
        super(props);

        this.onChangeOffYear = this.onChangeOffYear.bind(this);
        this.onChangeOffSem = this.onChangeOffSem.bind(this);
        this.onChangeSubject = this.onChangeSubject.bind(this);
        this.onChangeSubjectCode = this.onChangeSubjectCode.bind(this);
        this.onChangeLecHr = this.onChangeLecHr.bind(this);
        this.onChangeTutHr = this.onChangeTutHr.bind(this);
        this.onChangeLabHr = this.onChangeLabHr.bind(this);
        this.onChangeEveHr = this.onChangeEveHr.bind(this);
        this.AddSubject = this.AddSubject.bind(this);
        this.handleSubValidation = this.handleSubValidation.bind(this);

        this.state={
            offYear :"",
            offSem:"",
            subject:"",
            subjectCode:"",
            lecHr:"",
            tutHr:"",
            labHr:"",
            eveHr:"",
            Subs:[]
        }
    }
    componentDidMount() {
        axios.get('http://localhost:8000/subject/viewSub')
            .then(res => {
                this.setState({
                    Subject: res.data
                })
            });
    }

    onChangeOffYear(e) {
        this.setState({
            offYear: e.target.value
        })
    }
    onChangeOffSem(e) {
        this.setState({
            offSem: e.target.value
        })
    }
    onChangeSubject(e) {
        this.setState({
            subject: e.target.value
        })
    }
    onChangeSubjectCode(e) {
        this.setState({
            subjectCode: e.target.value
        })
    }
    onChangeLecHr(e) {
        this.setState({
            lecHr: e.target.value
        })
    }
    onChangeTutHr(e) {
        this.setState({
            tutHr: e.target.value
        })
    }
    onChangeLabHr(e) {
        this.setState({
            labHr: e.target.value
        })
    }
    onChangeEveHr(e) {
        this.setState({
            eveHr: e.target.value
        })
    }

    handleSubValidation(){
        let valid = true;
        if(this.state.subjectCode !== '') {
            this.state.Subs.map(sub => {
                if (sub.subjectCode === this.state.subjectCode) {
                    valid = false;
                    alert("Subject already exists")
                }
            })
        }
        return valid;
    }

    AddSubject(e){
        e.preventDefault();
        if(this.handleSubValidation()) {
            const subject = {
                offYear: this.state.offYear,
                offSem: this.state.offSem,
                subject: this.state.subject,
                subjectCode: this.state.subjectCode,
                lecHr: this.state.lecHr,
                tutHr: this.state.tutHr,
                labHr: this.state.labHr,
                eveHr: this.state.eveHr
            }
            axios.post("http://localhost:8000/subject/addSub", subject)
                .then(res => console.log(res.data));

            this.setState({
                offYear: "",
                offSem: "",
                subject: "",
                subjectCode: "",
                lecHr: "",
                tutHr: "",
                labHr: "",
                eveHr: "",
            })
            alert("Subject Details added!")
        }
        else{
            alert("Subject Details not added!")
        }
    }
    render() {
        return(
          <div className="main">
              <SubNav/>
              <h3> Add Subject Details </h3>
              {/*<div className="form">*/}
                  <form onSubmit={this.AddSubject}>
                      <div className="form-group mx-sm-3 mb-2">
                          <label
                              style={{fontSize: '16px', color: "mediumslateblue"}}
                              htmlFor="YearInputSelect">
                              Offered Year
                          </label>
                          <select
                              className="form-control "
                              id="YearInputSelect"
                              value={this.state.offYear}
                              onChange={this.onChangeOffYear}
                              required>
                              <option selected style={{fontSize:'15px'}}>Choose Year...</option>
                              <option value="1">1st Year</option>
                              <option value="2">2nd Year</option>
                              <option value="3">3rd Year</option>
                              <option value="4">4th Year</option>
                          </select>
                      </div>
                      <div className="form-group mx-sm-3 mb-2">
                          <label
                              style={{fontSize: '16px', color: "mediumslateblue"}}
                              htmlFor="SemInputSelect">
                              Offered Semester
                          </label>
                          <select
                              className="form-control "
                              id="SemInputSelect"
                              value={this.state.offSem}
                              onChange={this.onChangeOffSem}
                              required>
                              <option selected style={{fontSize:'15px'}}>Choose Semester...</option>
                              <option value="1">1st Semester</option>
                              <option value="2">2nd Semester</option>
                          </select>
                      </div>
                      <div className="form-group mx-sm-3 mb-2">
                          <label
                              htmlFor="NameInput"
                              style={{fontSize: '16px', color: "mediumslateblue"}}>
                              Subject Name
                          </label>
                          <input
                              type="text"
                              className="form-control"
                              id="NameInput"
                              placeholder="Subject Name"
                              value={this.state.subject}
                              onChange={this.onChangeSubject}
                              required/>
                      </div>
                      <div className="form-group mx-sm-3 mb-2">
                          <label
                              htmlFor="CodeInput"
                              style={{fontSize: '16px', color: "mediumslateblue"}}>
                              Subject Code
                          </label>
                          <input
                              type="text"
                              className="form-control"
                              id="CodeInput"
                              placeholder="Subject Code"
                              value={this.state.subjectCode}
                              onChange={this.onChangeSubjectCode}
                              required/>
                      </div>
                      <div className="form-group mx-sm-3 mb-2">
                          <label
                              htmlFor="lechoursInput"
                              style={{fontSize: '16px', color: "mediumslateblue"}}>
                              Number of lecture hours
                          </label>
                          <input
                              type="number"
                              className="form-control"
                              id="lechoursInput"
                              placeholder="Number of lecture hours"
                              value={this.state.lecHr}
                              onChange={this.onChangeLecHr}
                              required/>
                      </div>
                      <div className="form-group mx-sm-3 mb-2">
                          <label
                              htmlFor="tutehoursInput"
                              style={{fontSize: '16px', color: "mediumslateblue"}}>
                              Number of tutorial hours
                          </label>
                          <input
                              type="number"
                              className="form-control"
                              id="tutehoursInput"
                              placeholder="Number of tutorial hours"
                              value={this.state.tutHr}
                              onChange={this.onChangeTutHr}
                              required/>
                      </div>
                      <div className="form-group mx-sm-3 mb-2">
                          <label
                              htmlFor="LabhoursInput"
                              style={{fontSize: '16px', color: "mediumslateblue"}}>
                              Number of lab hours
                          </label>
                          <input
                              type="number"
                              className="form-control"
                              id="LabhoursInput"
                              placeholder="Number of lab hours"
                              value={this.state.labHr}
                              onChange={this.onChangeLabHr}
                              required/>
                      </div>
                      <div className="form-group mx-sm-3 mb-2">
                          <label
                              htmlFor="EvahoursInput"
                              style={{fontSize: '16px', color: "mediumslateblue"}}>
                              Number of evaluation hours
                          </label>
                          <input
                              type="number"
                              className="form-control"
                              id="EvahoursInput"
                              placeholder="Number of evaluation hours"
                              value={this.state.eveHr}
                              onChange={this.onChangeEveHr}
                              required/>
                      </div>
                      <div className="form-group mx-sm-3 mb-2">
                          <button type="submit"
                                  className="btn my-1"
                                  style={{backgroundColor: "#312450", color: "white", float: "right"}}>
                              Save Subject Details
                          </button>
                      </div>
                  </form>
              {/*</div>*/}
          </div>
        );
    }
}
