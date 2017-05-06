'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let dataValue = new Schema({
    // sensorType: {
    //     type: String,
    //     required: true
    // },
    value: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Sensor6LoWPAN', new Schema({
    alias: {
        type: String,
        required: true,
    },
    ipv6addr: {
        type: String,
        required: true,
        unique: true
    },
    bat: [dataValue],
    temp: [dataValue],
    rssi: [dataValue],
    rota: [dataValue],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}));
