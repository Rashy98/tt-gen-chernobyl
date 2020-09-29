const bodyParser = require('body-parser');
const express = require('express');
const router = require('express').Router();

let RoomsTable = require('../models/RoomsTable.model');
let WorkingDays = require('../models/WorkingDays.model');
let Sessions = require('../models/Session.model');
let Lecturer = require('../models/Lecturer.model');
let Rooms = require('../models/Room.model')

let arr_table = []
let arr_tempTable = []

router.route('/getTable').get(async (req, res) => {

    arr_tempTable = await RoomsTable.find();

    if (arr_tempTable.length > 0){

        for (let tempSession of arr_tempTable){
            let lecturerArray = tempSession.lecturerName;
            let lecturerNames = '';

            for (let lecturer of lecturerArray){
                lecturerNames = lecturerNames + lecturer + "\n";
            };

            const studentTable = {
                subject : tempSession.subject,
                group : tempSession.groups,
                room : tempSession.room,
                lecturer : lecturerNames,
                day : tempSession.day,
                time : tempSession.time,
                duration : tempSession.duration,
                session : tempSession.session
            };

            arr_table.push(studentTable);
        }

        return res.status(200).json({success : true, table : arr_table})
    } else {
        return res.status(400).json({success : false, msg : "Cannot Get Student Table"})
    }
})

router.route('/getWorkingDays').get(async (req, res) => {

    let workingDays = await WorkingDays.find();

    if (workingDays){
        return res.status(200).json({success : true, workingDays : workingDays})
    } else {
        return res.status(400).json({success : false, msg : "Cannot Read Working Days"})
    }
})

router.route('/getGroups').get(async (req, res) => {

    let groups = await Sessions.aggregate([{
        $group : {
            _id : {GroupOrSubGroupName: "$GroupOrSubGroupName"}
        }
    }]);

    if (groups) {
        return res.json({success : true, groups : groups});
    } else {
        return res.json({success : false, msg : "Cannot Read Groups"});
    }
})

router.route('/getLecturers').get(async (req, res) => {

    let lecturers = await Lecturer.find();

    if (lecturers) {
        return res.json({success : true, lecturers : lecturers});
    } else {
        return res.json({success : false, msg : "Cannot Read Groups"});
    }
})

router.route('/getRooms').get(async (req, res) => {

    let rooms = await Rooms.find();

    if (rooms){
        return res.status(200).json({success : true, rooms : rooms});
    } else {
        return res.status(200).json({success : false, rooms : rooms})
    }
})

module.exports = router;