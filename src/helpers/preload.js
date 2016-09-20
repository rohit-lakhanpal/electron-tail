import { ipcRenderer } from 'electron';
import constants from './constants';

window.et = {
    ipcRenderer: ipcRenderer,
    constants: constants
}
