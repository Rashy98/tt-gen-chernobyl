const bodyParser = require('body-parser');

const express = require('express');
const router = require('express').Router();
let Room= require('../models/Room.model');


const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use('/',router);

router.route('/').get((req, res) => {
    Room.find()
        .then(rooms => res.json(rooms))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Room.findById(req.params.id)
        .then(rooms => res.json(rooms))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    console.log(req.body);
    const building = req.body.building;
    const room = req.body.room;
    const capacity = req.body.capacity;
    const type = req.body.type;
    const newRoom = new Room({building,room,capacity,type});
    newRoom.save()
        .then(() => res.json('Room added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Room.findByIdAndDelete(req.params.id)
        .then(() => res.json('Room deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/update/:id').post((req, res) => {
    Room.findById(req.params.id)
        .then(room => {
            room.building = req.body.building;
            room.room = req.body.room;
            room.capacity = req.body.capacity;
            room.type = req.body.type;

            room.save()
                .then(() => res.json('Room updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/pushTimes').post(function (req,res){
    Room.findOneAndUpdate(
        { _id: req.body._id },
        {
            $push: {
                Unavailable: req.body.Unavailable
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
