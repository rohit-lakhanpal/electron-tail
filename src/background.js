// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu, ipcMain } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';
import constants from './helpers/constants';
import events from './helpers/events';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';


var mainWindow;
// // workerWindows: is an array of objects. Each object has { id:(guid), associatedFile:(name & path of the file its tailing), win:(windowObject) } 
// var workerWindows = [];

var setApplicationMenu = function () {
    var menus = [editMenuTemplate];
    if (env.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
    var userDataPath = app.getPath('userData');
    app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

app.on('ready', function () {
    setApplicationMenu();

    var mainWindow = createWindow('main', {
        width: 1000,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            preload: __dirname + '/js/preload.js'
        }
    });

    mainWindow.loadURL('file://' + __dirname + '/app.html');

    if (env.name === 'development') {
        mainWindow.openDevTools();
    }  

    // Add event listeners
    events.setup(mainWindow, constants, ipcMain);    
});

app.on('window-all-closed', function () {    
    app.quit();
});

