import React from 'react';
import {HashRouter as Router, Route} from "react-router-dom";

import Main from "./Common/HomePage"
import AddLocationData from "./location/AddLocationData";
import NavBar from "./Common/Navbar";
import StudentStats from "./Statistics/StudentStats";
import ViewLocation from "./location/ViewLocation";
import ViewRoomDetails from "./location/ViewRoomDetail";
import SubjectStat from "./Statistics/SubjectStat";
import LecturerStats from "./Statistics/LectureStats";
import EditRoom from "./location/EditRoom";
import ViewBuildings from "./location/ViewBuildings";

//LecturerNA
import LecturerHomePage from "./Lecturer/LecturerHomePage";
import AddLecturerDetails from "./Lecturer/AddLecturerDetails";
import ViewLecturerDetails from "./Lecturer/ViewLecturerDetails";
import EditLecturerDetails from "./Lecturer/EditLecturerDetails";

//Subject
import SubjectHomePage from "./Subject/SubjectHomePage";
import AddSubjectDetails from "./Subject/AddSubjectDetails";
import ViewSubjectDetails from "./Subject/ViewSubjectDetails";
import EditSubjectDetails from "./Subject/EditSubjectDetails";

//Working days
import WorkingDaysMain from "./WorkingDays/WorkingDaysMain";
import AddWeekdayWorkingDays from "./WorkingDays/AddWeekdayWorkingDays";
import AddWeekendWorkingDays from "./WorkingDays/AddWeekendWorkingDays";
import ViewWeekdayWorkingDays from "./WorkingDays/ViewWeekdayWorkingDays";
import ViewWeekendWorkingDays from "./WorkingDays/ViewWeekendWorkingDays";

//Tags And Groups
import AddTag from "./tag/AddTagDetails";
import ViewTag from "./tag/ViewTag";
import UpdateTag from "./tag/editTag";
import AddStudent from "./Student/AddStudentData";
import ViewStudent from "./Student/ViewStudent";
import UpdateStudent from "./Student/EditStudentData";

//Time Allocation
import NotAvailable from "./TimeAllocation/NotAvailable";
import ConsecutiveSessions from "./TimeAllocation/ConsecutiveSessions";
import ParallelSessions from "./TimeAllocation/ParallelSessions";
import OverlapSessions from "./TimeAllocation/OverlapSessions";
import LecturerNA from "./TimeAllocation/LecturerNA";
import Session from "./TimeAllocation/SessionNA";
import Group from "./TimeAllocation/GroupNA";
import TimeAllocationMain from "./TimeAllocation/TimeAllocationMain";

//Session
import AddSession from "./Session/AddSession";
import ViewSession from "./Session/ViewSession";

//Room allocation
import TagOnly from "./RoomAllocation/TagOnly";
import TagAndSub from "./RoomAllocation/Tag&Sub";
import RoomAllocationMain from "./RoomAllocation/RoomAllocationMain";
import UnavailableTimes from "./RoomAllocation/UnavailableTimes";

//TimeTable
import TimeTable from "./TimeTable/TimeTable"

function App() {
  return (
      <Router>
        <NavBar/>
        <switch>
            <Route path="/" exact component={Main}/>

            {/*Location*/}
            <Route path="/AddLocation" exact component={AddLocationData} />
            <Route path="/ViewLocation" component={ViewLocation}/>
            <Route path="/ViewRoom" component={ViewRoomDetails}/>
            <Route path="/UpdateRoom/:id" component={EditRoom}/>
            <Route path="/ViewBuilding" component={ViewBuildings}/>

            {/*Statistics*/}
            <Route path="/StuStats" component={StudentStats}/>
            <Route path="/LecturerStats" component={LecturerStats}/>
            <Route path="/SubjectStats" component={SubjectStat}/>



            {/*Lecturers*/}
            <Route path="/LecHome" component={LecturerHomePage}/>
            <Route path="/AddLec" component={AddLecturerDetails}/>
            <Route path="/ViewLec" component={ViewLecturerDetails}/>
            <Route path="/UpdateLec/:id" component={EditLecturerDetails}/>

            {/*Subjects*/}
            <Route path="/SubHome" component={SubjectHomePage}/>
            <Route path="/AddSub" component={AddSubjectDetails}/>
            <Route path="/ViewSub" component={ViewSubjectDetails}/>
            <Route path="/UpdateSub/:id" component={EditSubjectDetails}/>

            {/*Sessions*/}
            <Route path="/AddSession" component={AddSession}/>
            <Route path="/ViewSession" component={ViewSession}/>

            {/*Working Days*/}
          <Route path="/WorkingDaysMain" component={WorkingDaysMain}/>
          <Route path="/AddWeekdayWorkingDays" component={AddWeekdayWorkingDays}/>
          <Route path="/AddWeekendWorkingDays" component={AddWeekendWorkingDays}/>
          <Route path="/ViewWeekdayWorkingDays" component={ViewWeekdayWorkingDays}/>
          <Route path="/ViewWeekendWorkingDays" component={ViewWeekendWorkingDays}/>

           {/*TagsAndStudents*/}
          <Route path="/AddTag" component={AddTag}/>
          <Route path="/ViewTag" component={ViewTag}/>
          <Route path="/UpdateTag" component={UpdateTag}/>
          <Route path="/AddStudent" component={AddStudent}/>
          <Route path="/ViewStudent" component={ViewStudent}/>
          <Route path="/UpdateGroup" component={UpdateStudent}/>

          {/*RoomAllocation*/}
          <Route path="/RoomAlMain" component={RoomAllocationMain}/>
            <Route path="/RoomTag" component={TagOnly}/>
            <Route path="/TagAndSub" component={TagAndSub}/>
            <Route path="/UnAvailable" component={UnavailableTimes}/>

            {/*TimeAllocation*/}
            <Route path="/NotAvailable" component={NotAvailable}/>
            <Route path="/ConsecutiveSessions" component={ConsecutiveSessions}/>
            <Route path="/ParallelSessions" component={ParallelSessions}/>
            <Route path="/OverlapSessions" component={OverlapSessions}/>
            <Route path="/LecturerNA" component={LecturerNA}/>
            <Route path="/SessionNA" component={Session}/>
            <Route path="/GroupNA" component={Group}/>
            <Route path="/TimeAllocationMain" component={TimeAllocationMain}/>

            {/* Time table */}
            <Route path="/TimeTable" component={TimeTable}/>

        </switch>
      </Router>
  );
}

export default App;
