// import required node modules
import * as winston from 'winston';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from '../env';
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            filename: env.logFile,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false
        })
    ]
});

export default logger;