'use strict';
let portIPv6 = process.env.UDP_PORT_6LOWPAN || 7878;
let hostIPv6 = process.env.UDP_IPV6_6LOWPAN || 'aaaa::1';
let dgram = require('dgram');
let serverUDP = dgram.createSocket('udp6');
let sensorModel = require('./models/ipv6Sensor');
let disableLogs = true;
let mongo = require('./dbMongo');

mongo();

// sensorModel.findById("58f8f5d14ca1866b2ff2bae2")
//     .select({
//         "rssi": {
//             "$slice": -1
//         }
//     })
//     .exec(function(err, sensors) {
//         console.log(sensors);
//     });
let query = {
  "rssi": {"$slice": -1},
  "temp": {"$slice": -1},
  "bat": {"$slice": -1}
};
sensorModel.findById("58f8f5d14ca1866b2ff2bae2")
    .select(query)
    .exec(function(err, sensors) {
        console.log(sensors);
    });
