const bodyParser = require('body-parser');

const express = require('express');
const router = require('express').Router();
let Building = require('../models/Building.model');
const {ipcMain } = require('electron');


const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use('/',router);

router.route('/').get((req, res) => {
    Building.find()
        .then(managers => res.json(managers))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    console.log(req.body);
    const building = req.body.building;
    const newBuilding = new Building({building});
    newBuilding.save()
        .then(() => res.json('Building added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Building.findByIdAndDelete(req.params.id)
        .then(() => res.json('Building deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/update/:id').post((req, res) => {
    Building.findById(req.params.id)
        .then(building => {
            building.building = req.body.building;
            building.save()
                .then(() => res.json('Building updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
