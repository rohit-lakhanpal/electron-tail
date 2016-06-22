'use strict';

var pathUtil = require('path');
var Q = require('q');
var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var jetpack = require('fs-jetpack');
var bower = require('gulp-bower');

var bundle = require('./bundle');
var generateSpecImportsFile = require('./generate_spec_imports');
var utils = require('../utils');

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

var paths = {
    copyFromAppDir: [        
        './node_modules/**',
        './bower_components/**',
        './helpers/**',        
        './images/*',
        './*.html',
        './**/*.+(jpg|png|svg|eot|ttf|woff|woff2|css)'
    ]
};

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function () {
    return destDir.dirAsync('.', { empty: true });
});


var copyTask = function () {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: paths.copyFromAppDir
    });
};
gulp.task('copy', ['clean'], copyTask);
gulp.task('copy-watch', copyTask);

var generateLibs = function() {
    return jetpack.move('build/bower_components','build/lib')
};
gulp.task('generate-lib', ['copy'], generateLibs);

var bundleApplication = function () {
    return Q.all([
        bundle(srcDir.path('background.js'), destDir.path('background.js')),
        bundle(srcDir.path('app.js'), destDir.path('app.js')),
        bundle(srcDir.path('helpers/tail.js'), destDir.path('helpers/tail.js')),
    ]);
};

var bundleSpecs = function () {
    return generateSpecImportsFile().then(function (specEntryPointPath) {
        return bundle(specEntryPointPath, destDir.path('spec.js'));
    });
};

var bundleTask = function () {
    if (utils.getEnvName() === 'test') {
        return bundleSpecs();
    }
    return bundleApplication();
};
gulp.task('bundle', ['clean'], bundleTask);
gulp.task('bundle-watch', bundleTask);


var lessTask = function () {
    return gulp.src('app/stylesheets/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(destDir.path('stylesheets')));
};


var copyBootstrapFonts = function () {
    return projectDir.copyAsync('app/bower_components/bootstrap/dist/fonts', 'build/fonts', {
        overwrite: true        
    });    
};

var copyBootstrapCss = function () {
    return projectDir.copyAsync('app/bower_components/bootstrap/dist/css', 'build/stylesheets', {
        overwrite: true,
        matching: '*.css'        
    });    
};

var copyFontAwesomeCss = function () {
    return projectDir.copyAsync('app/bower_components/font-awesome', 'build/font-awesome', {
        overwrite: true       
    });  
};
gulp.task('copyBootstrapFonts', ['clean'], copyBootstrapFonts);
gulp.task('copyBootstrapCss', ['copyBootstrapFonts'], copyBootstrapCss);
gulp.task('copyFontAwesomeCss', ['copyBootstrapCss'], copyFontAwesomeCss);
gulp.task('less', ['copyFontAwesomeCss'], lessTask);
gulp.task('less-watch', lessTask);

gulp.task('environment', ['clean'], function () {
    var configFile = 'config/env_' + utils.getEnvName() + '.json';
    projectDir.copy(configFile, destDir.path('env.json'));
});


gulp.task('package-json', ['clean'], function () {
    var manifest = srcDir.read('package.json', 'json');

    // Add "dev" suffix to name, so Electron will write all data like cookies
    // and localStorage in separate places for production and development.
    if (utils.getEnvName() === 'development') {
        manifest.name += '-dev';
        manifest.productName += ' Dev';
    }

    destDir.write('package.json', manifest);
});

// gulp.task('finalize', ['clean'], function () {
//     var manifest = srcDir.read('package.json', 'json');

//     // Add "dev" or "test" suffix to name, so Electron will write all data
//     // like cookies and localStorage in separate places for each environment.
//     switch (utils.getEnvName()) {
//         case 'development':
//             manifest.name += '-dev';
//             manifest.productName += ' Dev';
//             break;
//         case 'test':
//             manifest.name += '-test';
//             manifest.productName += ' Test';
//             break;
//     }

//     // Copy environment variables to package.json file for easy use
//     // in the running application. This is not official way of doing
//     // things, but also isn't prohibited ;)
//     manifest.env = projectDir.read('config/env_' + utils.getEnvName() + '.json', 'json');

//     destDir.write('package.json', manifest);
// });


gulp.task('watch', function () {
    watch('app/**/*.js', batch(function (events, done) {
        gulp.start('bundle-watch', done);
    }));
    watch(paths.copyFromAppDir, { cwd: 'app' }, batch(function (events, done) {
        gulp.start('copy-watch', done);
    }));
    watch('app/**/*.less', batch(function (events, done) {
        gulp.start('less-watch', done);
    }));
});


// gulp.task('build', ['bundle', 'less', 'generate-lib', 'finalize']);
gulp.task('build', ['bundle', 'less', 'generate-lib', 'environment', 'package-json']);