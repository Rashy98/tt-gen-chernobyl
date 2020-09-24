const mongoose = require('mongoose');

const schema = mongoose.Schema;

const SessionSchema = new schema({

    LecName : {
        type: Array,
        required: true
    },
    SubName : {
        type: String,
        required: true
    },
    SubCode : {
        type: String,
        required: true
    },
    Tag : {
        type: String,
        required: true
    },
    GroupOrSubGroupName : {
        type: String,
        required: true
    },
    NoOfStudents : {
        type: Number,
        required: true
    },
    Duration : {
        type: Number,
        required: true
    },
    times : {
        type: Array,
        default:[]
    },
    ConsecutiveSessionID : {
        type: String,
        default:""
    },
    Rooms : {
        type: Array,
        default:[]
    },
    ParallelSessionID :{
        type: String,
        default:""
    },
    NoOverLapSessionID :{
        type: String,
        default:""
    }
})

const Session = mongoose.model('Session',SessionSchema);

module.exports = Session;