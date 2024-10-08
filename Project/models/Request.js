const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requestId: {
        type:String, 
        unique:true,
        required:true
    },
    status: {
        type:String,
        enum: ['pending', 'processing', 'completed'],
        default:'pending'
    },
});

module.exports = mongoose.model('Request', requestSchema);