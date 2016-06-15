// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import process from 'process'; // native node.js module
import util from 'util'; // native node.js module
import { remote, crashReporter } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import { greet } from './hello_world/hello_world'; // code authored by you in this project
import fs from 'fs'; // native node.js module
import events from 'events'; // native node.js module

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
    var app = angular.module("panvivaApp", []);
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
    app.factory('electronSvc', ['$window', function (win) {
        var msgs = [];
        var customTail = function () {
            var Tail, environment,
                bind = function (fn, me) { return function () { return fn.apply(me, arguments); }; },
                extend = function (child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
                hasProp = {}.hasOwnProperty;

            var tailFn = function (superClass) {
                extend(Tail, superClass);

                Tail.prototype.readBlock = function () {
                    var block, stream;
                    if (this.queue.length >= 1) {
                        block = this.queue.shift();
                        if (block.end > block.start) {
                            stream = fs.createReadStream(this.filename, {
                                start: block.start,
                                end: block.end - 1,
                                encoding: "utf-8"
                            });
                            stream.on('error', (function (_this) {
                                return function (error) {
                                    if (_this.logger) {
                                        _this.logger.error("Tail error:" + error);
                                    }
                                    return _this.emit('error', error);
                                };
                            })(this));
                            stream.on('end', (function (_this) {
                                return function () {
                                    if (_this.queue.length >= 1) {
                                        return _this.internalDispatcher.emit("next");
                                    }
                                };
                            })(this));
                            return stream.on('data', (function (_this) {
                                return function (data) {
                                    var chunk, i, len, parts, results;
                                    _this.buffer += data;
                                    parts = _this.buffer.split(_this.separator);
                                    _this.buffer = parts.pop();
                                    results = [];
                                    for (i = 0, len = parts.length; i < len; i++) {
                                        chunk = parts[i];
                                        results.push(_this.emit("line", chunk));
                                    }
                                    return results;
                                };
                            })(this));
                        }
                    }
                };

                function Tail(filename, options) {
                    var pos, ref, ref1, ref2, ref3;
                    this.filename = filename;
                    if (options == null) {
                        options = {};
                    }
                    this.readBlock = bind(this.readBlock, this);
                    this.separator = (ref = options.separator) != null ? ref : /[\r]{0,1}\n/, this.fsWatchOptions = (ref1 = options.fsWatchOptions) != null ? ref1 : {}, this.fromBeginning = (ref2 = options.fromBeginning) != null ? ref2 : false, this.follow = (ref3 = options.follow) != null ? ref3 : true, this.logger = options.logger;
                    if (this.logger) {
                        this.logger.info("Tail starting:");
                        this.logger.info("filename:", this.filename);
                    }
                    this.buffer = '';
                    this.internalDispatcher = new events.EventEmitter();
                    this.queue = [];
                    this.isWatching = false;
                    this.internalDispatcher.on('next', (function (_this) {
                        return function () {
                            return _this.readBlock();
                        };
                    })(this));
                    if (this.fromBeginning) {
                        pos = 0;
                    }
                    this.watch(pos);
                }

                Tail.prototype.watch = function (pos) {
                    var stats;
                    if (this.isWatching) {
                        return;
                    }
                    this.isWatching = true;
                    stats = fs.statSync(this.filename);
                    this.pos = pos != null ? pos : stats.size;
                    if (fs.watch) {
                        return this.watcher = fs.watch(this.filename, this.fsWatchOptions, (function (_this) {
                            return function (e) {
                                return _this.watchEvent(e);
                            };
                        })(this));
                    } else {
                        return fs.watchFile(this.filename, this.fsWatchOptions, (function (_this) {
                            return function (curr, prev) {
                                return _this.watchFileEvent(curr, prev);
                            };
                        })(this));
                    }
                };

                Tail.prototype.watchEvent = function (e) {
                    var stats;
                    if (e === 'change') {
                        stats = fs.statSync(this.filename);
                        if (stats.size < this.pos) {
                            this.pos = stats.size;
                        }
                        if (stats.size > this.pos) {
                            this.queue.push({
                                start: this.pos,
                                end: stats.size
                            });
                            this.pos = stats.size;
                            if (this.queue.length === 1) {
                                return this.internalDispatcher.emit("next");
                            }
                        }
                    } else if (e === 'rename') {
                        this.unwatch();
                        if (this.follow) {
                            return setTimeout(((function (_this) {
                                return function () {
                                    return _this.watch();
                                };
                            })(this)), 1000);
                        } else {
                            if (this.logger) {
                                this.logger.error("'rename' event for " + this.filename + ". File not available.");
                            }
                            return this.emit("error", "'rename' event for " + this.filename + ". File not available.");
                        }
                    }
                };

                Tail.prototype.watchFileEvent = function (curr, prev) {
                    if (curr.size > prev.size) {
                        this.queue.push({
                            start: prev.size,
                            end: curr.size
                        });
                        if (this.queue.length === 1) {
                            return this.internalDispatcher.emit("next");
                        }
                    }
                };

                Tail.prototype.unwatch = function () {
                    if (fs.watch && this.watcher) {
                        this.watcher.close();
                    } else {
                        fs.unwatchFile(this.filename);
                    }
                    this.isWatching = false;
                    return this.queue = [];
                };

                return Tail;

            };

            return {
                "Tail": tailFn(events.EventEmitter)
            }
        };
        return {
            "os": os,
            "remote": remote,
            "greet": greet,
            "env": env,
            "dialog": remote.dialog,
            "fs": fs,
            "events": events,
            "alert": {
                error: function (message) {
                    alert(message);
                }
            },
            "tail": customTail()
        }
    }]);
} ())

