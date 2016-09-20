(function () {'use strict';

var electron = require('electron');

var constants = {
    config: {
        autoMinimized: 'autoMinimized',
        autoStart: 'autoStart',
        debug: 'debug'        
    },
    environment: {
        development: 'development',
        production: 'production',
        test: 'test'
    },
    events: {
        file: {
            listen: 'events-file-listen',
            startWatch: 'events-file-start-watch',
            pauseWatch: 'events-file-pause-watch',
            newLine: 'events-file-new-line'
        }
    },
    logger: {
        datePattern: 'yyyy-MM-dd', // A string representing the pattern to be used when appending the date to the filename  
        level: {
            debug: 'debug',
            error: 'error',
            info: 'info',
            verbose: 'verbose',
            warn: 'warn'
        },
        maxFile: 10, // imit the number of files created when the size of the logfile is exceeded.
        maxSize: 10485760, // Max size in bytes of the logfile
        transport: {
            file: 'electron-tail-log-file'
        }
    }
};

window.et = {
    ipcRenderer: electron.ipcRenderer,
    constants: constants
}
}());
//# sourceMappingURL=preload.js.map