import React,{Component} from "react";
import {Bar,Pie} from 'react-chartjs-2';
import common from "./../assets/css/common.css";
import StatNav from "./StatNav";
import axios from "axios";



export default class StudentStats extends Component{
    constructor(props) {
        super(props);

        this.handleType = this.handleType.bind(this);
        this.handleFacType = this.handleFacType.bind(this);
        this.state={
            students:[],
            facultyData:[],
            faculty:[],
           groupsPerYear:{},
            groupsPerSem:{},
            groupsPerSpe:{},
            groupsPerFac:{},
            lecByDep:{},
            years:[],
            selectedRadio:'Y1',
            selectedFac:'Computing',
            selected:'',
            loading:true
        }
    }

    handleType(e){
        this.setState({
            selectedRadio:e.target.value,
            selected:e.target.value
        })

        this.SubGroupCountYearAndSpecialization(this.state.students,e.target.value);



    }
    handleFacType(e){
        this.setState({
            selectedFac:e.target.value
        })
        this.StudentGroupPerEachFaculty(this.state.students,this.state.facultyData,e.target.value);
    }
    componentDidMount() {


        axios.get('http://localhost:8000/students/')
            .then(response => {
                this.setState({
                    students: response.data,
                })
                const studentSet = response.data;
                this.GroupCountPerYear(studentSet);
                this.GroupCountPerSemester(studentSet);
                this.SubGroupCountYearAndSpecialization(studentSet,this.state.selectedRadio);
                this.StudentGroupPerEachFaculty(this.state.students,this.state.facultyData,this.state.selectedFac);
            })

        axios.get('http://localhost:8000/department/')
            .then(response => {
                let facultiees =[];
                response.data.map(facc=>{
                    facultiees.push(facc.faculty);
                })
                this.setState({
                    facultyData: response.data,
                    faculty:facultiees
                })
                console.log(this.state.facultyData)
            })

    }

    GroupCountPerYear(stuData) {
        // axios.get('/lecturer/')
        //     .then(response => {

        // const lecData = response.data;
        let Years = [];
        let groupCounts =[];
        stuData.forEach(element => {
            let year = element.year.substring(0,2);
            if (Years.indexOf(year) === -1) {
                Years.push(year);
            }
        });
        let GroupPerYear= stuData.reduce((countData, grp, index) => {
            let year = grp.year.substring(0,2);
            if (!!countData[year]) {
                countData[year] += 1;
            } else {
                countData[year] = 1;
            }
            return countData;
        }, {})
        groupCounts = Object.keys(GroupPerYear).map(grp =>{
            return GroupPerYear[grp]
        })

        this.setState({
            // faculties:faculties,
            loading:false,
            years:Years,
            groupsPerYear : {
                labels: Years,
                datasets: [{
                    data:groupCounts,
                    label:'Group count',
                    backgroundColor: [
                        '#bc5090',
                        '#ef5675',
                        '#ff764a',
                        '#ffa600',
                        '#003f5c',
                        '#7a5195'
                    ],
                    hoverBackgroundColor: [
                        '#bc5090',
                        '#ef5675',
                        '#ff764a',
                        '#ffa600',
                        '#003f5c',
                        '#7a5195'
                    ]
                }]
            }
        })


    }
    GroupCountPerSemester(stuData) {
        // axios.get('/lecturer/')
        //     .then(response => {

        // const lecData = response.data;
        let YearsASem = [];
        let groupCounts =[];
        stuData.forEach(element => {
            let year = element.year;
            if (YearsASem.indexOf(year) === -1) {
                YearsASem.push(year);
            }
        });
        let GroupPerSemester= stuData.reduce((countData, grp, index) => {
            let year = grp.year;
            if (!!countData[year]) {
                countData[year] += 1;
            } else {
                countData[year] = 1;
            }
            return countData;
        }, {})
        groupCounts = Object.keys(GroupPerSemester).map(grp =>{
            return GroupPerSemester[grp]
        })

        this.setState({
            // faculties:faculties,
            loading:false,
            groupsPerSem : {
                labels: YearsASem,
                datasets: [{
                    data:groupCounts,
                    label:'Group count',
                    backgroundColor: [
                        '#bc5090',
                        '#ef5675',
                        '#ff764a',
                        '#ffa600',
                        '#003f5c',
                        '#7a5195'
                    ],
                    hoverBackgroundColor: [
                        '#bc5090',
                        '#ef5675',
                        '#ff764a',
                        '#ffa600',
                        '#003f5c',
                        '#7a5195'
                    ]
                }]
            }
        })
    }

