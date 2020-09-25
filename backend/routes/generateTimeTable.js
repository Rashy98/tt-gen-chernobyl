const bodyParser = require('body-parser');
const express = require('express');
const router = require('express').Router();

const {MongoClient} = require('mongodb');
const url = "mongodb+srv://admin:admin@spmfinalproj.zvpc2.mongodb.net/TimeTableGen?retryWrites=true&w=majority";

let WorkingDays = require('../models/WorkingDays.model');
let Sessions = require('../models/Session.model');
let Lecturers = require('../models/Lecturer.model');
let Rooms = require('../models/Room.model');
let RoomsTable = require('../models/RoomsTable.model');

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let studentTable = [];
let arr_RoomsTable = [];
let arr_RoomsTableWeekend = [];
let lecturerTable = [];
let groups= [];
let workingDays = [];
let arr_RemovedSessions = [];

let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
// let time = new Date()
// time.setHours(9, 30);
let defaultTime = 8.30;
let defaultDay = days[0];

let arr_sessions = [];
let tempSessions = [];
let lecturers;

router.route('/getStudentTable').get(async (req, res) => {

    let response;

    response = await generateTable();

    if (response){
        if (response.success){
            return res.status(200).json({success : response.success, msg : response.msg})
        } else {
            return res.status(400).json({success : response.success, msg : response.msg})
        }

    } else {
        response = {success: false, msg : "Table not generated"}
        return res.status(400).json({success : response.success, msg : response.msg})
    }


    // return res.json({success : response.success, msg : response.msg});
});

async function generateTable(){

    await MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        var dbo = db.db("TimeTableGen");
        await dbo.dropCollection("generatedtables", function (err, delOK) {
            // if (err) throw err;
            if (delOK) console.log("Collection deleted");
            db.close();
        });
    });

    /** ------------------------------------------------------------------------------------------ **/
    /** ----------------------------- Get all distinct groups ------------------------------------ **/
    /** ------------------------------------------------------------------------------------------ **/
    groups = await Sessions.aggregate([{
        $group : {
            _id : {GroupOrSubGroupName: "$GroupOrSubGroupName"}
        }
    }]);

    workingDays = await WorkingDays.find();
    // console.log(workingDays)

    /** ------------------------------------------------------------------------------------------ **/
    /** ----------------------------- Get all distinct sessions ---------------------------------- **/
    /** ------------------------------------------------------------------------------------------ **/
    arr_sessions = await Sessions.find();

    if (arr_sessions){
        /** ----------------------------- Iterate through weekday/weekend ---------------------------------- **/
        for (let dayType of workingDays){
            days = dayType.workingDays;
            defaultDay = days[0]
            tempSessions = [...arr_sessions];

            /** ----------------------------- Iterate through groups ---------------------------------- **/
            for (let group of groups){
                /** ----------------------------- Iterate through sessions of a group ---------------------------- **/
                for (let session of tempSessions){
                    if (group._id.GroupOrSubGroupName === session.GroupOrSubGroupName){

                        lecturers = session.LecName;
                        let room;
                        // let sessionDay = days[0];
                        let sessionDuration = session.Duration;
                        let sessionType = session.Tag;
                        // let commonRoom = new HashMap();

                        /** ---------------------- Iterate through lecturers of a session ---------------------- **/
                        for (let lecturer of lecturers){

                            room = await findSuitableRoom(lecturer.name, sessionDuration, sessionType, session, dayType.dayType, session.GroupOrSubGroupName);

                            if (dayType.dayType === "Weekday"){
                                if (room.success){
                                    arr_RoomsTable.push({room : room.room, subject : room.subject, lecturerName : session.LecName,
                                        lecturerLevel : room.level, groups: group._id.GroupOrSubGroupName, day: room.day,
                                        time : room.time, duration : room.duration, session : dayType.dayType})
                                    break;
                                } else {
                                    return {success : false , msg : 'Cannot assign a room for session '+ session.SubName + ' of ' + session.GroupOrSubGroupName}
                                }
                            } else {
                                if (room.success){
                                    arr_RoomsTableWeekend.push({room : room.room, subject : room.subject, lecturerName : session.LecName,
                                        lecturerLevel : room.level, groups: group._id.GroupOrSubGroupName, day: room.day,
                                        time : room.time, duration : room.duration, session : dayType.dayType})
                                    break;
                                } else {
                                    return {success : false , msg : 'Cannot assign a room for session '+ session.SubName + ' of ' + session.GroupOrSubGroupName}

                                }
                            }
                            break;
                        }

                    } else {

                    }
                }
            }
        }

        if (arr_RemovedSessions.length > 0){
            let rooms;
            let room;
            for (let removedSession of arr_RemovedSessions){
                rooms = await getRooms(removedSession.subject)

                room = await assignRoom(rooms, removedSession.duration, removedSession.lecturerLevel, removedSession.subject,
                                removedSession.session, removedSession.groups)

                if (room.session.toUpperCase() === "Weekday".toUpperCase()){
                    if (room.success){
                        arr_RoomsTable.push({room : room.room, subject : room.subject, lecturerName : removedSession.lecturerName,
                            lecturerLevel : room.level, groups: removedSession.groups, day: room.day,
                            time : room.time, duration : room.duration, session : removedSession.session})
                    } else {
                        return {success : false , msg : 'Cannot assign a room for session '+ removedSession.subject + ' of ' + removedSession.groups}
                    }

                } else {
                    if (room.success){
                        arr_RoomsTableWeekend.push({room : room.room, subject : room.subject, lecturerName : removedSession.lecturerName,
                            lecturerLevel : room.level, groups: removedSession.groups, day: room.day,
                            time : room.time, duration : room.duration, session : removedSession.session})
                    } else {
                        return {success : false , msg : 'Cannot assign a room for session '+ removedSession.subject + ' of ' + removedSession.groups}
                    }
                }
            }
        }

        for (let weekday of arr_RoomsTable){
            const session = new RoomsTable({
                room : weekday.room,
                subject : weekday.subject,
                lecturerName : weekday.lecturerName,
                lecturerLevel : weekday.lecturerLevel,
                groups : weekday.groups,
                day : weekday.day,
                time : weekday.time,
                duration : weekday.duration,
                session : weekday.session
            })

            session.save()
                .catch(err => console.log(err));
        }

        for (let weekend of arr_RoomsTableWeekend){
            const session = new RoomsTable({
                room : weekend.room,
                subject : weekend.subject,
                lecturerName : weekend.lecturerName,
                lecturerLevel : weekend.lecturerLevel,
                groups : weekend.groups,
                day : weekend.day,
                time : weekend.time,
                duration : weekend.duration,
                session : weekend.session
            })

            session.save()
                .catch(err => console.log(err));
        }

        console.log('---------------------- Week Day --------------------------------')
        console.log(arr_RoomsTable)
        console.log('---------------------- Weekend --------------------------------')
        console.log(arr_RoomsTableWeekend)

        return {success: true, msg : 'Table Generated'}
    } else {
        console.log('else')
    }

