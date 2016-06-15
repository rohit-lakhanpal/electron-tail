// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import os from 'os'; // native node.js module
import process from 'process'; // native node.js module
import util from 'util'; // native node.js module
import { app, Menu, crashReporter } from 'electron';
import { devMenuTemplate } from './helpers/dev_menu_template';
import { editMenuTemplate } from './helpers/edit_menu_template';
import createWindow from './helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

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

var mainWindow;

var setApplicationMenu = function () {
    var menus = [editMenuTemplate];
    if (env.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

app.on('ready', function () {
    setApplicationMenu();

    var mainWindow = createWindow('main', {
        width: 1000,
        height: 600
    });

    mainWindow.loadURL('file://' + __dirname + '/app.html');

    if (env.name !== 'production') {
        mainWindow.openDevTools();
    }
});

app.on('window-all-closed', function () {
    app.quit();
});
