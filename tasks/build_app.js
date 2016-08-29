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
var bowerDir = jetpack.cwd('./bower_components');

// Define dependant tasks
gulp.task('cleanStyles', function () {
    return destDir.dirAsync('stylesheets', { empty: true });
});

gulp.task('cleanFonts', function () {
    return destDir.dirAsync('fonts', { empty: true });
});

// Define main tasks
gulp.task('bundle', function () {
    return Promise.all([
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        bundle(srcDir.path('app.js'), destDir.path('app.js')),
    ]);
});

gulp.task('less', ['cleanStyles', 'cleanFonts'], function () {
    var plumbApplicationStyles = function () {
        return gulp.src(srcDir.path('stylesheets/main.less'))
            .pipe(plumber())
            .pipe(less())
            .pipe(gulp.dest(destDir.path('stylesheets')));
    };

    var plumbBowerStyles = function () {
        var plumbAngularStyles = function () {
            return projectDir.copyAsync(bowerDir.path('angular'), destDir.path('stylesheets'), {
                overwrite: true,
                matching: ['*.css']
            });
        };

        var plumbAngularBootstrapStyles = function () {
            return projectDir.copyAsync(bowerDir.path('angular-bootstrap'), destDir.path('stylesheets'), {
                overwrite: true,
                matching: ['*.css']
            });
        };

        var plumbAngularToastrStyles = function () {
            return projectDir.copyAsync(bowerDir.path('angular-toastr/dist'), destDir.path('stylesheets'), {
                overwrite: true,
                matching: ['*.css']
            });
        };

        var plumbBootstrapStyles = function () {
            return projectDir.copyAsync(bowerDir.path('bootstrap/dist/css'), destDir.path('stylesheets'), {
                overwrite: true,
                matching: ['*.css']
            });
        };

        var plumbFontAwesomeStyles = function () {

            return projectDir.copyAsync(bowerDir.path('font-awesome/fonts'), destDir.path('fonts'), {
                overwrite: true
            }) && projectDir.copyAsync(bowerDir.path('font-awesome/css'), destDir.path('stylesheets'), {
                overwrite: true,
                matching: ['*.css']
            });
        };
        return plumbAngularStyles() && plumbAngularBootstrapStyles() && plumbAngularToastrStyles() && plumbBootstrapStyles() && plumbFontAwesomeStyles();
    };
    return plumbApplicationStyles() && plumbBowerStyles();
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

gulp.task('build', ['bundle', 'less', 'environment']);
