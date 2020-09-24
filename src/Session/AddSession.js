import React, {Component} from "react";
import SessionNav from "./SessionNav";
import axios from "axios";

export default class AddSession extends Component{

    constructor(props) {
        super(props);

        this.onChangeLecName = this.onChangeLecName.bind(this);
        this.handleLecNameChange = this.handleLecNameChange.bind(this);
        this.handleRemoveLecName = this.handleRemoveLecName.bind(this);
        this.onChangeSubName = this.onChangeSubName.bind(this);
        this.onChangeSubCode = this.onChangeSubCode.bind(this);
        this.onChangeTag = this.onChangeTag.bind(this);
        this.onChangeGroupOrSubGroupName = this.onChangeGroupOrSubGroupName.bind(this);
        this.onChangeNoOfStudents = this.onChangeNoOfStudents.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onRadioBtnValueChange = this.onRadioBtnValueChange.bind(this);
        this.CreateSession = this.CreateSession.bind(this);
        this.handleSessionValidation = this.handleSessionValidation.bind(this);

        this.state={

            LecName: [{ name: "" }],
            SubName: "",
            selectedSub: [],
            SubCode:"",
            selectedSubCode:[],
            Tag: "",
            selectedTag: [],
            GroupOrSubGroupName: "",
            selectedType: "Group",
            selectedGroupOrSubGroupName: [],
            NoOfStudents: "",
            Duration:"",
            Subjects:[],
            Lecturers:[],
            selSubCode:[],
            searchType:"Lecturer"

        }

    }

    componentDidMount() {
        axios.get('http://localhost:8000/session/viewSession')
            .then(res => {
                this.setState({
                    Session: res.data
                })
            });
        axios.get('http://localhost:8000/lecturer/viewLec')
            .then(res => {
                this.setState({
                    Lecturers: res.data
                })
            });
        axios.get('http://localhost:8000/subject/viewSub')
            .then(res => {
                this.setState({
                    selectedSub: res.data,
                    selectedSubCode:res.data

                })
            });
        axios.get('http://localhost:8000/tag/')
            .then(res => {
                this.setState({
                    selectedTag: res.data
                })
            });
        axios.get('http://localhost:8000/students/')
            .then(res => {
                this.setState({
                    selectedGroupOrSubGroupName: res.data
                })
            });
    }

    handleLecNameChange = idx => evt => {
        const newLecName = this.state.LecName.map((lecName, sidx) => {
            if (idx !== sidx)
                return lecName;
            return { ...lecName, name: evt.target.value };
        });

        this.setState({ LecName: newLecName });


    };

    onRadioBtnValueChange(e){
        this.setState({
            selectedType: e.target.value
        });

    }
    onChangeLecName = () => {
        this.setState({
            LecName: this.state.LecName.concat([{name: "" }])
        });
    };

    handleRemoveLecName = idx => () => {
        this.setState({
            LecName: this.state.LecName.filter((s, sidx) => idx !== sidx)
        });
    };

    onChangeSubName(e) {
        this.setState({
            SubName: e.target.value
        })
        this.setSubjectCode(e.target.value)
    }
    onChangeSubCode(e) {
        this.setState({
            SubCode: e.target.value
        })
    }
    onChangeTag(e) {
        this.setState({
            Tag: e.target.value
        })
    }
    onChangeGroupOrSubGroupName(e) {
        this.setState({
            GroupOrSubGroupName: e.target.value
        })

    }
    onChangeNoOfStudents(e) {
        this.setState({
            NoOfStudents: e.target.value
        })
    }
    onChangeDuration(e) {
        this.setState({
            Duration: e.target.value
        })
    }

    setSubjectCode(SubName){
        this.state.selectedSub.map(SCode => {
            if(SCode.subject === SubName){
                console.log(SCode.subjectCode);

                this.setState({
                    SubCode: SCode.subjectCode
                })
            }
        })
    }

