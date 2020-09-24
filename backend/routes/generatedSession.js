const bodyParser = require('body-parser');
const express = require('express');
const router = require('express').Router();

let GenSession = require('../models/GeneratedSession.model');

const {ipcMain } = require('electron');

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

router.route('/viewGeneratedSession').get((req, res) => {
    GenSession.find()
        .then(session => res.json(session))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/addGeneratedSession').post((req, res) => {

    const NewGeneratedSession = new GenSession({
        GeneratedSessionID: req.body.GeneratedSessionID,
        GeneratedSession: req.body.GeneratedSession
    });
    console.log(NewGeneratedSession);

    NewGeneratedSession.save()
        .then(() => res.json({success: true}))
        .catch(err => res.status(400).json({success: false, err: err}));
});

router.route('/getGeneratedSession').get((req, res) =>{

    GenSession.findOne()
        .then(result => {
            if(result){
                return res.status(200).json({success: true, result: result})
            } else {
                return res.status(400).json({success: false, result: result})
            }

        })
});

module.exports = router;