// import native node modules
import os from 'os';
import process from 'process';
import util from 'util';

// import env variables
import env from '../env';

// import required node modules
import logger from '../helpers/logger';

// import electron
import { crashReporter as cr } from 'electron';

var crashReporter = (function () {
    var setup = function () {        
        if (env && env.crashReporterUrl) {
            try {
                cr.start(
                    {
                        productName: 'Electron Tail',
                        companyName: 'Rohit Lakhanpal',
                        submitURL: env.crashReporterUrl,
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

                logger.info(`Crash reporter setup at ${env.crashReporterUrl}.`);
            } catch (error) {
                logger.error('Unable to setup the crash reporter. Check the error.', error);
            }

        } else {
            logger.error('Unable to setup the crash reporter. Check the environment variables.');
        }
    };

    return {
        'setup': setup
    };
})();

export default crashReporter;