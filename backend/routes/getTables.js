const bodyParser = require('body-parser');
const express = require('express');
const router = require('express').Router();

let RoomsTable = require('../models/RoomsTable.model');

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

// router.route('/getLecturerTable').get(async (req, res) => {
//     arr_tempTable = await RoomsTable.find();
//
//     if (arr_tempTable.length > 0){
//
//         for (let tempSession of arr_tempTable){
//             let lecturerArray = tempSession.lecturerName;
//             let lecturerNames = '';
//
//             for (let lecturer of lecturerArray){
//                 lecturerNames = lecturerNames + lecturer + "\n";
//             };
//
//             const studentTable = {
//                 subject : tempSession.subject,
//                 group : tempSession.groups,
//                 room : tempSession.room,
//                 lecturer : lecturerNames
//             };
//
//             arr_table.push(studentTable);
//         }
//
//         return res.status(200).json({success : true, table : arr_table})
//     } else {
//         return res.status(400).json({success : false, msg : "Cannot Get Student Table"})
//     }
// })

// router.route('/getRoomsTable').get(async (req, res) => {
//     arr_tempTable = await RoomsTable.find();
//
//     if (arr_tempTable.length > 0){
//
//         for (let tempSession of arr_tempTable){
//             let lecturerArray = tempSession.lecturerName;
//             let lecturerNames = '';
//
//             for (let lecturer of lecturerArray){
//                 lecturerNames = lecturerNames + lecturer + "\n";
//             };
//
//             const studentTable = {
//                 subject : tempSession.subject,
//                 group : tempSession.groups,
//                 room : tempSession.room,
//                 lecturer : lecturerNames
//             };
//
//             arr_table.push(studentTable);
//         }
//
//         return res.status(200).json({success : true, table : arr_table})
//     } else {
//         return res.status(400).json({success : false, msg : "Cannot Get Student Table"})
//     }
// })

module.exports = router;