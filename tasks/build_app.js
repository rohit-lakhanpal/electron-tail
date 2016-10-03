'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');
var bundle = require('./bundle');
var utils = require('./utils');

var projectDir = jetpack;
var srcDir = jetpack.cwd('./src');
var destDir = jetpack.cwd('./app');

gulp.task('bundle', function () {
    return Promise.all([
        // Bundle the background.js script
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        
        // The following line is commented out as the app.js will have note integration switched off and will not require bundling
        // bundle(srcDir.path('app.js'), destDir.path('app.js')),

        // Preload is used in the renderer process & hence needs bundling 
        bundle(srcDir.path('helpers/preload.js'), destDir.path('js/preload.js')),   
        bundle(srcDir.path('tail.js'), destDir.path('js/tail.js')),    
    ]);
});

gulp.task('less', function () {
    return gulp.src(srcDir.path('stylesheets/*.less'))
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(destDir.path('stylesheets')));
});

gulp.task('environment', function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'), { overwrite: true });
});

gulp.task('watch', function () {
    var beepOnError = function (done) {
        return function (err) {
            if (err) {
                utils.beepSound();
            }
            done(err);
        };
    };

    watch('src/**/*.js', batch(function (events, done) {
        gulp.start('bundle', beepOnError(done));
    }));
    watch('src/**/*.less', batch(function (events, done) {
        gulp.start('less', beepOnError(done));
    }));
});

gulp.task('build', ['bundle', 'less', 'environment', 'deps', 'css-override']);