//     Sessions.find(
//         async (err, result) => {
//
//             if(result){
//                 sessions = result;
//
//                 /** ----------------------------- Iterate through groups ---------------------------------- **/
//                 for (let group of groups){
//                     /** ----------------------------- Iterate through sessions of a group ---------------------------- **/
//                     for (let session of sessions){
//                         if (group._id.GroupOrSubGroupName === session.GroupOrSubGroupName){
//
//                             lecturers = session.LecName;
//                             let room;
//                             let sessionDay = days[0];
//                             // let sessionTime = time.getHours();
//                             let sessionDuration = session.Duration;
//                             let sessionType = session.Tag;
//                             // let subject = session.SubCode +'-'+session.SubName+' ('+session.Tag+')';
//                             let commonRoom = new HashMap();
//
//                             /** ---------------------- Iterate through lecturers of a session ---------------------- **/
//                             for (let lecturer of lecturers){
//
//                                 room = await findSuitableRoom(lecturer.name, sessionDuration, sessionType, session);
//
//                                 // let isFound = commonRoom.get(room);
//                                 //
//                                 // if (isFound !== undefined){
//                                 //     isFound++;
//                                 //
//                                 //     commonRoom.delete(room);
//                                 //     commonRoom.set(room, isFound);
//                                 // } else {
//                                 //     commonRoom.set(room, 1);
//                                 // }
//
//                                 if (room.success){
//                                     // console.log(room.subject + " | " + room.day + " | "+ room.time + " | " + room.duration + " | " +room.room)
//
//                                     arr_RoomsTable.push({room : room.room, subject : room.subject, lecturerName : session.LecName,
//                                         lecturerLevel : room.level, groups: group._id.GroupOrSubGroupName, day: room.day,
//                                         time : room.time, duration : room.duration})
//                                     break;
//                                 }
//
//                                 break;
//                             }
//
//                             // for (let room of commonRoom){
//                             //     let currentRoom = room;
//                             //     let previousRoom = room;
//                             //     let selectedRoom;
//                             //
//                             //     if (currentRoom.value >= previousRoom.value){
//                             //         selectedRoom = currentRoom.key;
//                             //     }
//                             // }
//                             // console.log(arr_RoomsTable)
//                         } else {
//
//                         }
//                     }
//                 }
//
//                 return {success: true, msg : 'Table Generated'}
//             } else {
//                 return {success : false, msg : err}
//             }
//         })
}

