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

gulp.task('js-clean', function (){
    return destDir.dir('lib', { empty: true });
});

gulp.task('css-clean', function () {    
     return destDir.dir('stylesheets', { empty: true }); 
});

gulp.task('fonts-clean', function () {    
     return destDir.dir('fonts', { empty: true }); 
});

gulp.task('clean', ['js-clean', 'css-clean', 'fonts-clean']);

gulp.task('js-angular', function () {    
    return projectDir.copyAsync('bower_components/angular', 'app/lib/angular', {
        overwrite: true,
        matching: '*.min.js'       
    });    
});

gulp.task('js-angular-bootstrap', function () {    
    return projectDir.copyAsync('bower_components/angular-bootstrap', 'app/lib/angular-bootstrap', {
        overwrite: true,
        matching: '*.min.js'       
    });    
});

gulp.task('js-angular-bootstrap', function () {    
    return projectDir.copyAsync('bower_components/angular-bootstrap', 'app/lib/angular-bootstrap', {
        overwrite: true,
        matching: '*.min.js'       
    });    
});

gulp.task('js-angular-toastr', function () {    
    return projectDir.copyAsync('bower_components/angular-toastr/dist', 'app/lib/angular-toastr', {
        overwrite: true,
        matching: '*.js'       
    });    
});

gulp.task('scripts', ['js-angular', 'js-angular-bootstrap', 'js-angular-toastr']);

gulp.task('css-angular', function () {    
    return projectDir.copyAsync('bower_components/angular', 'app/stylesheets/angular', {
        overwrite: true,
        matching: '*.css'       
    });    
});

gulp.task('css-angular-bootstrap', function () {    
    return projectDir.copyAsync('bower_components/angular-bootstrap', 'app/stylesheets/angular-bootstrap', {
        overwrite: true,
        matching: '*.css'       
    });    
});

gulp.task('css-angular-toastr', function () {    
    return projectDir.copyAsync('bower_components/angular-toastr/dist', 'app/stylesheets/angular-toastr', {
        overwrite: true,
        matching: '*.min.css'       
    });    
});

gulp.task('css-bootstrap', function () {    
    return projectDir.copyAsync('bower_components/bootstrap/dist/css', 'app/stylesheets', {
        overwrite: true,
        matching: '*.min.css'       
    });    
});

gulp.task('css-font-awesome', function () {    
    return projectDir.copyAsync('bower_components/font-awesome/css/', 'app/stylesheets', {
        overwrite: true,
        matching: '*.min.css'       
    });    
});

gulp.task('styles', ['css-angular', 'css-angular-bootstrap', 'css-angular-toastr', 'css-bootstrap', 'css-font-awesome']);

gulp.task('fonts-font-awesome', function () {    
    return projectDir.copyAsync('bower_components/font-awesome/fonts/', 'app/fonts', {
        overwrite: true,
        matching: '*'       
    });    
});

gulp.task('fonts-bootstrap', function () {    
    return projectDir.copyAsync('bower_components/bootstrap/dist/fonts', 'app/fonts', {
        overwrite: true,
        matching: '*'       
    });    
});

gulp.task('fonts-custom', function () {    
    return projectDir.copyAsync('src/fonts', 'app/fonts', {
        overwrite: true,
        matching: '*'       
    });    
});

gulp.task('fonts', ['fonts-font-awesome', 'fonts-bootstrap', 'fonts-custom']);

gulp.task('deps', ['clean', 'scripts', 'styles', 'fonts']);

gulp.task('css-override', function (){
    return projectDir.copyAsync('src/stylesheets', 'app/stylesheets', {
        overwrite: true,
        matching: '*.css'       
    }); 
})
