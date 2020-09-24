const mongoose = require('mongoose');

const schema = mongoose.Schema;

const BuildingSchema = new schema({
    building : {
        type: String,
        required: true,
        unique:true,
    }
});

const Building= mongoose.model('Building',BuildingSchema);

module.exports = Building;
