const mongoose = require('mongoose');

const schema = mongoose.Schema;

const GeneratedSessionSchema = new schema({

    GeneratedSessionID : {
        type: String,
        required: true
    },
    GeneratedSession : {
        type: String,
        required: true
    },

})

const GeneratedSession = mongoose.model('GeneratedSession',GeneratedSessionSchema);

module.exports = GeneratedSession;