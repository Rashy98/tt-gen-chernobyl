import React,{Component} from "react";
// import workingDays from "../assets/css/workingdays.css";
import axios from "axios";
// import location from "../assets/css/location.css"
// import stat from "../assets/css/stats.css";
// import {useTable} from "react-table";

// const data = axios.get('http://localhost:8000/table/getTable');
//
// const columns = [
//     {
//         Header : "Monday",
//         accessor : "subject"
//     },
//     {
//         Header : "Tuesday",
//         accessor : "subject"
//     },
//     {
//         Header : "Wednesday",
//         accessor : "subject"
//     }
// ]
//
// const Table = ({columns, data}) => {
//
//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         rows,
//         prepareRow
//     }  = useTable({
//         columns,
//         data
//     });
//
//     return (
//         <table {...getTableProps()}>
//             <thead>
//             {headerGroups.map(headerGroup => (
//                 <tr {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map(column => (
//                         <th {...column.getHeaderProps()}>{column.render("Header")}</th>
//                     ))}
//                 </tr>
//             ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//             {rows.map((row, i) => {
//                 prepareRow(row);
//                 return (
//                     <tr {...row.getRowProps()}>
//                         {row.cells.map(cell => {
//                             return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
//                         })}
//                     </tr>
//                 );
//             })}
//             </tbody>
//         </table>
//     );
// }
//
// export default function App() {
//     return (
//         <div className="App">
//             <Table columns={columns} data={data} />
//         </div>
//     );
// }

export default class TimeTable extends Component{

    constructor(props) {
        super(props);

        this.state = {
            weekdayWorkingDuration : 0,
            weekendWorkingDuration : 0,
            weekdayWorkingTimeSlot : '',
            weekendWorkingTimeSlot : '',
            noOfRows : 0,
            sessionTable : [],
            table : [],
            groups : [],
            rooms : [],
            category : 'Student',
            selectedGroup : '',
            selectedLecturer : '',
            selectedRoom : ''
        }

        this.onChangeDrop = this.onChangeDrop.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.createRow = this.createRow.bind(this);
        this.sortByDay = this.sortByDay.bind(this);
    }

    async componentDidMount() {

        this.setState({
            table : []
        })

        let workingDays;
        let weekday;
        let weekend;
        let weekdayTimeSlots;
        let weekendTimeSlots;
        let sessionTable = [];

        workingDays = await axios.get('http://localhost:8000/table/getWorkingDays');

        for (let workingDay of workingDays.data.workingDays){

            if (workingDay.dayType.toUpperCase() === "Weekend".toUpperCase()){
                let timeSlot = workingDay.workingTimeSlot;
                let workingHours = workingDay.workingHours.hours + "." + workingDay.workingHours.minutes;

                if (timeSlot.toUpperCase() === "One Hour".toUpperCase()){
                    weekend = parseInt(workingHours) + 1;
                    weekendTimeSlots = "One Hour";
                } else {
                    weekend = (parseInt(workingHours) + 1) * 2;
                    weekendTimeSlots = "Thirty Minutes";
                }
            } else {
                let timeSlot = workingDay.workingTimeSlot;
                let workingHours = workingDay.workingHours.hours + "." + workingDay.workingHours.minutes;

                if (timeSlot.toUpperCase() === "One Hour".toUpperCase()){
                    weekday = parseInt(workingHours) + 1;
                    weekdayTimeSlots = "One Hour";
                } else {
                    weekday = (parseInt(workingHours) + 1) * 2;
                    weekdayTimeSlots = "Thirty Minutes";
                }
            }
        }

        await this.setState({
            weekdayTimeSlots : weekdayTimeSlots,
            weekendTimeSlots : weekendTimeSlots,
            noOfRows : weekend
        })

        let response = await axios.get('http://localhost:8000/table/getTable');

        if (response.data.success){
             await this.setState({
                 sessionTable : response.data.table
             })
        } else {
            alert('response failed')
        }

        let groups = await axios.get('http://localhost:8000/table/getGroups');

        if(groups.data.success){
            let arr_groups = [];

            for (let group of groups.data.groups){
                arr_groups.push(group._id.GroupOrSubGroupName)
            }

            this.setState({
                groups : arr_groups
            })
        } else {
            alert('groups failed')
        }
    }

