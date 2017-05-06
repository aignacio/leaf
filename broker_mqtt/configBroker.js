'use strict';
let mosca = require('mosca');
let addressDB = process.env.MONGODB_ADDR || '127.0.0.1';
let portmongDB = process.env.MONGODB_PORT || '27017';
let moscaUser = process.env.MOSCA_USER || 'mosca';
let moscaPass = process.env.MOSCA_PASS || 'moscaAWGES';
let moscaID = process.env.MOSCA_ID || 'moscaAWGES';
let moscaPortMQTT = process.env.MOSCA_PORT || 8080;

module.exports = {
  id: moscaID,
  stats: false,
  logger: {
    level : 'error'
  },
  port : Number(moscaPortMQTT),
  backend: {
    type: 'mongodb',
    url: 'mongodb://'+moscaUser+':'+moscaPass+'@'+addressDB+':'+portmongDB+'/Mosca'
  },
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://'+moscaUser+':'+moscaPass+'@'+addressDB+':'+portmongDB+'/Mosca'
  }
};