/** ------------------------------------------------------------------------------------------ **/
/** ----------------------------- find a suitable room --------------------------------------- **/
/** ------------------------------------------------------------------------------------------ **/
async function findSuitableRoom(_lecturer, _sessionDuration, _sessionType, _session, _dayType, _sessionGroup){

    let response = '';
    let lecturer = undefined;
    let subject = _session.SubCode +'-'+_session.SubName+' ('+_session.Tag+')';
    let consecutiveSession;
    // let splicedSession;
    let sessionDuration = _sessionDuration;
    let sessionGroup = _sessionGroup;

    /** ----------------------------- get lecturer details --------------------------------------- **/
    lecturer = await Lecturers.findOne({fullName: new RegExp('.*' + _lecturer + '.*')});

    /** ----------------------------- get consecutive session --------------------------------------- **/
    if (_session.ConsecutiveSessionID !== ""){
        consecutiveSession = await getConsecutiveSession(_session.ConsecutiveSessionID);

        for (let session of tempSessions){

            if (session._id.toString() === consecutiveSession._id.toString()){
                let index = tempSessions.findIndex(obj => obj._id === session._id);
                let splicedSession = tempSessions.splice(index, 1);
                sessionDuration = sessionDuration + splicedSession[0].Duration;
                subject = _session.SubCode +'-'+_session.SubName+' ('+_session.Tag+', '+splicedSession[0].Tag +')';
            }
        }
    }

    if (lecturer) {
        let preferredRooms = lecturer.rooms;

        if (preferredRooms.length > 0) {
            /** ----------------------------- iterate through preferred rooms --------------------------------------- **/
            for (let preferredRoom of preferredRooms) {
                let occupiedTimes;
                if (_dayType.toUpperCase() === "Weekday".toUpperCase()){
                    occupiedTimes = arr_RoomsTable.filter(obj => obj.room === preferredRoom);
                } else {
                    occupiedTimes = arr_RoomsTableWeekend.filter(obj => obj.room === preferredRoom);
                }
                let itr = 0; // iterator to increment days
                let sessionRoom = null;
                let sessionDay = defaultDay;
                let sessionStartTime = defaultTime;
                let sessionEndTime = sessionStartTime + sessionDuration;

                /** ----------------------------- get preferred room details --------------------------------------- **/
                let preferredRoomDetails = await getRoomDetails(preferredRoom);

                if ((preferredRoomDetails.Unavailable !== undefined) && (preferredRoomDetails.Unavailable.length > 0)){
                    let passedTime = await passRoomUnavailableTimes(preferredRoomDetails.Unavailable, sessionStartTime,
                        sessionDay, sessionDuration, itr);

                    sessionDay = passedTime.sessionDay;
                    sessionStartTime = passedTime.sessionTime;
                    sessionEndTime = sessionStartTime + sessionDuration;
                    itr = passedTime.itr;
                }

                if (occupiedTimes.length > 0) {

                    /** ------------------------ iterate through occupied times of a room -------------------------- **/
                    for (let occupiedTime of occupiedTimes) {

                        let occuTime = occupiedTime.time;
                        let occuDay = occupiedTime.day;
                        let occuDuration = occupiedTime.duration;
                        sessionRoom = occupiedTime.room;

                        /** ------------------------ increment day and time of current session -------------------------- **/
                        // let check = true;
                        // while (check) {
                        //     if ((occuTime === sessionStartTime) && (occuDay === sessionDay)) {
                        //         sessionStartTime = sessionStartTime + occuDuration;
                        //         sessionEndTime = sessionStartTime + sessionDuration;
                        //
                        //         if ((sessionEndTime > 12.30) && (sessionEndTime <= 13.30)) {
                        //             sessionStartTime = 13.30;
                        //             sessionEndTime = sessionStartTime + sessionDuration;
                        //         } else if ((sessionStartTime >= 12.30) && (sessionStartTime < 13.30)) {
                        //             sessionStartTime = 13.30;
                        //             sessionEndTime = sessionStartTime + sessionDuration;
                        //         } else if ((sessionStartTime <= 12.30) && (12.30 < sessionEndTime)) {
                        //             sessionStartTime = 13.30
                        //             sessionEndTime = sessionStartTime + sessionDuration;
                        //         } else if (sessionStartTime > 16.30 || (sessionEndTime > 17.30)) {
                        //             itr++;
                        //             sessionDay = days[itr];
                        //             sessionStartTime = defaultTime;
                        //             sessionEndTime = sessionStartTime + sessionDuration;
                        //             //
                        //             // if (sessionDay === undefined){
                        //             //     // sessionDay = defaultDay;
                        //             //     // check = false;
                        //             //     // return {success : false, day : null, time : null, room : null}
                        //             //     break;
                        //             // }
                        //         }
                        //
                        //         // let result = await commonTimeChecking(sessionDay, sessionStartTime, sessionDuration, itr);
                        //         //
                        //         // sessionDay = result.day;
                        //         // sessionStartTime = result.start;
                        //         // sessionEndTime = result.end;
                        //         // sessionDuration = result.duration;
                        //         // itr = result.itr;
                        //
                        //         // break;
                        //     } else {
                        //         check = false;
                        //     }
                        // }

                        let result = await occupiedTimeChecking(sessionDay, sessionStartTime, sessionEndTime, sessionDuration, occuTime, occuDay,
                            occuDuration, itr, occupiedTimes, sessionRoom, _dayType, sessionGroup);

                        sessionDay = result.day;
                        sessionStartTime = result.time;
                        sessionEndTime = sessionStartTime + sessionDuration;
                        // let availability = checkDayAndTime(occupiedTime, _sessionDay, _sessionTime, itr);
                        //
                        // if (availability.success){
                        //     sessionRoom = availability.room;
                        //     sessionDay = availability.day;
                        //     sessionTime = availability.time;
                        //
                        //     // return {success : true, room : sessionRoom, day : sessionDay, time : sessionTime}
                        // } else {
                        //     let availabilityByLevel = checkDayAndTimeByLevel(occupiedTime, _sessionDay,
                        //                                 _sessionTime, itr, lecturer.level);
                        //
                        //     if (!availabilityByLevel.success){
                        //         //success une naththam error message ekak pennanna ona
                        //         //Success nm ain karpu session eke details nuth enawa eka handle krannath ona
                        //     }
                        // }

                    }

                    if (sessionDay !== undefined) {
                        return {success: true, day: sessionDay, time: sessionStartTime, duration : sessionDuration, room: sessionRoom, subject : subject,  level: lecturer.level};
                    }
                } else {
                    let result = await commonTimeChecking(sessionDay, sessionStartTime, sessionDuration, itr);
                    sessionDay = result.day;
                    sessionStartTime = result.start;
                    sessionEndTime = result.end;
                    sessionDuration = result.duration;
                    itr = result.itr;

                    if (sessionDay !== undefined){
                        return {success: true, day: sessionDay, time: sessionStartTime, duration : sessionDuration, room: preferredRoom, subject : subject, level: lecturer.level}
                    } else {
                        return {success: false, day: null, time: null, duration : null, room: null, subject : null, level: null}
                    }

                }

            }
            response = await selectRoomByLevel(preferredRooms, lecturer.level, sessionDuration, subject, _dayType);
            if (!response.success) {
                let rooms = await getRooms(_sessionType);
                response = await assignRoom(rooms, sessionDuration, lecturer.level, subject, _dayType, sessionGroup);
                return response;
            } else {
                arr_RemovedSessions.push(response.removed)
            }

            // return response;
        } else {
            let rooms;

            rooms = await getRooms(_sessionType);
            response = await assignRoom(rooms, sessionDuration, lecturer.level, subject, _dayType, sessionGroup);

            return response;
        }
    } else {

        return {success : false, msg : "Cannot retrieve data"}
    }

    // return response;

}

