'use strict';

let mongoose = require('mongoose');
let colors = require('colors/safe');
let timeoutRetry   = process.env.MONGODB_TIMEOUT || 30000;
let address        = process.env.MONGODB_ADDR || '127.0.0.1';
let portmong       = process.env.MONGODB_PORT || '27017';
let application    = process.env.MONGODB_DATABASE_NAME || 'teste';
let userAccess     = process.env.MONGODB_USER || 'awges';
let passAccess     = process.env.MONGODB_PASSWORD || 'paradoxo3102230';
let dbgMongoose    = process.env.MONGODB_DEBUG || false;
let db;

mongoose.Promise = global.Promise;

/*************************************************************************/
module.exports = function(){
	mongoose.set('debug', false);

	let MONGO = {
		server: address,
    port: portmong,
    db: application,
    user: userAccess,
    pass: passAccess,
    connectionString : function(){
    	return 'mongodb://'+this.user+':'+this.pass+'@'+this.server+':'+this.port+'/'+this.db;
    }
	};

	let uri = MONGO.connectionString();

	let connectWithRetry = function() {
		return mongoose.connect(uri, MONGO.options, function(err) {
			if (err) {
			  console.error('[Mongoose]: Erro ao conectar ['+err+'], tentando conectar novamente em ' + timeoutRetry/1000 + ' segundos');
			  setTimeout(connectWithRetry, timeoutRetry);
			}
		});
	};

	connectWithRetry();

	db = mongoose.connection;

	db.on('connecting', function(){
		console.log('[Mongoose]: Tentando conector ao MongoDB...'+uri);
	});

	db.on('connected', function(){
		// console.log('[Mongoose]: Conectado em '+uri);
	});

	db.on('disconnected', function(){
		console.log('[Mongoose]: Desconectado em '+uri);
    setTimeout(connectWithRetry, timeoutRetry);
	});

	db.once('open', function() {
  	console.log('[Mongoose]: Conexão efetuada com sucesso: '+uri);
	});

	db.on('reconnected', function () {
    console.log('[Mongoose]: Reconexão ao MongoDB: '+uri);
	});

	db.on('error', function(a1){
		console.log('[Mongoose]: Erro na conexão: '+uri);
		console.log(a1);
    	mongoose.disconnect();
	});

	process.on('SIGINT', function(){
		mongoose.connection.close(function(){
			console.log('[Mongoose]: Desconectado pelo término da aplicação');
			process.exit(0);
		});
	});
};
