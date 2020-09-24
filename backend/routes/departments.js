const bodyParser = require('body-parser');
const express = require('express');
const router = require('express').Router();
let Department= require('../models/Department.model');



const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use('/',router);

router.route('/').get((req, res) => {
    Department.find()
        .then(managers => res.json(managers))
        .catch(err => res.status(400).json('Error: ' + err));
});



module.exports = router;
