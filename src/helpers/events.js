'use strict';

/*
    workerWindows: is an array of objects. Each object has { id:(guid), associatedFile:(name & path of the file its tailing), win:(windowObject) } 
*/

export default {
    setup: (mainWindow, workerWindows, constants, ipcMain) => {
        // Handle window events
        ipcMain.on(constants.events.window.close, () => {        
            // TODO: close any other associated windows too
            mainWindow.close();    
        });

        ipcMain.on(constants.events.window.restore, () => {        
            mainWindow.isMaximized()? mainWindow.unmaximize() : mainWindow.maximize(); 
        });

        ipcMain.on(constants.events.window.minimize, () => {        
            mainWindow.minimize(); 
        });  

        // On the passthrough channel, messages should be sent to all windows
        ipcMain.on(constants.events.passthrough, (event, arg) => {
            // Each arg has { scope, topic, payload }
            if(arg && arg.topic && arg.payload && arg.scope){
                event.sender.send(constants.events.passthrough, arg);

                if(arg.scope === '*') { // Then send to all windows

                } else {

                }
            }
        });
    }
}