async function selectRoomByLevel(_preferredRooms, _lecLevel, _sessionDuration, _subject, _dayType){

    if (_preferredRooms.length > 0){
        for (let preferredRoom of _preferredRooms){
            let occupiedTimes;

            if (_dayType.toUpperCase() === "Weekday".toUpperCase()){
                occupiedTimes = arr_RoomsTable.filter(obj => obj.room === preferredRoom);
            } else {
                occupiedTimes = arr_RoomsTableWeekend.filter(obj => obj.room === preferredRoom);
            }
            let itr = 0; // iterator to increment days

            let sessionRoom = null;
            let sessionDay = defaultDay;
            let sessionTime = defaultTime;

            if (occupiedTimes.length > 0){

                //iterate through occupied times of a preferred room
                for (let occupiedTime of occupiedTimes) {

                    let occuTime = occupiedTime.time;
                    let occuDay = occupiedTime.day;
                    let occuDuration = occupiedTime.duration;
                    sessionRoom = occupiedTime.room;

                    if (occupiedTime.lecturerLevel > _lecLevel){
                        if (_dayType.toUpperCase() === "Weekday".toUpperCase()){
                            let index = arr_RoomsTable.findIndex(occupiedTime);
                            arr_RoomsTable.splice(index, 1);
                        } else {
                            let index = arr_RoomsTableWeekend.findIndex(occupiedTime);
                            arr_RoomsTableWeekend.splice(index, 1);
                        }

                        return {success : true, day : occuDay, time: occuTime,duration : _sessionDuration, room:sessionRoom, subject : _subject,level : _lecLevel, removed : occupiedTime}
                    }

                }

            } else {
                return {success: true, day: sessionDay, time: sessionTime,duration : _sessionDuration, room: preferredRoom, subject : _subject, level : _lecLevel, removed: null};
            }

        }

        return {success: false, day: null, time: null,duration : null, room: null, subject : null, level : null, removed: null};

    }
}

