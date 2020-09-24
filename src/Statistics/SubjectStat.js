import React,{Component} from "react";
import {Bar,Pie} from 'react-chartjs-2';
import common from "./../assets/css/common.css";
import StatNav from "./StatNav";
import axios from "axios";



export default class SubjectStats extends Component{
    constructor(props) {
        super(props);

        this.handleType = this.handleType.bind(this);
        this.state={
            subjects:[],
            depData:[],
            subsPerYear:{},
            lecByLevel:{},
            lecByCenter:{},
            lecByDep:{},
            faculties:[],
            selectedRadio:"",
            loading:true
        }
    }

    handleType(e){
        this.setState({
            selectedRadio:e.target.value
        })

        this.SubjectcountPerEachFaculty(this.state.subjects,this.state.depData,e.target.value);

    }


    componentDidMount() {

        axios.get('http://localhost:8000/subject/')
            .then(response => {
                this.setState({
                    subjects: response.data,
                })
                const subjectSets = response.data;

                this.SubjectsPerYear(subjectSets);

            })

        axios.get('http://localhost:8000/department/')
            .then(response =>{
                let facultiees =[];
                response.data.map(facc=>{
                    facultiees.push(facc.faculty);
                })
                this.setState({
                    depData:response.data,
                    faculties:facultiees
                })

            })



    }


    //
    SubjectsPerYear(subData) {
        let Years = [];
        let subCounts =[];
        subData.forEach(element => {
            if (Years.indexOf(element.offYear) === -1) {
               Years.push(element.offYear);
            }
        });
        let subjectsPerYear= subData.reduce((countData, sub, index) => {
            if (!!countData[sub.offYear]) {
                countData[sub.offYear] += 1;
            } else {
                countData[sub.offYear] = 1;
            }
            return countData;
        }, {})
        subCounts = Object.keys(subjectsPerYear).map(sub =>{
            return subjectsPerYear[sub]
        })


        let yearsSorted = Years.sort((a, b) => a - b)



        this.setState({
            loading:false,
            subsPerYear : {
                labels: yearsSorted,
                datasets: [{
                    label:'Subject count',
                    data:subCounts
                    ,
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

    SubjectcountPerEachFaculty(subData,facultyData,facul) {

                    let faculties = [];
                    let programs =[];
                    let groupCounts =[];
                    let selectedPrograms =[];
                    facultyData.forEach(fac =>{
                    if (faculties.indexOf(fac.faculty) === -1) {
                    faculties.push(fac.faculty);
                }
                })
                subData.forEach(element => {
                    if (programs.indexOf(element.subjectCode.substring(0,2)) === -1) {
                        programs.push(element.subjectCode.substring(0,2));
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

                    console.log(programs);
                console.log(selectedPrograms);
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
                            label:'Subject count',
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
                <h3>Subject Statistics</h3>

                <div className="container mt-5">
                    <div className="row">
                        <div className="col statistics" >
                            <h3>Subject count per year</h3>
                            <Bar data={this.state.subsPerYear}
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
                            <h3>Subject count according to specialization</h3>

                            {this.state.faculties.map(lec =>{
                                return(
                                    <div className="form-check form-check-inline mx-sm-3 mb-2">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value={lec}
                                            // checked={this.state.selectedRadio === 'Lecture hall'}
                                               onChange={this.handleType}/>
                                        <label className="form-check-label" htmlFor="inlineRadio1"  style={{fontSize: "16px",color: "#312450"}}>{lec}</label>
                                    </div>
                                )

                            })
                            }


                            <Bar data={this.state.groupsPerFac}
                                 options={{
                                     scales: {
                                         yAxes: [{
                                             ticks: {
                                                 beginAtZero: true
                                             }
                                         }]
                                     }}}
                            />
                        </div>

                    </div>
                </div>

            </div>

        );
    }
}

