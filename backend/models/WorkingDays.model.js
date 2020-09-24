const mongoose = require('mongoose');
const schema = mongoose.Schema;

const WorkingDaysSchema = new schema({
    dayType : {
        type : String,
        required : true
    },
    noOfDays : {
        type: Number,
        required: true
    },
    workingDays : {
        type: Array,
        default : [],
        required: true
    },
    workingHours : {
        hours : { type: Number, required : true},
        minutes : { type : Number, required : true}
    },
    workingTimeSlot : {
        type : String,
        required : true
    }
});

const WorkingDays = mongoose.model('WorkingDays',WorkingDaysSchema);
module.exports = WorkingDays;