async function assignRoom(_rooms, _sessionDuration, _lecLevel, _subject, _dayType, _sessionGroup){
    let response = '';
    let sessionGroup = _sessionGroup;
    if (_rooms.length > 0){
        for (let room of _rooms){
            let occupiedTimes;
            if (_dayType.toUpperCase() === "Weekday".toUpperCase()){
                occupiedTimes = arr_RoomsTable.filter(obj => obj.room === room.room);
            } else {
                occupiedTimes = arr_RoomsTableWeekend.filter(obj => obj.room === room.room);
            }

            let itr = 0; // iterator to increment days

            let sessionRoom = null;
            let sessionDay = defaultDay;
            let sessionStartTime = defaultTime;
            let sessionDuration = _sessionDuration;
            let sessionEndTime = sessionStartTime + sessionDuration;

            /** ----------------------------- get room details --------------------------------------- **/
            let roomDetails = await getRoomDetails(room.room);

            if ((roomDetails.Unavailable !== undefined) && (roomDetails.Unavailable.length > 0)){
                let passedTime = await passRoomUnavailableTimes(roomDetails.Unavailable, sessionStartTime,
                    sessionDay, _sessionDuration, itr);

                sessionDay = passedTime.sessionDay;
                sessionStartTime = passedTime.sessionTime
                sessionEndTime = sessionStartTime + sessionDuration;
                itr = passedTime.itr;

            }

            if (occupiedTimes.length > 0){

                //iterate through occupied times of a preferred room
                for (let occupiedTime of occupiedTimes) {

                    let occuTime = occupiedTime.time;
                    let occuDay = occupiedTime.day;
                    let occuDuration = occupiedTime.duration;
                    sessionRoom = occupiedTime.room;

                    // let check = true;
                    // while (check){
                    //     if ((occuTime === sessionStartTime) && (occuDay === sessionDay)){
                    //         sessionStartTime = sessionStartTime + occuDuration;
                    //         sessionEndTime = sessionStartTime + _sessionDuration;
                    //
                    //         if ((sessionEndTime > 12.30) && (sessionEndTime <= 13.30)){
                    //             sessionStartTime = 13.30;
                    //             sessionEndTime = sessionStartTime + _sessionDuration;
                    //         } else if ((sessionStartTime >= 12.30) && (sessionStartTime < 13.30)){
                    //             sessionStartTime = 13.30;
                    //             sessionEndTime = sessionStartTime + _sessionDuration;
                    //         } else if ((sessionStartTime <= 12.30) && (12.30 < sessionEndTime)){
                    //             sessionStartTime = 13.30;
                    //             sessionEndTime = sessionStartTime + _sessionDuration;
                    //             // console.log("Line 373 "+sessionStartTime + " " + sessionEndTime)
                    //         }
                    //
                    //         else if ((sessionStartTime > 16.30) || (sessionEndTime > 17.30)){
                    //             itr++;
                    //             sessionDay = days[itr];
                    //             sessionStartTime = defaultTime;
                    //             sessionEndTime = sessionStartTime + _sessionDuration;
                    //         }
                    //
                    //         // let result = await commonTimeChecking(sessionDay, sessionStartTime, sessionDuration, itr);
                    //         //
                    //         // sessionDay = result.day;
                    //         // sessionStartTime = result.start;
                    //         // sessionEndTime = result.end;
                    //         // sessionDuration = result.duration;
                    //         // itr = result.itr;
                    //         // break;
                    //     } else {
                    //         check = false;
                    //     }
                    // }
                    let result = await occupiedTimeChecking(sessionDay, sessionStartTime, sessionEndTime, sessionDuration, occuTime, occuDay,
                                        occuDuration, itr, occupiedTimes, sessionRoom, _dayType, sessionGroup);

                    sessionDay = result.day;
                    sessionStartTime = result.time;
                    sessionEndTime = sessionStartTime + sessionDuration;

                }

                if (sessionDay !== undefined){
                    response = {success : true, day : sessionDay, time : sessionStartTime,duration : _sessionDuration, room : sessionRoom, subject : _subject, level : _lecLevel, removed: null};
                    return response;
                }
            } else {
                let result = await commonTimeChecking(sessionDay, sessionStartTime, sessionDuration, itr);

                sessionDay = result.day;
                sessionStartTime = result.start;
                sessionEndTime = result.end;
                sessionDuration = result.duration;
                itr = result.itr;

                if (sessionDay !== undefined){
                    response = {success: true, day: sessionDay, time: sessionStartTime,duration : _sessionDuration, room: room.room, subject : _subject, level : _lecLevel, removed: null}
                    return response;
                } /* else {
                    response = {success: false, day: null, time: null,duration : null, room: null, subject : null, level : null, removed: null}
                } */

                // return response;
            }
        }

        response = {success: false, day: null, time: null,duration : null, room: null, subject : null, level : null, removed: null};
        return response;
    }
}

async function getRooms(type){

    let roomsByType = undefined;

    switch (type){
        case 'Tutorial' : type = 'Lecture hall'
                            break;

        case 'Practical' : type = 'Lab'
                            break;
        default : type = 'Lecture hall'
    }

    roomsByType = await Rooms.find({type : type});

    if (roomsByType){
        // console.log("Get Room Function "+roomsByType.length);
    } else {
        console.log('No Room')
    }

    return roomsByType;
}

async function getRoomDetails(_room){
    let preferredRoomDetails = undefined;

    preferredRoomDetails = await Rooms.findOne({room : _room});

    return preferredRoomDetails;

}

async function passRoomUnavailableTimes(_unavailableTimes, _sessionTime, _sessionDay, _sessionDuration, _itr){
    let sessionDay = _sessionDay;
    let sessionStartTime = _sessionTime;
    let sessionEndTime = sessionStartTime + _sessionDuration;

    let unavailableDay;
    let unavailableStart;
    let unavailableEnd;
    let itr = _itr;

    for (let unavailableTime of _unavailableTimes){

        unavailableDay = unavailableTime.day;
        unavailableStart = parseFloat(unavailableTime.startTime.replace(/:/gi, "."));
        unavailableEnd = parseFloat(unavailableTime.endTime.replace(/:/gi, "."));

        if (unavailableDay === sessionDay){

            if ((unavailableStart < sessionEndTime) && (sessionEndTime <= unavailableEnd)){
                sessionStartTime = unavailableEnd;
                sessionEndTime = sessionStartTime + _sessionDuration;
            } else if ((unavailableStart <= sessionStartTime) && (sessionStartTime < unavailableEnd)) {
                sessionStartTime = unavailableEnd;
                sessionEndTime = sessionStartTime + _sessionDuration;
            } else if ((sessionStartTime <= unavailableStart) && (unavailableStart < sessionEndTime)) {
                sessionStartTime = unavailableEnd;
                sessionEndTime = sessionStartTime + _sessionDuration;
            }

            if (sessionStartTime > 16.30){
                itr++;
                sessionDay = days[itr];
                sessionStartTime = defaultTime;
                sessionEndTime = sessionStartTime + _sessionDuration;
            }
        }
    }

    return {sessionTime : sessionStartTime, sessionDay: sessionDay, itr : itr};
}