    // async componentDidUpdate(prevProps, prevState, snapshot) {
    //
    //     if (prevState.category !== this.state.category){
    //         if (this.state.category === 'Student'){
    //             let groups = await axios.get('http://localhost:8000/table/getGroups');
    //
    //             if(groups.data.success){
    //                 let arr_groups = [];
    //
    //                 for (let group of groups.data.groups){
    //                     arr_groups.push(group._id.GroupOrSubGroupName)
    //                 }
    //
    //                 this.setState({
    //                     groups : arr_groups
    //                 })
    //             } else {
    //                 console.log('groups failed')
    //             }
    //         } else if (this.state.category === 'Lecturer'){
    //             let lecturers = await axios.get('http://localhost:8000/table/getLecturers');
    //
    //             if(lecturers.data.success){
    //
    //                 let arr_lecturers = [];
    //
    //                 for (let lecturer of lecturers.data.lecturers){
    //                     arr_lecturers.push(lecturer.fullName)
    //                 }
    //
    //                 this.setState({
    //                     groups : arr_lecturers
    //                 })
    //             } else {
    //                 console.log('groups failed')
    //             }
    //         } else if (this.state.category === 'Room'){
    //             let rooms = await axios.get('http://localhost:8000/table/getRooms')
    //
    //             if (rooms.data.success){
    //                 let arr_rooms = [];
    //
    //                 for (let room of rooms.data.rooms){
    //                     arr_rooms.push(room.room);
    //                 }
    //                 this.setState({
    //                     groups : arr_rooms
    //                 })
    //             } else {
    //                 console.log('Rooms Failed')
    //             }
    //         }
    //     }
    // }

    onChangeDrop(e) {

        e.preventDefault();
        let tempTable = []

        let index = e.target.selectedIndex;
        let el = e.target.childNodes[index]
        let selectedId =  el.getAttribute('id');

        if (this.state.category === 'Student'){
            selectedId = 0;
            this.setState({
                selectedGroup : e.target.value
            })

            let rashini = [...this.state.sessionTable];
            tempTable = [];

            for (let temp of rashini){
                if (temp.group.match(new RegExp(e.target.value, 'g'))){
                    tempTable.push(temp)
                }
            }

            tempTable = tempTable.filter(obj => obj.group === e.target.value);
        } else if (this.state.category === 'Lecturer'){
            selectedId = 0;
            this.setState({
                selectedLecturer : e.target.value
            })
            let rashini = [...this.state.sessionTable];
            tempTable = [];
            const lecturer = new RegExp('^' + e.target.value, 'i')

            for (let temp of rashini){

                if (temp.lecturer.match(new RegExp(e.target.value, 'g'))){
                    tempTable.push(temp);
                }
            }
        } else if (this.state.category === 'Room'){
            this.setState({
                selectedRoom : e.target.value
            })
            let rashini = [...this.state.sessionTable];
            tempTable = [];

            for (let temp of rashini){
                if (temp.room.match(new RegExp(e.target.value, 'g'))){
                    tempTable.push(temp)
                }
            }


        }

        console.log(tempTable)
        tempTable.sort(function (time1, time2){
            return time1.time - time2.time;
        })

        this.setState({
            table : tempTable
        })
    }

    async onChangeCategory(e){
        // e.preventDefault();
        this.setState({
            category : e.target.value
        });

        if (e.target.value === 'Student'){
            let groups = await axios.get('http://localhost:8000/table/getGroups');

            if(groups.data.success){
                let arr_groups = [];

                for (let group of groups.data.groups){
                    arr_groups.push(group._id.GroupOrSubGroupName)
                }

                this.setState({
                    groups : arr_groups
                })
            } else {
                console.log('groups failed')
            }
        } else if (e.target.value === 'Lecturer'){
            let lecturers = await axios.get('http://localhost:8000/table/getLecturers');

            if(lecturers.data.success){

                let arr_lecturers = [];

                for (let lecturer of lecturers.data.lecturers){
                    arr_lecturers.push(lecturer.fullName)
                }

                this.setState({
                    groups : arr_lecturers
                })
            } else {
                console.log('groups failed')
            }
        } else if (e.target.value === 'Room'){
            let rooms = await axios.get('http://localhost:8000/table/getRooms')

            if (rooms.data.success){
                let arr_rooms = [];

                for (let room of rooms.data.rooms){
                    arr_rooms.push(room.room);
                }
                this.setState({
                    groups : arr_rooms
                })
            } else {
                console.log('Rooms Failed')
            }
        }
    }

    sortByDay(arr_row){

        let order = {Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7}

        arr_row.sort(function (a,b){
            return order[a.day] - order[b.day];
        })

        return arr_row;
    }

