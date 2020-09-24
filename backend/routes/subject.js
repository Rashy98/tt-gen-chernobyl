const bodyParser = require('body-parser');
const express = require('express');
const router = require('express').Router();

const Subject = require('../models/Subject.model');
const {ipcMain } = require('electron');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

router.route('/viewSub').get((req, res) => {
    Subject.find()
        .then(managers => res.json(managers))
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/').get((req, res) => {
    Subject.find()
        .then(managers => res.json(managers))
        .catch(err => res.status(400).json('Error: ' + err));
});
router.route('/addSub').post((req, res) => {
    //console.log(req.body);

    const NewSubject = new Subject({

        offYear: req.body.offYear,
        offSem: req.body.offSem,
        subject: req.body.subject,
        subjectCode: req.body.subjectCode,
        lecHr: req.body.lecHr,
        tutHr: req.body.tutHr,
        labHr: req.body.labHr,
        eveHr: req.body.eveHr

    });

    NewSubject.save()
        .then(() => res.json('Subject Details added!'))
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/getSub').get((req, res) =>{

    Subject.findOne({subjectCode: req.body.subjectCode})
        .then(result => {
            if(result){
                return res.status(200).json({success: true, result: result})
            } else {
                return res.status(400).json({success: false, result: result})
            }

        })
});

router.route('/:id').delete((req, res) => {
    Subject.findByIdAndDelete(req.params.id)
        .then(() => res.json('Subject Details deleted.'))
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/:id').get((req, res) => {
    Subject.findById(req.params.id)
        .then(sub => res.json(sub))
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/update/:id').post((req, res) => {
    Subject.findById(req.params.id)
        .then(subject => {
            subject.offYear = req.body.offYear;
            subject.offSem = req.body.offSem;
            subject.subject = req.body.subject;
            subject.subjectCode = req.body.subjectCode;
            subject.lecHr = req.body.lecHr;
            subject.tutHr = req.body.tutHr;
            subject.labHr =req.body.labHr;
            subject.eveHr = req.body.eveHr;

            subject.save()
                .then(() => res.json('Subject Details updated!'))
                .catch(err => res.status(400).json({success: false, err: err}));
        })
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/pushRooms').post(function (req,res){
    Subject.findOneAndUpdate(
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

module.exports = router;