async function passLecturerUnavailableTimes(_unavailableTimes, _sessionTime, _sessionDay, _sessionDuration, _itr){
    let sessionDay = _sessionDay;
    let sessionStartTime = _sessionTime;
    let sessionEndTime = _sessionTime + _sessionDuration;

    let unavailableDay;
    let unavailableStart = _unavailableTimes.startTime;
    let unavailableEnd = _unavailableTimes.endTime;
    let itr = _itr;

    for (let unavailableTime of _unavailableTimes){

        unavailableDay = unavailableTime.day;
        unavailableStart = unavailableTime.startTime;
        unavailableEnd = unavailableTime.endTime;

        if (unavailableDay === sessionDay){

            if ((unavailableStart <= sessionEndTime) && (sessionEndTime < unavailableEnd)){
                sessionStartTime = unavailableEnd;
                sessionEndTime = sessionStartTime + _sessionDuration;
            } else if ((unavailableStart <= sessionStartTime) && (sessionStartTime < unavailableEnd)) {
                sessionStartTime = unavailableEnd;
                sessionEndTime = sessionStartTime + _sessionDuration;
            } else if ((sessionStartTime <= unavailableStart) && (unavailableStart < sessionEndTime)) {
                sessionStartTime = unavailableEnd;
                sessionEndTime = sessionStartTime + _sessionDuration;
            }

            if (sessionStartTime > 16.30){
                itr++;
                sessionDay = days[itr];
                sessionStartTime = defaultTime;
                sessionEndTime = sessionStartTime + _sessionDuration;
            }
        }
    }


    return {sessionTime : sessionStartTime, sessionDay: sessionDay, itr : itr};
}

async function getConsecutiveSession(_consecutiveSessionId){

    let session = '';

    session = await Sessions.findOne({_id: _consecutiveSessionId});

    return session;
}

async function commonTimeChecking(_sessionDay, _sessionStartTime, _sessionDuration, _itr ){

    let sessionDay = _sessionDay;
    let sessionStartTime = _sessionStartTime;
    let sessionDuration = _sessionDuration;
    let sessionEndTime = sessionStartTime + sessionDuration;
    let itr = _itr;

    sessionStartTime = _sessionStartTime;
    sessionEndTime = sessionStartTime + sessionDuration;

    if ((sessionEndTime > 12.30) && (sessionEndTime <= 13.30)) {
        sessionStartTime = 13.30;
        sessionEndTime = sessionStartTime + sessionDuration;
    } else if ((sessionStartTime >= 12.30) && (sessionStartTime < 13.30)) {
        sessionStartTime = 13.30;
        sessionEndTime = sessionStartTime + sessionDuration;
    } else if ((sessionStartTime <= 12.30) && (12.30 < sessionEndTime)) {
        sessionStartTime = 13.30
        sessionEndTime = sessionStartTime + sessionDuration;
    } else if (sessionStartTime > 16.30 || (sessionEndTime > 17.30)) {
        itr++;
        sessionDay = days[itr];
        sessionStartTime = defaultTime;
        sessionEndTime = sessionStartTime + sessionDuration;

        return commonTimeChecking(sessionDay, sessionStartTime, sessionDuration, itr);
    }

    return {day : sessionDay, start : sessionStartTime, end : sessionEndTime, duration : sessionDuration, itr : itr}

}

async function occupiedTimeChecking(_sessionDay, _sessionStartTime, _sessionEndTime, _sessionDuration, _occuTime, _occuDay, _occuDuration, _itr, _occupiedTimes, _sessionRoom, _dayType, _sessionGroup){

    let occupiedTimes = _occupiedTimes;
    let sessionDay = _sessionDay;
    let sessionStartTime = _sessionStartTime;
    let sessionEndTime = _sessionEndTime;
    let sessionDuration = _sessionDuration;
    let occuTime = _occuTime;
    let occuDay = _occuDay;
    let occuDuration = _occuDuration;
    let itr = _itr;
    let sessionRoom = _sessionRoom;
    let sessionGroup = _sessionGroup;

    let check = true;
    while (check){
        if ((occuTime === sessionStartTime) && (occuDay === sessionDay)){
            sessionStartTime = sessionStartTime + occuDuration;
            sessionEndTime = sessionStartTime + sessionDuration;

            let result = await commonTimeChecking(sessionDay, sessionStartTime, sessionDuration, itr);

            sessionDay = result.day;
            sessionStartTime = result.start;
            sessionEndTime = result.end;
            sessionDuration = result.duration;
            itr = result.itr;

            /** ----------------------------- get room details --------------------------------------- **/
            let roomDetails = await getRoomDetails(sessionRoom);

            if ((roomDetails.Unavailable !== undefined) && (roomDetails.Unavailable.length > 0)){
                let passedTime = await passRoomUnavailableTimes(roomDetails.Unavailable, sessionStartTime,
                    sessionDay, _sessionDuration, itr);

                sessionDay = passedTime.sessionDay;
                sessionStartTime = passedTime.sessionTime
                sessionEndTime = sessionStartTime + sessionDuration;
                itr = passedTime.itr;

            }
        } else {
            let result = await commonTimeChecking(sessionDay, sessionStartTime, sessionDuration, itr);

            sessionDay = result.day;
            sessionStartTime = result.start;
            sessionEndTime = result.end;
            sessionDuration = result.duration;
            itr = result.itr;

            /** ----------------------------- get room details --------------------------------------- **/
            let roomDetails = await getRoomDetails(sessionRoom);

            if ((roomDetails.Unavailable !== undefined) && (roomDetails.Unavailable.length > 0)){
                let passedTime = await passRoomUnavailableTimes(roomDetails.Unavailable, sessionStartTime,
                    sessionDay, _sessionDuration, itr);

                sessionDay = passedTime.sessionDay;
                sessionStartTime = passedTime.sessionTime
                sessionEndTime = sessionStartTime + sessionDuration;
                itr = passedTime.itr;
            }

            let doubleCheckTimes = occupiedTimes.filter(obj => obj.day === sessionDay && obj.time === sessionStartTime);

            if (doubleCheckTimes.length > 0){
                let results;
                for (let doubleCheckTime of doubleCheckTimes){
                    occuTime = doubleCheckTime.time;
                    occuDay = doubleCheckTime.day;
                    occuDuration = doubleCheckTime.duration;
                    sessionRoom = doubleCheckTime.room;

                    results = await occupiedTimeChecking(sessionDay, sessionStartTime, sessionEndTime, sessionDuration, occuTime, occuDay, occuDuration, itr, occupiedTimes, sessionRoom);

                    sessionDay = result.day;
                    sessionStartTime = result.time;
                    sessionEndTime = sessionStartTime + sessionDuration;
                }

                return results;
            } else {
                check = false;
            }
        }
    }

    // let isSessionClashing = isSessionsClashing(_dayType, sessionDay, sessionStartTime, sessionDuration, sessionGroup);
    //
    // if (isSessionClashing){
    //     sessionStartTime = sessionStartTime + sessionDuration;
    //     sessionEndTime = sessionStartTime + sessionDuration;
    //     let results = await occupiedTimeChecking(sessionDay, sessionStartTime, sessionEndTime, sessionDuration, occuTime, occuDay, occuDuration, itr, occupiedTimes, sessionRoom);
    //     return results;
    // } else {
    //     return {day : sessionDay, time : sessionStartTime};
    // }
    return {day : sessionDay, time : sessionStartTime};

}

