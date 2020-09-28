const {MongoClient} = require('mongodb');
const bodyParser =require( "body-parser");
const mongoose = require('mongoose');
const express = require('express');
const port = process.env.PORT || 8000;
const app = express();
const router = require('express').Router();


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
const path = require("path");
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

const Building = require('./routes/buildings');
const Room = require('./routes/rooms');
const AddTag = require('./routes/tags');
const AddStudent = require('./routes/students');

const AddLecturer = require('./routes/lecturer');
const Department = require('./routes/departments');
const AddSubject = require('./routes/subject');
const Student = require('./routes/students');
const Session = require('./routes/session');
const GenSession = require('./routes/generatedSession');

app.use('/workingdays', require('./routes/workingDays'));
app.use('/generateTable', require('../backend/routes/generateTimeTable'));
app.use('/table', require('../backend/routes/getTables'));
app.use('/building', Building);
app.use('/room',Room);
app.use('/tag', AddTag);
app.use('/students', AddStudent);
app.use('/lecturer', AddLecturer);
app.use('/subject', AddSubject);
app.use('/department',Department);
app.use('/session',Session);
app.use('/generatedSession',GenSession);


const uri = process.env.ATLAS_URI;
mongoose.connect("mongodb+srv://admin:admin@spmfinalproj.zvpc2.mongodb.net/TimeTableGen?retryWrites=true&w=majority", { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Mongo database Successfully connected");
})
app.listen(port, () => {
    console.log(`Server is running on port:  ${port}`);
})
//
// require("http").createServer(function (req, res) {
//     res.end("Hello from server started by Electron app!");
// }).listen(${port})
// let server = app.listen(port, function () {
//     console.log('Express server listening on port ' + server.address().port);
// });


