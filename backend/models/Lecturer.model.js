const mongoose = require('mongoose');

const schema = mongoose.Schema;

const LecturerSchema = new schema({

    empID : {
        type: String,
        required: true
    },
    fullName : {
        type: String,
        required: true
    },
    faculty : {
        type: String,
        required: true
    },
    department : {
        type: String,
        required: true
    },
    center : {
        type: String,
        required: true
    },
    building : {
        type: String,
        required: true
    },
    level : {
        type: Number,
        required: true
    },
    rank : {
        type: Number,
        required: true
    },
    rooms:{
        type:Array
    },
    times:{
        type:Array
    }
});

const Lecturer= mongoose.model('Lecturer',LecturerSchema);

module.exports = Lecturer;
