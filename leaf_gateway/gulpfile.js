var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    minifyJs = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    minifyHTML = require('gulp-minify-html'),
    htmlmin = require('gulp-htmlmin'),
    nodemon = require('gulp-nodemon'),
    env = require('gulp-env'),
    cssmin = require('gulp-cssmin'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    localtunnel = require('localtunnel'),
    psi = require('psi'),
    ngrok = require('ngrok'),
    portLocal = 80;

var paths = {
    scripts: '*.*'
};

gulp.task('lint', function() {
    gulp.src(paths.scripts)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('watch', function() {
    gulp.watch([paths.scripts], ['lint','min_js']);
});

gulp.task('envf', function(){
  env({
    vars: {
      ENV: 'dev',
      APPLICATION:'aignacioIoT',
      MQTT_ADDR:'iot.awges.com',
      MQTT_PORT:8080,
      MQTT_TIME_REQ:'30000',
      MONGODB_TIMEOUT: 30000,
      MONGODB_ADDR:'127.0.0.1',
      MONGODB_PORT:27017,
      MONGODB_DATABASE_NAME:'aignacioIoT',
      MONGODB_USER:'aignacio',
      MONGODB_PASSWORD:'aignacio',
      MONGODB_DEBUG: false,
      SECRET_EXP:  'aignacio',
      UDP_PORT_6LOWPAN: 7878,
      UDP_IPV6_6LOWPAN: 'aaaa::1',
      MORGAN_DBG: 'dev',
      TOKEN_EXP: 15, // Tempo de expiração do token em minutos
      PHONE_AWGES:' +55 (51) 30643364',
      DEVELOPER:'Ânderson Ignacio da Silva'
    }
  });
});

gulp.task('dev', function() {
    nodemon({
      script: 'udpIPv6.js'
      // script: 'teste.js'
    });
});

gulp.task('default', ['watch','envf','dev']);
