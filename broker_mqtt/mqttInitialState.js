'use strict';
let mqtt = require('mqtt');
let md5 = require('md5');
let unique = require('getmac');
let mqttClient;
let mqtt_server = 'iot.awges.com';
let mac = 'undefined';
let connected = false;
let pass_secure = '';
let portMQTT = 8080;
let timePublicISIndividual = 1500; // Há DUAS limitações no Initial State, 25k publicações por mês e no máximo uma req. por segundo da API, logo iremos publicar 14 mensagens intervaladas de 1.5 segundos a cada 24 minutos, somando um total de 25.200,00 mensagens por mês aproximadamente
let timePublicIS = 1000 * 60 * 25;
let IS = require('initial-state');
let bucket = IS.bucket('Salas Limpas - ITT Chip', 'UBqUyD0bzJ3dyCbetn6xwIpoVjsjmn4U');
let sensores6LoWPAN = [];
let sensorsLength = 0;
let sensorType = 2;

setTimeout(publicInitialState, timePublicIS);

function publicInitialState() {
  setTimeout(publicInitialState, timePublicIS);

  sensorType = 2;
  sensorsLength = sensores6LoWPAN.length;
  console.log('Enviando dados de temperatura...');
  setTimeout(publicIndividualIS, timePublicISIndividual);
}

function publicIndividualIS() {
  if (sensorType == 2) {
    sensorsLength = sensorsLength - 1;
    if (sensorsLength >= 0) {
      // console.log('Sensor:['+sensorsLength+'] '+sensores6LoWPAN[sensorsLength]);
      let temp = (Number(String(sensores6LoWPAN[sensorsLength].temp).split('C')[0]) / 100 + 2.1).toFixed(2);
      temp = String(temp) + ' C';
      bucket.push('Temp.-'+sensores6LoWPAN[sensorsLength].id, temp);
      setTimeout(publicIndividualIS, timePublicISIndividual);
      console.log('Enviando ao initial-state os dados: ['+sensores6LoWPAN[sensorsLength].id+'] - '+temp);
    }
    else {
      console.log('Enviando dados de bateria...');
      sensorsLength = sensores6LoWPAN.length;
      sensorType = sensorType - 1;
      setTimeout(publicIndividualIS, timePublicISIndividual);
    }
  }
  else if (sensorType == 1) {
    sensorsLength = sensorsLength - 1;
    if (sensorsLength >= 0) {
      // console.log('Sensor:['+sensorsLength+'] '+sensores6LoWPAN[sensorsLength]);
      let bat = sensores6LoWPAN[sensorsLength].bat;
      bucket.push('Bat.-'+sensores6LoWPAN[sensorsLength].id, bat);
      setTimeout(publicIndividualIS, timePublicISIndividual);
      console.log('Enviando ao initial-state os dados: ['+sensores6LoWPAN[sensorsLength].id+'] - '+bat);
    }
    else {
      sensorType = 0;
    }
  }
}

unique.getMac(function(err, mac_addr) {
  if (err)
    throw err;
  mac = mac_addr;
  pass_secure = md5(md5(mac).slice(25, 31) + 'homestark' + md5(mac).slice(19, 25));

  mqttClient = mqtt.connect('mqtt://' + mqtt_server, {
    clientId: mac,
    username: 'awges_sniffer',
    password: pass_secure,
    port: portMQTT
  });

  mqttClient.on('message', function(topic, message) {
    let dados = String(message).split('|'),
      newSensor = true,
      sensor;

    for (var i = 0; i < sensores6LoWPAN.length; i++) {
      if (sensores6LoWPAN[i].id == dados[0]) {
        sensores6LoWPAN[i].temp = dados[1];
        sensores6LoWPAN[i].bat = dados[2];
        newSensor = false;
        break;
      }
    }

    if (newSensor) {
      sensor = {
        'id': dados[0],
        'temp': dados[1],
        'bat': dados[2]
      };
      sensores6LoWPAN.push(sensor);
    }
  });

  mqttClient.on('connect', function() {
    console.log('Conectado ao broker MQTT!');
    mqttClient.subscribe('#');
    // mqttClient.publish('/' + mac + '/info', 'Publicador de sniffer no initial state ok!');
    connected = true;
  });
});