async function isSessionsClashing(_dayType, _sessionDay, _sessionStartTime, _sessionDuration, _sessionGroup){
    let tempTable;
    let sessionGroup = _sessionGroup;
    let sessionDay = _sessionDay;
    let sessionStartTime = _sessionStartTime;
    let sessionDuration = _sessionDuration;
    let isSessionClashing;

    if (_dayType.toUpperCase() === "Weekday".toUpperCase()){
        tempTable = [...arr_RoomsTable];
    } else {
        tempTable = [...arr_RoomsTableWeekend];
    }

    isSessionClashing = tempTable.filter(obj => obj.day === sessionDay && obj.time === sessionStartTime && obj.groups === sessionGroup);

    if (isSessionClashing.length > 0){
        return true;
    } else {
        return false;
    }
}

// function checkDayAndTime(_occupiedTime, _sessionDay, _sessionTime, _itr){
//     let sessDay = _sessionDay;
//     let sessTime = _sessionTime;
//
//     if((_occupiedTime.day === sessDay) && (_occupiedTime.time.getHours() === sessTime)){
//         sessTime  = sessTime + 1;
//
//         if (sessTime === 17){
//             return {success : false, day: null, time: null, room : null};
//         }
//
//         // if (sessTime === 17){
//         //     if(_itr < 4){
//         //         sessDay = days[_itr + 1];
//         //         sessTime = time.getHours();
//         //     } else {
//         //         return {success : false, day: null, time: null, room : null};
//         //     }
//         // }
//
//         return checkDayAndTime(_occupiedTime, sessDay, sessTime, (_itr+1))
//     } else {
//         return {success: true, day : sessDay, time : sessTime, room : _occupiedTime.room}
//     }
// }
//
// function checkDayAndTimeByLevel(_occupiedTime, _sessionDay, _sessionTime, _itr, _level){
//     let sessDay = _sessionDay;
//     let sessTime = _sessionTime;
//
//     if ((_occupiedTime.day === sessDay) && (_occupiedTime.time.getHours() === sessTime)){
//
//         if (_occupiedTime.lecturerLevel < _level){
//             let index = arr_RoomsTable.findIndex(_occupiedTime);
//             arr_RoomsTable.splice(index, 1)
//
//             return {success : true, removed : _occupiedTime}
//         }
//
//         sessTime = sessTime + 1;
//
//         if (sessTime === 17){
//             if(_itr < 4){
//                 sessDay = days[_itr + 1];
//                 sessTime = time.getHours();
//             } else {
//                 return {success : false, day: null, time: null, room : null};
//             }
//         }
//
//         return checkDayAndTimeByLevel(_occupiedTime, sessDay, sessTime, (_itr+1), _level);
//     }
// }

// function findLecturer(_lecturer, _session) {
//     let time;
//     let selectedRoom = null;
//
//     Lecturers.findOne({fullName : new RegExp('.*' + _lecturer.name + '.*')},
//         (lec_err, lec_result) => {
//
//             if (lec_result.rooms.length > 0){
//                 for (let room of lec_result.rooms){
//
//                     let roomDetails = findRoom(room);
//
//                     if (arr_RoomsTable.length > 0){
//                         let RoomFound = arr_RoomsTable.find(obj => obj.room === room.room);
//
//                         if (RoomFound){
//
//                             let lecturerLevel = RoomFound.lecturerLevel;
//
//                             if(lecturerLevel < lec_result.level){
//                                 let index = arr_RoomsTable.findIndex(RoomFound);
//                                 arr_RoomsTable.splice(index, 1)
//                                 addSessionToRoom(_session, lec_result.level, room);
//
//                                 return;
//                             }
//                         }
//                     }
//                 }
//                 addSessionToRoom(_session, lec_result.level, null);
//             } else {
//
//             }
//         })
//}

// function findRoom(_room){
//
//     Rooms.findOne({room : _room},
//         (err, result) => {
//
//             return result;
//         })
// }

