const mongoose = require('mongoose');

const schema = mongoose.Schema;

const StudentSchema = new schema({
    year : {
        type: String,
        required: true,

    },
    programme:{
        type: String,
        required: true,

    },
    groups:{
        type: String,
        required: true,
        unique:true
    },
    subgroup:{
        type: String,
        required: true,
        unique:true
    },
    groupId:{
        type: String,
        required: true,
        unique:true,

    },
    rooms:{
        type:Array
    },
    times:{
        type:Array
    }
});

const Student= mongoose.model('Student',StudentSchema);

module.exports = Student;
