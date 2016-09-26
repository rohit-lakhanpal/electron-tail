import { remote, ipcRenderer } from 'electron';
import constants from './constants';
import jetpack from 'fs-jetpack'; 

window.et = {
    ipcRenderer: ipcRenderer,
    constants: constants,
    appData: {
        name: remote.app.getName(),
        version: remote.app.getVersion(),
        locale: remote.app.getLocale(),
        package: jetpack.cwd(`${__dirname}/../`).read('package.json', 'json')
    }
}
