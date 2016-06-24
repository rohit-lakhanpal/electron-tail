// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import os from 'os'; // native node.js module
import process from 'process'; // native node.js module
import util from 'util'; // native node.js module
import { app, Menu, BrowserWindow, crashReporter, ipcMain, shell, autoUpdater } from 'electron';
import { devMenuTemplate } from './helpers/dev_menu_template';
import { editMenuTemplate } from './helpers/edit_menu_template';
import createWindow from './helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import environment from './env';

// Set application user model id
app.setAppUserModelId(environment.appUserModelId);
autoUpdater.setFeedURL(environment.autoUpdateFeedUrl); // Set the auto update feed url

// TODO: Add crash reporting capability
if (environment && environment.crashReporterUrl) {
    // Setup the crash reporter to a remote server
    crashReporter.start({
        productName: 'Electron Tail',
        companyName: 'Rohit Lakhanpal',
        submitURL: environment.crashReporterUrl,
        autoSubmit: true,
        extra: {
            'processType': process.type,
            'startupDateTime': new Date().toString(),
            'user': process.env.USER,
            'logname': process.env.LOGNAME,
            'userHome': process.env.HOME,
            'memoryUsage': util.inspect(process.memoryUsage()),
            'pid': process.pid,
            'processTitle': process.title,
            'processVersion': process.version,
            'processUptime': process.uptime(),
            'osType': os.type(),
            'osRelease': os.release(),
            'osPlatform': os.platform(),
            'osUptime': os.uptime(),
            'osFreeMemory': os.freemem(),
            'osTotalMemory': os.totalmem(),
            'osHostname': os.hostname(),
            'localInterfaces': (function () {
                var interfaces = os.networkInterfaces();
                var addresses = [];
                for (var k in interfaces) {
                    for (var k2 in interfaces[k]) {
                        var address = interfaces[k][k2];
                        if (address.family === 'IPv4' && !address.internal) {
                            addresses.push(address.address);
                        }
                    }
                }
                return addresses.join(',');
            } ())
        }
    });
}

var mainWindow;

var setApplicationMenu = function () {
    var menus = [editMenuTemplate];
    if (environment.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

app.on('ready', function () {
    setApplicationMenu();

    var mainWindow = createWindow('main', {
        width: 1000,
        height: 600,
        frame: environment.name != 'production',
        minHeight: 500,
        minWidth: 750,
        icon: __dirname + '/images/icon.png'
    });

    mainWindow.loadURL('file://' + __dirname + '/app.html');

    if (environment.name !== 'production') {
        mainWindow.openDevTools();
    }
});

app.on('window-all-closed', function () {
    app.quit();
});

ipcMain.on('message', (event, arg) => {
    if (arg && arg.command) {
        switch (arg.command) {
            case "close":
                app.quit();
                break;
            case "minimise":
                // Check if logging required
                console.log("window minimised!");
                break;
            case "maximise":
                // Check if logging required
                console.log("window maximised!");
                break;
            case "openExternal":                
                shell.openExternal(arg.param);
                break;
        }
    }
});