// function addSessionToRoom(_session, _level, _room){
//
//     if (_room !== null){
//         const newSession = new RoomsTable({
//             subject : _session.SubCode + ' - ' +_session.SubName + ' ('+ _session.Tag+')',
//             lecturerName : _session.LecName,
//             lecturerLevel : _level,
//             groups : _session.GroupOrSubGroupName,
//             day : day,
//             time : time
//         })
//     } else {
//         let tag = _session.Tag;
//
//         Rooms.find({type : new RegExp('.*' + tag + '.*')},
//             (err, result) => {
//
//                 for (let room of result){
//                     let findRoom = arr_RoomsTable.find(obj => obj.room === room.room && obj.day )
//                 }
//
//             })
//     }
//
//
//     arr_RoomsTable.push({
//         _room : newSession
//     })
//
//     console.log(arr_RoomsTable)
// }

// const newRoomSession = new RoomsTable({
//     subject : _session.SubCode + ' - ' + _session.SubName + '(' + _session.Tag + ')',
//     lecturerName : _session.LecName,
//     lecturerLevel : lec_result.level,
//     groups :
// })

//{GroupOrSubGroupName : new RegExp('^' + group, 'i')}

/** ----------------------------- get lecturer details --------------------------------------- **/
// await Lecturers.findOne({fullName : new RegExp('.*' + _lecturer + '.*')},
//     async (err, lecturer) => {
//
//         let preferredRooms = lecturer.rooms;
//
//         if (preferredRooms.length > 0){
//             /** ----------------------------- iterate through preferred rooms --------------------------------------- **/
//             for (let preferredRoom of preferredRooms){
//
//                 let occupiedTimes = arr_RoomsTable.filter(obj => obj.room === preferredRoom);
//                 let itr = 0; // iterator to increment days
//                 let sessionRoom = null;
//                 let sessionDay = defaultDay;
//                 let sessionTime = defaultTime;
//
//                 if (occupiedTimes.length > 0){
//
//                     /** ------------------------ iterate through occupied times of a room -------------------------- **/
//                     for (let occupiedTime of occupiedTimes) {
//
//                         let occuTime = occupiedTime.time;
//                         let occuDay = occupiedTime.day;
//                         let occuDuration = occupiedTime.duration;
//                         sessionRoom = occupiedTime.room;
//
//                         let check = true;
//
//                         /** ------------------------ increment day and time of current session -------------------------- **/
//                         while (check){
//                             if ((occuTime === sessionTime) && (occuDay === sessionDay)){
//                                 sessionTime = sessionTime + occuDuration;
//
//                                 if (((sessionTime + _sessionDuration) >= 12.30) && ((sessionTime +_sessionDuration) < 13.30)){
//                                     sessionTime = 13.30;
//                                 } else if ((sessionTime >= 12.30) && (sessionTime < 13.30)){
//                                     sessionTime = 13.30;
//                                 } else if (sessionTime > 16.30){
//                                     itr++;
//                                     sessionDay = days[itr];
//                                     sessionTime = defaultTime;
//                                     //
//                                     // if (sessionDay === undefined){
//                                     //     // sessionDay = defaultDay;
//                                     //     // check = false;
//                                     //     // return {success : false, day : null, time : null, room : null}
//                                     //     break;
//                                     // }
//                                 }
//
//                                 break;
//                             } else {
//                                 check = false;
//                             }
//                         }
//
//                         // let availability = checkDayAndTime(occupiedTime, _sessionDay, _sessionTime, itr);
//                         //
//                         // if (availability.success){
//                         //     sessionRoom = availability.room;
//                         //     sessionDay = availability.day;
//                         //     sessionTime = availability.time;
//                         //
//                         //     // return {success : true, room : sessionRoom, day : sessionDay, time : sessionTime}
//                         // } else {
//                         //     let availabilityByLevel = checkDayAndTimeByLevel(occupiedTime, _sessionDay,
//                         //                                 _sessionTime, itr, lecturer.level);
//                         //
//                         //     if (!availabilityByLevel.success){
//                         //         //success une naththam error message ekak pennanna ona
//                         //         //Success nm ain karpu session eke details nuth enawa eka handle krannath ona
//                         //     }
//                         // }
//
//                     }
//
//                     if (sessionDay !== undefined){
//                         response = {success : true, day : sessionDay, time : sessionTime, room : sessionRoom, level : lecturer.level};
//                         // console.log('195'); console.log(response)
//                         return;
//                     }
//                 } else {
//                     response = {success: true, day: sessionDay, time: sessionTime, room: preferredRoom, level : lecturer.level}
//                     // console.log('200'); console.log(response)
//                     return;
//                 }
//
//             }
//             response = await selectRoomByLevel(preferredRooms, lecturer.level, _sessionDuration);
//             // console.log('206'); console.log(response)
//             if (!response.success){
//                 let rooms = await getRooms(_sessionType);
//                 response = await assignRoom(rooms, _sessionDuration, lecturer.level, "After not getting by level");
//                 // console.log('210'); console.log(response)
//             } else {
//                 arr_RemovedSessions.push(response.removed)
//             }
//
//             // return response;
//         } else {
//             let rooms;
//
//             // await getRooms(_sessionType)
//             //     .then(res => {
//             //         rooms = res;
//             //     })
//             rooms = await getRooms(_sessionType, lecturer.fullName);
//             response = await assignRoom(rooms, _sessionDuration, lecturer.level, lecturer.fullName);
//             // console.log('225'); console.log(response)
//         }
//     })

module.exports = router;
