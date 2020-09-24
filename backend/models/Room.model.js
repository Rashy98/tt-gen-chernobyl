const mongoose = require('mongoose');

const schema = mongoose.Schema;

const RoomSchema = new schema({
    building : {
        type: String,
        required: true,
        unique:true,
    },
    room:{
        type: String,
        required: true,
        unique:true
    },
    capacity:{
        type: Number,
        required: true,
        unique:true
    },
    type:{
        type: String,
        required: true,
    },
    Unavailable:{
        type:Array
    }
});

const Room= mongoose.model('Room',RoomSchema);

module.exports = Room;