    SubGroupCountYearAndSpecialization(stuData,Year) {

        let Specializations = [];
        let groupCounts =[];
        stuData.forEach(element => {
            let year = element.year.substring(0,2);
            if(year === Year){
                if (Specializations.indexOf(element.programme) === -1) {
                   Specializations.push(element.programme);
                }
            }

        });
        let GroupPerSpecialization= stuData.reduce((countData, grp, index) => {
            let year = grp.year.substring(0,2);
            if(year=== Year) {
                if (!!countData[grp.programme]) {
                    countData[grp.programme] += 1;
                } else {
                    countData[grp.programme] = 1;
                }
                return countData;
            }
            else{
                return countData;
            }
        }, {})
        groupCounts = Object.keys(GroupPerSpecialization).map(grp =>{
            return GroupPerSpecialization[grp]
        })


        this.setState({
            // faculties:faculties,
            loading:false,
            groupsPerSpe : {
                labels: Specializations,
                datasets: [{
                    data:groupCounts,
                    label:'Group count',
                    backgroundColor: [
                        '#bc5090',
                        '#ef5675',
                        '#ff764a',
                        '#ffa600',
                        '#003f5c',
                        '#7a5195'
                    ],
                    hoverBackgroundColor: [
                        '#bc5090',
                        '#ef5675',
                        '#ff764a',
                        '#ffa600',
                        '#003f5c',
                        '#7a5195'
                    ]
                }]
            }
        })


    }
    StudentGroupPerEachFaculty(stuData,facultyData,facul) {

        let faculties = [];
        let programs =[];
        let groupCounts =[];
        let selectedPrograms =[];
        facultyData.forEach(fac =>{
            if (faculties.indexOf(fac.faculty) === -1) {
               faculties.push(fac.faculty);
            }
        })
        stuData.forEach(element => {
                if (programs.indexOf(element.programme) === -1) {
                    programs.push(element.programme);
                }
        });

        // console.log(facultyData[0].Programmes[0]);
        facultyData.forEach(fac => {
            if(fac.faculty === facul){
            programs.forEach(prog => {
                let length = fac.Programmes.length;
                        for(let i = 0 ; i <length;i++){
                            if(fac.Programmes[i] === prog){
                                selectedPrograms.push(prog);
                            }
                        }
            })
        }})

        let GroupPerFaculty= selectedPrograms.reduce((countData, grp, index) => {
                if (!!countData[grp]) {
                    countData[grp] += 1;
                } else {
                    countData[grp] = 1;
                }
                return countData;
        }, {})

        groupCounts = Object.keys(GroupPerFaculty).map(grp =>{
            return GroupPerFaculty[grp]
        })


        this.setState({
            // faculties:faculties,
            loading:false,
            faculty:faculties,
            groupsPerFac : {
                labels: selectedPrograms,
                datasets: [{
                    data:groupCounts,
                    label:'Group count',
                    backgroundColor: [
                        '#bc5090',
                        '#ef5675',
                        '#ff764a',
                        '#ffa600',
                        '#003f5c',
                        '#7a5195'
                    ],
                    hoverBackgroundColor: [
                        '#bc5090',
                        '#ef5675',
                        '#ff764a',
                        '#ffa600',
                        '#003f5c',
                        '#7a5195'
                    ]
                }]
            }
        })


    }




    render() {
        return (
            <div className="main">
                <StatNav/>
                <h3>Student Statistics</h3>

                <div className="container" >
                    <div className="row">
                        <div className="col statistics">
                            <h3>Group count for each year</h3>
                            <Bar data={this.state.groupsPerYear}
                                 options={{
                                     scales: {
                                         yAxes: [{
                                             ticks: {
                                                 beginAtZero: true
                                             }
                                         }]
                                     }
                                 }}/>
                        </div>
                        <div className="col ml-3 statistics">
                            <h3>Groups per semester</h3>
                            <Pie data={this.state.groupsPerSem} />
                        </div>
                    </div>
                    <br /> <br/>
                        <div className="row">
                        <div className="col statistics">
                            <h3>Groups per year according to specialization</h3>
                            {this.state.years.map((y,index) =>{
                                return(
                                    <div className="form-check form-check-inline mx-sm-3 mb-2">

                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value={y}
                                            // checked={this.state.selectedRadio === 'Lecture hall'}
                                               defaultChecked={index === 0}
                                               onChange={this.handleType}/>
                                        <label className="form-check-label" htmlFor="inlineRadio1"  style={{fontSize: "16px",color: "#312450"}}>{y}</label>
                                    </div>
                                )

                            })
                            }
                            <Pie data={this.state.groupsPerSpe} />
                        </div>
                            <div className="col ml-3 statistics">
                                <h3>Groups in each faculty according to the specialization</h3>
                                {this.state.faculty.map((x,index) =>{
                                    return(
                                        <div className="form-check form-check-inline mx-sm-3 mb-2">

                                            <input className="form-check-input" type="radio" name="inlineRadioOptions2" id="inlineRadio2" value={x}
                                                // checked={this.state.selectedFac === y}
                                                   defaultChecked={index === 0}
                                                   onChange={this.handleFacType}/>
                                            <label className="form-check-label" htmlFor="inlineRadio2"  style={{fontSize: "16px",color: "#312450"}}>{x}</label>
                                        </div>
                                    )

                                })
                                }
                                <Pie data={this.state.groupsPerFac} />
                            </div>
                        </div>


                </div>

            </div>

        );
    }
}

