const bodyParser = require('body-parser');
const express = require('express');
const router = require('express').Router();

let WorkingDays = require('../models/WorkingDays.model');

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


/* ************************************************************************************************************** */
/* ----------------------                    Add working days and hours               --------------------------  */
/* ************************************************************************************************************** */
router.route('/add').post((req, res) => {

    WorkingDays.findOne({dayType : req.body.dayType},
    (err, days) => {

        let duplicate = false;

        if((days !== null) && (days.dayType === req.body.dayType)){
            duplicate = true;
        }

        if(duplicate){
            return res.json({success : false, err : "duplicated"});
        } else {
            const newDay = new WorkingDays({
                dayType : req.body.dayType,
                noOfDays : req.body.noOfDays,
                workingDays : req.body.workingDays,
                workingHours : {
                    hours : req.body.workingHours.hours,
                    minutes : req.body.workingHours.minutes
                },
                workingTimeSlot : req.body.workingTimeSlot
            });

            newDay.save()
                .then(() => res.json({success : true, msg:'Day Added'}))
                .catch(err => res.status(400).json({success : false, err : err}));
        }
    })

});


/* ************************************************************************************************************** */
/* ----------------------                    Get working days and hours               --------------------------  */
/* ************************************************************************************************************** */
router.route('/get').get((req, res) =>{

   WorkingDays.findOne({dayType : req.query.dayType})
    .then(result => {

        if(result){
            return res.status(200).json({success : true, result : result})
        } else {
            return res.status(400).json({success : false, result : result})
        }
    })
});


/* ************************************************************************************************************** */
/* ----------------------                 Delete working days and hours               --------------------------  */
/* ************************************************************************************************************** */
router.route('/delete').post((req, res) => {

    console.log(req.body)

    console.log(req.body.dayType);
    WorkingDays.findOneAndDelete({dayType : req.body.dayType})
        .then(result => {
            console.log(result)
            if(result){
                return res.status(200).json({success : true, result : result})
            } else {
                return res.status(400).json({success : false, result : result})
            }
        })
});


/* ************************************************************************************************************** */
/* ----------------------                 Update working days and hours               --------------------------  */
/* ************************************************************************************************************** */
router.route('/update').put((req, res) => {

    WorkingDays.findOneAndUpdate(
        {   dayType : req.body.dayType },
        {   dayType : req.body.dayType,
            noOfDays : req.body.noOfDays,
            workingDays : req.body.workingDays,
            workingHours : {
                hours : req.body.workingHours.hours,
                minutes : req.body.workingHours.minutes
            },
            workingTimeSlot : req.body.workingTimeSlot
       }
    )
        .then(result => {

            if(result){
                return res.status(200).json({success : true, result : result})
            } else {
                return res.status(400).json({success : false, result : result})
            }
        })
});
module.exports = router;