    handleSessionValidation(){
        let valid = true;
        if(this.state.SubName !== '') {
            this.state.Subjects.map(sub => {
                if (sub.SubName === this.state.SubName) {
                    valid = false;
                    alert("Subject already exists")
                }
            })
        }
        return valid;
    }

    CreateSession = (e) =>{

        e.preventDefault()
        if(this.handleSessionValidation()) {
            const session = {
                LecName: this.state.LecName,
                SubName: this.state.SubName,
                SubCode: this.state.SubCode,
                Tag: this.state.Tag,
                GroupOrSubGroupName: this.state.GroupOrSubGroupName,
                NoOfStudents: this.state.NoOfStudents,
                Duration: this.state.Duration,
                UnAvailableTime: [],
                ConsecutiveSessionID: "",
                Rooms: []
            }

            let lecturerString = this.state.LecName[0].name;

            this.state.LecName.map((lect, index) => {
                if (index !== 0)
                    lecturerString = `${lecturerString},${lect.name}`
            });

            const stringSession = lecturerString + "\n" + session.SubName + "(" + session.SubCode + ")" + "\n" + session.Tag + "\n" + session.GroupOrSubGroupName + "\n" + session.NoOfStudents + "(" + session.Duration + ")";
            let id;
            axios.post("http://localhost:8000/session/addSession", session)
                .then(res => {
                    console.log(res.data.newSession._id.valueOf());
                    console.log(stringSession);
                        id=res.data.newSession._id.valueOf();

                    const generated = {
                        GeneratedSessionID:id,
                        GeneratedSession: stringSession
                    }

                    axios.post("http://localhost:8000/generatedSession/addGeneratedSession", generated)
                        .then(res => {
                            console.log(res.data);
                        })

                });

            console.log(id)

            this.setState({
                LecName: [],
                SubName: "",
                SubCode: "",
                Tag: "",
                GroupOrSubGroupName: "",
                building: "",
                NoOfStudents: "",
                Duration: "",

            })
            alert("Session created!")
            //const stringSession = lecturerString + "\n" + this.state.SubName + "(" + this.state.SubCode + ")" + "\n" + this.state.Tag + "\n" + this.state.GroupOrSubGroupName + "\n" + this.state.NoOfStudents + "(" + this.state.Duration + ")";
        }

        else{
            alert("Session not created!")
        }
    }
    render() {
        return (
            <div className="main">
                <SessionNav/><br/>
                <h3>Create Session</h3>
                <div className="form">
                    <form onSubmit={this.CreateSession}>
                        <div className="form-group mx-sm-3 mb-2">
                            <label
                                style={{fontSize: '16px', color: "mediumslateblue"}}
                                htmlFor="SubNameSelect">
                                Lecturer/Lecturer's Name {" "}

                                <button
                                    type="button"
                                    style={{width:"38px", height:"30px"}}
                                    onClick={this.onChangeLecName}
                                    className="btn btn-info btn-sm "
                                >
                                    <b> + </b>
                                </button>
                            </label>

                            {this.state.LecName.map((lec, idx) => (
                                <div>
                                    <select
                                        id="subject"
                                        style={{fontSize: '16px', color: "mediumslateblue", borderColor: "white",borderRadius: "3px", width:'91%'}}
                                        value={lec.name}
                                        onChange={this.handleLecNameChange(idx)}
                                        required>
                                        <option selected style={{fontSize: "15px", color: "black"}}>  Choose Name...</option>
                                        {
                                            this.state.Lecturers.map(Lec => {
                                                return (<option key={Lec}
                                                                value={Lec.fullName}>
                                                    {Lec.fullName}
                                                </option>);
                                            })
                                        }
                                    </select> <t/>
                                    <button
                                        type="button"
                                        style={{width:"38px", height:"30px"}}
                                        onClick={this.handleRemoveLecName(idx)}
                                        className="btn btn-success btn-sm"
                                    >
                                       <b> - </b>
                                    </button>

                                </div>
                                ))}
                        </div>
                        <div className="form-group mx-sm-3 mb-2">
                            <label
                                style={{fontSize: '16px', color: "mediumslateblue"}}
                                htmlFor="SubNameSelect">
                                Subject Name
                            </label>
                            <select
                                className="form-control "
                                id="subject"
                                value={this.state.SubName}
                                onChange={this.onChangeSubName}
                                required>
                                <option selected style={{fontSize: "15px;"}}>Choose Subject Name...</option>
                                {
                                    this.state.selectedSub.map(Sub => {
                                        return (<option
                                                        value={Sub.subject}>
                                            {Sub.subject}
                                        </option>);
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group mx-sm-3 mb-2">
                            <label
                                style={{fontSize: '16px', color: "mediumslateblue"}}
                                htmlFor="SubCodeSelect">
                                Subject Code
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="subjectCode"
                                placeholder="Subject Code"
                                value={this.state.SubCode}
                                onChange={this.onChangeSubCode}
                                required
                                disabled/>
                        </div>
                        <div className="form-group mx-sm-3 mb-2">
                            <label
                                style={{fontSize: '16px', color: "mediumslateblue"}}
                                htmlFor="TagSelect">
                                Tag
                            </label>
                            <select
                                className="form-control "
                                id="TagSelect"
                                value={this.state.Tag}
                                onChange={this.onChangeTag}
                                required>
                                <option selected style={{fontSize: "15px;"}}>Choose Tag...</option>
                                {
                                    this.state.selectedTag.map(TagName => {
                                        return (<option key={TagName}
                                                        value={TagName.tag}>
                                            {TagName.tag}
                                        </option>);
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group mx-sm-3 mb-2">
                            <label style={{fontSize: '16px', color: "mediumslateblue"}} htmlFor="GroupSelect">
                                <input
                                    type="radio"
                                    value="Group"
                                    checked={this.state.selectedType === "Group"}
                                    onChange={this.onRadioBtnValueChange}
                                />
                                 Group
                            </label> <t/>
                            <label style={{fontSize: '16px', color: "mediumslateblue"}} htmlFor="SubGroupSelect">
                                <input
                                    type="radio"
                                    value="Sub-Group"
                                    checked={this.state.selectedType === "Sub-Group"}
                                    onChange={this.onRadioBtnValueChange}
                                />
                                 Sub-Group
                            </label>
                            <select
                                className="form-control "
                                id="GroupSelect"
                                value={this.state.GroupOrSubGroupName}
                                onChange={this.onChangeGroupOrSubGroupName}
                                required>
                                <option selected style={{fontSize: "15px;"}}>Choose Group Name...</option>
                                {
                                    this.state.selectedGroupOrSubGroupName.map(GrpOrSubGrpName => {
                                        return (
                                            <option key={GrpOrSubGrpName} value={GrpOrSubGrpName.groupId}>
                                                {this.state.selectedType === "Group" ?
                                                GrpOrSubGrpName.groupId.length === 13 ?
                                                    GrpOrSubGrpName.groupId.substring(0, 11) :
                                                    GrpOrSubGrpName.groupId.substring(0, 10)
                                                    : (GrpOrSubGrpName.groupId)
                                                }

                                            </option>)
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group mx-sm-3 mb-2">
                            <label
                                htmlFor="NoOfStudentInput"
                                style={{fontSize: '16px', color: "mediumslateblue"}}>
                                Number of Students
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="NoOfStudentInput"
                                placeholder="Number of Students"
                                value={this.state.NoOfStudents}
                                onChange={this.onChangeNoOfStudents}
                                required/>
                        </div>
                        <div className="form-group mx-sm-3 mb-2">
                            <label
                                htmlFor="DurationInput"
                                style={{fontSize: '16px', color: "mediumslateblue"}}>
                                Duration
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="DurationInput"
                                placeholder="Duration"
                                value={this.state.Duration}
                                onChange={this.onChangeDuration}
                                required/>
                        </div>
                        <button className="btn mb-2" style={{marginLeft: "40%",marginTop: "5%"}} type= "submit">
                            Create Session
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}
