'use strict';

import createWindow from './window';
import util from './util';

/*
    workerWindows: is an array of objects. Each object has { id:(guid), associatedFile:(name & path of the file its tailing), win:(windowObject) } 
*/

export default {
    setup: (mainWindow, constants, ipcMain) => {
        let workerWindows = [];
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
            if(idx !== -1){
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
                win.filePath = 
                win.win = createWindow('main', {
                    width: 1000,
                    height: 600,
                    frame: false,            
                });
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
        // ----- WINDOW EVENTS CHANNEL -----

        // ----- FILE EVENTS CHANNEL -----
        ipcMain.on(constants.events.file.open, (event, arg) => {
            

        });
        // ----- FILE EVENTS CHANNEL -----

        // ----- PASSTHROUGH EVENTS CHANNEL -----
        // On the passthrough channel, messages should be sent to all windows
        ipcMain.on(constants.events.passthrough, (event, arg) => {
            // Each arg has { scope, topic, payload }
            if (arg && arg.topic && arg.payload && arg.scope) {
                event.sender.send(constants.events.passthrough, arg);

                if (arg.scope === '*') { // Then send to all windows

                } else {

                }
            }
        });
        // ----- PASSTHROUGH EVENTS CHANNEL -----
    }
}