const mongoose = require('mongoose');

const schema = mongoose.Schema;

const DepartmentSchema = new schema({
    faculty : {
        type: String,
        required: true,
    },
    departments: {
        type: Array,
        required: true,
    }
});

const Department= mongoose.model('Department',DepartmentSchema);

module.exports = Department;
