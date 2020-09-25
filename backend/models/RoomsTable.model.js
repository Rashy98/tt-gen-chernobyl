const mongoose = require('mongoose');

const schema = mongoose.Schema;

const RoomTableSchema = new schema({

    room : {
        type : String,
        required : true
    },
    subject : {
        type: String,
        required: true,
    },
    lecturerName : {
        type: Array,
        required: true,
    },
    lecturerLevel : {
      type : Number,
      required : true,
    },
    groups : {
        type: String,
        required: true,
    },
    day : {
        type : String,
        required : true,
    },
    time : {
        type : Number,
        required : true,
    },
    duration : {
        type : Number,
        required : true
    },
    session : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('GeneratedTables',RoomTableSchema);