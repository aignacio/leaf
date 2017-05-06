'use strict';
let portIPv6 = process.env.UDP_PORT_6LOWPAN || 7878;
let hostIPv6 = process.env.UDP_IPV6_6LOWPAN || 'aaaa::1';
let mqttServer = process.env.MQTT_ADDR;
let mqttPort = process.env.MQTT_PORT;
let dgram = require('dgram');
let serverUDP = dgram.createSocket('udp6');
let disableLogs = false;
let mqtt = require('mqtt');
//let IS = require('initial-state');
//let bucket = IS.bucket('Teste', 'n2caJWeGsQOLxX4j4y6xnFogm1rCbn0Q');
let ignore = false;
let unique = require('getmac');
let md5 = require('md5');
let mac = 'undefined';
let connected = false;
let pass_secure = '';
let mqttClient;

unique.getMac(function(err, mac_addr) {
    if (err)
        throw err;
    mac = mac_addr;
    pass_secure = md5(md5(mac).slice(25, 31) + 'homestark' + md5(mac).slice(19, 25));
    mqttClient = mqtt.connect('mqtt://' + mqttServer, {
        clientId: mac,
        username: 'homestark' + mac,
        password: pass_secure,
        port: mqttPort
    });
    mqttClient.on('connect', function() {
        console.log('Conectado ao broker MQTT!');
        mqttClient.subscribe('/' + mac);
        mqttClient.publish('/' + mac + '/info', 'Hello mqtt');
        connected = true;
    });

    mqttClient.on('message', function(topic, message) {
        console.log('[MQTT] Tópico:' + topic + '\n[MQTT] Mensagem:' + message);
    });
});

//bucket.on('error', function(e) {
//    console.log(e);
//});

serverUDP.on('listening', function() {
    var address = serverUDP.address();
    console.log('[UDP - IPV6] Servidor IPv6 ativo end.:' + address.address + ":" + address.port);
});

serverUDP.on('message', processMessage);

serverUDP.bind(portIPv6, hostIPv6);

function processMessage(message, remote) {
    if (!disableLogs)
        console.log('[UDP - IPv6] ' + new Date().toISOString() + ' ' + remote.address + ' Port:' + remote.port + ' - ' + message);
    let dataArray = message.toString().split('|');

    mqttClient.publish('/'+mac+'/'+dataArray[0], message);

    //let formatTemp = dataArray[1].split('C');
    //formatTemp = String(parseInt(formatTemp[0]) / 100) + ' C';
    //bucket.push('Temperatura NTC ' + dataArray[0], formatTemp);
    //bucket.push('Bateria ' + dataArray[0], dataArray[2]);
}
