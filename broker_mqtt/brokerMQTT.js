'use strict';
let mosca = require('mosca');
let config = require('./configBroker');
let server = new mosca.Server(config);
let md5 = require('md5');

let authenticate = function(client, username, password, callback) {
    let authorized = false,
        password_check = md5(md5(client.id).slice(25, 31) + 'homestark' + md5(client.id).slice(19, 25));

    console.log('[MQTT] Client ID:' + client.id + ' / Username:' + username + ' / Senha recebida:' + password);
    if (password_check == password) {
        client.user = username;
        authorized = true;
        console.log('[MQTT] Cliente ' + client.id + ' autorizado a conectar ao broker');
    } else {
        if (username == 'awges' && password == 'loginAWGES4321') {
            authorized = true;
            client.user = username;
            console.log('[MQTT] Cliente ADMIN autorizado a conectar ao broker');
        } else {
            console.log('[MQTT] Cliente ' + client.id + ' não autorizado a conectar no broker');
            console.log('[MQTT] Senha que deveria ter sido utilizada:' + password_check);
        }
    }
    callback(null, authorized);
};

let authorizePublish = function(client, topic, payload, callback) {
    if (client.user == 'awges')
        callback(null, true);
    else
        callback(null, client.id == topic.split('/')[1]);
};

let authorizeSubscribe = function(client, topic, callback) {
    if (client.user == 'awges' || client.user == 'awges_sniffer')
        callback(null, true);
    else
        callback(null, client.id == topic.split('/')[1]);
};

server.on('error', function(err) {
    console.log('[MQTT] ' + err);
});

server.on('ready', function() {
    server.authenticate = authenticate;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;
    console.log('Mosca [MQTT] server is up and running on:'+config.port);
});
