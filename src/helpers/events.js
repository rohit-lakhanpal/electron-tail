'use strict';

export default {
    setup: (mainWindow, constants, ipcMain) => {
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
    }
}