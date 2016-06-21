// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import process from 'process'; // native node.js module
import util from 'util'; // native node.js module
import stream from 'stream'; // native node.js module
import { remote, crashReporter } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import { greet } from './hello_world/hello_world'; // code authored by you in this project
import fs from 'fs'; // native node.js module
import events from 'events'; // native node.js module
import tail from './helpers/tail.js'; // custom tail.js module

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

// TODO: Add crash reporting capability
// Setup the crash reporter to a remote server
// crashReporter.start({
//     productName: 'Electron Tail Background',
//     companyName: 'Rohit Lakhanpal',
//     submitURL: '',    
//     autoSubmit: true,
//     extra: {        
//         'startupDateTime': new Date().toString(),
//         'user': process.env.USER,
//         'logname': process.env.LOGNAME,
//         'userHome': process.env.HOME,
//         'memoryUsage': util.inspect(process.memoryUsage()),
//         'pid': process.pid,
//         'processTitle': process.title,
//         'processVersion': process.version,
//         'processUptime': process.uptime(),
//         'osType': os.type(),
//         'osRelease': os.release(),
//         'osPlatform': os.platform(),
//         'osUptime': os.uptime(),
//         'osFreeMemory': os.freemem(),
//         'osTotalMemory': os.totalmem(),
//         'osHostname': os.hostname(),
//         'localInterfaces': (function () {
//             var interfaces = os.networkInterfaces();
//             var addresses = [];
//             for (var k in interfaces) {
//                 for (var k2 in interfaces[k]) {
//                     var address = interfaces[k][k2];
//                     if (address.family === 'IPv4' && !address.internal) {
//                         addresses.push(address.address);
//                     }
//                 }
//             }
//             return addresses.join(',');
//         }())
//     }
// });

var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
console.log('The author of this app is:', appDir.read('package.json', 'json').author);

(function () {
    var app = angular.module("panvivaApp", ['ui.bootstrap', 'toastr']);
    app.directive('resize', function ($window) {
        return function (scope, element, attr) {
            var w = angular.element($window);
            scope.$watch(function () {
                return {
                    'h': w[0].innerHeight,
                    'w': w[0].innerWidth
                };
            }, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                scope.resizeWithOffset = function (offsetW, offsetH) {

                    scope.$eval(attr.notifier);

                    return {
                        'height': (newValue.h - offsetH) + 'px',
                        'width': (newValue.w - offsetW) + 'px'
                    };
                };

            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
            w.bind('change', function () {
                scope.$apply();
            });
        }
    });
    app.run(['$anchorScroll', function ($anchorScroll) {
        $anchorScroll.yOffset = 100;   // always scroll by 50 extra pixels
    }]);
    app.factory('electronSvc', ['$window', 'toastr', function (win, toastr) {
        return {
            "os": os,
            "remote": remote,
            "greet": greet,
            "env": env,
            "dialog": remote.dialog,
            "fs": fs,
            "events": events,
            "alert": {
                success: function (message) {
                    toastr.success(message);
                },
                info: function (message) {
                    toastr.info(message);
                },
                error: function (message) {
                    toastr.error(message);
                },
                warning: function (message) {
                    toastr.warning(message);
                }
            },
            "tail": tail,
            "fileHelpers": function () {
                var getFilesizeInBytes = function (filename) {
                    console.log("filename: " + filename);
                    var stats = fs.statSync(filename);
                    console.log("stats: " + stats);
                    var fileSizeInBytes = stats["size"];
                    console.log("fileSizeInBytes: " + fileSizeInBytes);
                    return fileSizeInBytes;
                };
                return {
                    "getFilesizeInBytes": getFilesizeInBytes
                }
            }()
        }
    }]);
} ())

