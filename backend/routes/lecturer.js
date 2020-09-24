const bodyParser = require('body-parser');
const express = require('express');
const router = require('express').Router();

let Lecturer = require("../models/Lecturer.model");
const {ipcMain } = require('electron');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


router.route('/').get((req, res) => {
    Lecturer.find()
        .then(lecturers => res.json(lecturers))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/viewLec').get((req, res) => {
    Lecturer.find()
        .then(managers => res.json(managers))
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/addLec').post((req, res) => {
    // console.log(req.body);

    const newLecturer = new Lecturer({
        empID: req.body.empID,
        fullName: req.body.fullName,
        faculty: req.body.faculty,
        department: req.body.department,
        center: req.body.center,
        building: req.body.building,
        level:req.body.level,
        rank:req.body.rank
    });
    console.log(newLecturer);

    newLecturer.save()
        .then(() => res.json({success: true, msg:'LecturerNA Details added!'}))
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/getLec').get((req, res) =>{

    Lecturer.findOne({empID: req.body.empID})
        .then(result => {
            if(result){
                return res.status(200).json({success: true, result: result})
            } else {
                return res.status(400).json({success: false, result: result})
            }

        })
});

router.route('/:id').delete((req, res) => {
    Lecturer.findByIdAndDelete(req.params.id)
        .then(() => res.json('LecturerNA Details deleted.'))
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/:id').get((req, res) => {
    Lecturer.findById(req.params.id)
        .then(lec => res.json(lec))
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/update/:id').post((req, res) => {
    Lecturer.findById(req.params.id)
        .then(lecturer => {
            lecturer.fullName = req.body.fullName;
            lecturer.faculty = req.body.faculty;
            lecturer.department = req.body.department;
            lecturer.center = req.body.center;
            lecturer.building = req.body.building;
            lecturer.level = req.body.level;
            lecturer.rank = req.body.rank;
            lecturer.save()
                .then(() => res.json('Lecturer Details updated!'))
                .catch(err => res.status(400).json({success: false, err: err}));
        })
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/pushRooms').post(function (req,res){
    Lecturer.findOneAndUpdate(
        { _id: req.body._id },
        {
            $push: {
                rooms: req.body.rooms
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
    Lecturer.findOneAndUpdate(
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


module.exports = router;