    async createRow(e){
        e.preventDefault();

        let iDay = 0;
        let htmlTag = '';
        let rowSpans = [];

        for (let time = 8.30; time < 18.30; time++){
            let arr_row = await this.state.table.filter(obj =>obj.time === time);

            if (arr_row.length > 0){
                htmlTag = htmlTag + '<tr><td>'+ time + "0"+ '</td>';

                arr_row = this.sortByDay(arr_row)
                let i = 1;
                for (let subject of arr_row){
                    switch (subject.day){
                        case 'Monday' : iDay = 1;
                            break;
                        case 'Tuesday' : iDay = 2;
                            break;
                        case 'Wednesday' : iDay = 3;
                            break;
                        case 'Thursday' : iDay = 4;
                            break;
                        case 'Friday' : iDay = 5;
                            break;
                        case 'Saturday' : iDay = 6;
                            break;
                        case 'Sunday' : iDay = 7;
                            break;
                    }

                    let skipColumnCount = 0;

                    if (rowSpans.length > 0){
                        for (let session of rowSpans){
                            if ((session.startTime <= time) && (time <= session.endTime)){
                                skipColumnCount++;
                            }
                        }
                    }

                    for (i; i < (8 - skipColumnCount);){

                        if (i === iDay){
                            htmlTag = htmlTag + '<td rowspan="'+subject.duration+'">' +subject.subject+ '<br/>'+ subject.lecturer + '<br/>' +subject.group+ '<br/>' +subject.room+'</td>';
                            rowSpans.push({day : iDay, rowCount : (subject.duration - 1), startTime : time, endTime : (time + subject.duration - 1)});
                            // console.log(time + " ------------- "+i + " ----------------- " + skipColumnCount)
                            i++;
                            break;
                        } else {
                            htmlTag = htmlTag + '<td>+++</td>'
                        }

                        i++;
                    }


                }

                let skipColumnCount = 0;

                if (rowSpans.length > 0){
                    for (let session of rowSpans){
                        if ((session.startTime < time) && (time <= session.endTime)){
                            skipColumnCount++;
                        }
                    }
                }

                if (i < 8){
console.log(time + " -------- " + skipColumnCount + " ---------- "+ i)
                    for (i ; i < (8 - skipColumnCount) ; i++){
                        htmlTag = htmlTag + '<td>***</td>';
                    }
                }

                htmlTag = htmlTag + '</tr>'
            } else {

                htmlTag = htmlTag + '<tr><td>'+ time + "0"+ '</td>';
                let skipColumnCount = 0;

                for (let session of rowSpans){
                    if ((session.startTime <= time) && (time <= session.endTime)){
                        skipColumnCount++;
                    }
                }

                for (let i = 1; i < (8 - skipColumnCount); i++){
                    htmlTag = htmlTag + '<td>---</td>';
                }
                htmlTag = htmlTag + '</tr>'
            }
        }
        console.log(rowSpans)
        document.getElementById("tableBody").innerHTML = htmlTag;
    }

    render() {

        return(
            <div className="main">
                <div className="row mt-5 align-content-center">
                    <div className="room">
                        <form className="form-inline">
                            <div className="ml-3">
                                <div className="form-inline">
                                    <label style={{fontSize:"15px"}}>
                                        <input  type="radio" id="category" name="student" value = "Student" checked={this.state.category === "Student"}
                                                onChange = {this.onChangeCategory}
                                        /> Student
                                    </label>
                                    <label style={{fontSize:"15px"}}>
                                        <input  type="radio" id="category" name="lecturer" value = "Lecturer" checked={this.state.category === "Lecturer"}
                                                onChange = {this.onChangeCategory}
                                        /> Lecturer
                                    </label>
                                    <label style={{fontSize:"15px"}}>
                                        <input  type="radio" id="category" name="room" value = "Room" checked={this.state.category === "Room"}
                                                onChange = {this.onChangeCategory}
                                        /> Room
                                    </label>
                                </div>
                            </div>

                            <div className="ml-5 form-inline">
                                <select className="form-control " id="inlineFormCustomSelectPref"
                                        onChange={this.onChangeDrop}
                                >
                                    <option selected style={{fontSize: "15px;"}}>Choose...</option>
                                    {
                                        this.state.groups.map(group => {
                                            return (<option>{group}</option>);
                                        })
                                    }

                                </select>
                            </div>
                            <div className="ml-3">
                                <button onClick={this.createRow} className="rounded-circle">SEARCH</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                                <th>Saturday</th>
                                <th>Sunday</th>
                            </tr>
                        </thead>

                        <tbody id="tableBody">
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}