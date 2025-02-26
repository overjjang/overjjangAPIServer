const mongoose = require('mongoose');
const stream = require("node:stream");
const string_decoder = require("node:string_decoder");
// const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const serverHistorySchema = new Schema({
    serverName: {
        type: String
    },
    date :{
        type: Date
    },
    history:[{
        isServerOn: {
            type: Boolean,
            required: true
        },
        userCount: {
            type: Number,
            required: true
        },
        time: {
            type: Date,
            default: Date.now
        },
        type: Object
    }]
});

module.exports = mongoose.model('serverState', serverHistorySchema);