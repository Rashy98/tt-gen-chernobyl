const mongoose = require('mongoose');

const schema = mongoose.Schema;

const SubjectSchema = new schema({

    offYear : {
        type: String,
        required: true
    },

    offSem : {
        type: String,
        required: true
    },

    subject : {
        type: String,
        required: true
    },

    subjectCode : {
        type: String,
        required: true
    },

    lecHr : {
        type: Number,
        required: true
    },

    tutHr : {
        type: Number,
        required: true
    },

    labHr : {
        type: Number,
        required: true
    },

    eveHr : {
        type: Number,
        required: true
    },
    rooms:{
        type:Array
    }
});

const Subject= mongoose.model('Subject',SubjectSchema);

module.exports = Subject;
