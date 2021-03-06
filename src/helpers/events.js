'use strict';

import createWindow from './window';
import util from './util';
import constants from './constants';
import env from '../env';
import { shell } from 'electron';

/*
    workerWindows: is an array of objects. Each object has { id:(guid), associatedFile:(name & path of the file its tailing), win:(windowObject) } 
    arg: { type:(request|response), data: (yourData), staus(only used for response): (success, error) }
*/

export default {
    setup: (mainWindow, constants, ipcMain) => {
        let workerWindows = []; // This is written to be implemented later for multiple windows
        let getWindowByFilePath = (filePath) => {
            let win = null;
            for (let i = 0; i < workerWindows.length; i++) {
                let w = workerWindows[i];
                if (w.associatedFile === filePath) {
                    win = w;
                    break;
                }
            }
            return win;
        };
        let getWindowById = (id) => {
            let win = null;
            for (let i = 0; i < workerWindows.length; i++) {
                let w = workerWindows[i];
                if (w.id === id) {
                    win = w;
                    break;
                }
            }
            return win;
        };
        let removeWindowById = (id) => {
            let win = null;
            let idx = -1;
            for (let i = 0; i < workerWindows.length; i++) {
                let w = workerWindows[i];
                if (w.id === id) {
                    win = w;
                    idx = i;
                    break;
                }
            }
            if (idx !== -1) {
                workerWindows.splice(idx, 1);
            }

            return win;
        };
        let addWorkerWindow = (filePath) => {
            let windowExists = false;
            let win = getWindowByFilePath(filePath);
            if (win == null) {
                win = {};
                win.id = util.generateGuid();
                win.filePath = filePath;
                win.win = createWindow('main', {
                    width: 1000,
                    height: 600,
                    frame: env.name === 'development',
                    show: env.name === 'development'
                });
                win.win.loadURL('file://' + __dirname + '/tail.html?&file=' + escape(win.filePath) + '&id=' + win.id + '&fromBeginning=true');
                if (env.name === 'development') {
                    win.win.openDevTools();
                }

                workerWindows.push(win);
            }
            return win;
        };

        // ----- WINDOW EVENTS CHANNEL -----
        ipcMain.on(constants.events.window.close, () => {
            // TODO: close any other associated windows too
            mainWindow.close();
        });

        ipcMain.on(constants.events.window.restore, () => {
            mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
        });

        ipcMain.on(constants.events.window.minimize, () => {
            mainWindow.minimize();
        });

        ipcMain.on(constants.events.window.openExternal, (event, arg) => {
            if (arg && arg.data && util.isValidUrl(arg.data) && arg.type == constants.events.type.request) {
                let callStatus = constants.events.status.success;
                let data = arg.data;

                try {
                    // Open external link
                    shell.openExternal(arg.data);
                } catch (error) {
                    callStatus = constants.events.status.failure;
                    data = error;
                }

                // notify sender of call success/failure
                event.sender.send(constants.events.window.openExternal, {
                    type: constants.events.type.response,
                    status: callStatus,
                    data: data
                });
            }

        });
        // ----- WINDOW EVENTS CHANNEL -----

        // ----- FILE EVENTS CHANNEL -----
        ipcMain.on(constants.events.file.open, (event, arg) => {
            if (arg && arg.data && arg.type == constants.events.type.request) {
                let callStatus = constants.events.status.success;
                let data = arg.data;

                // Open a new window & give it handler info to communicate!
                let w = addWorkerWindow(arg.data);

                // notify sender of call success/failure
                event.sender.send(constants.events.file.open, {
                    type: constants.events.type.response,
                    status: callStatus,
                    data: w.id
                });
            }
        });
        // ----- FILE EVENTS CHANNEL -----

        // ----- PASSTHROUGH EVENTS CHANNEL -----
        // On the passthrough channel, messages should be sent to all windows
        ipcMain.on(constants.events.passthrough, (event, arg) => {
            // Each arg has { scope, topic, payload }
            if (arg && arg.topic && arg.payload && arg.scope) {
                event.sender.send(constants.events.passthrough, arg);

                if (arg.scope === '*') { // Then send to all windows
                    for(let idx = 0; idx < workerWindows.length; idx++){
                        workerWindows[idx].win.webContents.send(arg.topic, arg.payload);
                    }
                } else {                    
                    if(getWindowById(arg.scope)){
                        getWindowById(arg.scope).win.webContents.send(arg.topic, arg.payload);
                    }
                }                
                mainWindow.webContents.send(arg.topic, arg.payload);
            }
        });
        // ----- PASSTHROUGH EVENTS CHANNEL -----
    }
}