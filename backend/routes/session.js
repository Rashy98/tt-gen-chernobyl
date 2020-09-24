const bodyParser = require('body-parser');
const express = require('express');
const router = require('express').Router();

let Session = require('../models/Session.model');

const {ipcMain } = require('electron');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

router.route('/viewSession').get((req, res) => {
    Session.find()
        .then(session => res.json(session))
        .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/addSession').post((req, res) => {

    const newSession = new Session({
         LecName: req.body.LecName,
         SubName: req.body.SubName,
         SubCode:req.body.SubCode,
         Tag: req.body.Tag,
         GroupOrSubGroupName: req.body.GroupOrSubGroupName,
         NoOfStudents: req.body.NoOfStudents,
         Duration:req.body.Duration,
         times:req.body.times,
         ConsecutiveSessionID:req.body.ConsecutiveSessionID,
         ParallelSessionID:req.body.ParallelSessionID,
         NoOverLapSessionID:req.body.NoOverLapSessionID,
         Rooms:req.body.Rooms
    });
    console.log(newSession);

    newSession.save()
        .then(() => res.json({newSession}))
        .catch(err => res.status(400).json({success: false, err: err}));
});


router.route('/pushRooms').post(function (req,res){
    Session.findOneAndUpdate(
        { _id: req.body._id },
        {
            $push: {
                Rooms: req.body.rooms
            },
        }
    )
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error(err);
        });
});
router.route('/pushTimes').post(function (req,res){
    Session.findOneAndUpdate(
        { _id: req.body._id },
        {
            $push: {
                times: req.body.times
            },
        }
    )
        .then(doc => {
            res.send(doc);
        })
        .catch(err => {
            console.error(err);
        });
});
router.route('/pushParSession').post(function (req,res){
    Session.findById(req.body._id)
        .then(session => {
            session.ParallelSessionID = req.body.ParallelSessionID;
            session.save()
                .then(() => res.json('Session Details updated!'))
                .catch(err => res.status(400).json({success: false, err: err}));
        })
        .catch(err => res.status(400).json({success: false, err: err}));
});
router.route('/pushParSession1').post(function (req,res){
    Session.findById(req.body._id)
        .then(session => {
            session.ParallelSessionID = req.body.ParallelSessionID;
            session.save()
                .then(() => res.json('Session Details updated!'))
                .catch(err => res.status(400).json({success: false, err: err}));
        })
        .catch(err => res.status(400).json({success: false, err: err}));
});
router.route('/pushConSession').post(function (req,res){
    Session.findById(req.body._id)
        .then(session => {
            session.ConsecutiveSessionID = req.body.ConsecutiveSessionID;
            session.save()
                .then(() => res.json('Session Details updated!'))
                .catch(err => res.status(400).json({success: false, err: err}));
        })
        .catch(err => res.status(400).json({success: false, err: err}));
});
router.route('/pushConSession1').post(function (req,res){
    Session.findById(req.body._id)
        .then(session => {
            session.ConsecutiveSessionID = req.body.ConsecutiveSessionID;
            session.save()
                .then(() => res.json('Session Details updated!'))
                .catch(err => res.status(400).json({success: false, err: err}));
        })
        .catch(err => res.status(400).json({success: false, err: err}));
});
router.route('/pushOvrSession').post(function (req,res){
    Session.findById(req.body._id)
        .then(session => {
            session.NoOverLapSessionID = req.body.NoOverLapSessionID;
            session.save()
                .then(() => res.json('Session Details updated!'))
                .catch(err => res.status(400).json({success: false, err: err}));
        })
        .catch(err => res.status(400).json({success: false, err: err}));
});
router.route('/pushOvrSession1').post(function (req,res){
    Session.findById(req.body._id)
        .then(session => {
            session.NoOverLapSessionID = req.body.NoOverLapSessionID;
            session.save()
                .then(() => res.json('Session Details updated!'))
                .catch(err => res.status(400).json({success: false, err: err}));
        })
        .catch(err => res.status(400).json({success: false, err: err}));
});
// router.route('/getSessionBySubName').get((req, res) =>{
//
//     Session.findOne({SubName: req.body.SubName})
//         .then(result => {
//             if(result){
//                 return res.status(200).json({success: true, result: result})
//             } else {
//                 return res.status(400).json({success: false, result: result})
//             }
//
//         })
// });




module.exports = router;
