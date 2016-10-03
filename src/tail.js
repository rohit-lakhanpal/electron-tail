import fs from 'fs';
import { remote, ipcRenderer } from 'electron';
import constants from './helpers/constants';
import tail from './helpers/node-tail';


let getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let calcSize = (file) => {
    let sizeInBytes = fs.statSync(file)["size"]
    return sizeInBytes && sizeInBytes <= 500 ? 0 : Math.round(sizeInBytes/1000);
};

document.addEventListener('DOMContentLoaded', () => {
   window.et = {
       id: getParameterByName('id'),
       file: {
           name: getParameterByName('file'),
           lines: 0,
           sizeInKB: 0.0
       },
       tail: {
           fromBeginning: getParameterByName('fromBeginning')
       }
   }   


   let tl = new tail.Tail(window.et.file.name, { separator: /[\r]{0,1}\n/, fromBeginning: window.et.tail.fromBeginning });
   tl.on('line', (data) => {
       window.et.file.lines++;
       if(window.et.file.lines && (window.et.file.lines == 0 || window.et.file.lines % 10 == 0)){
           window.et.file.sizeInKB = calcSize(window.et.file.name);
       }       
       document.dispatchEvent(new CustomEvent('line', { 'detail': {
           file: window.et.file,
           line: data
       }}));
       console.log(`Line ${window.et.file.lines} and Size ${window.et.file.sizeInKB} KB`, data);
   });

    document.addEventListener('line', (evt) => {
        ipcRenderer.send(constants.events.passthrough, {
            scope: window.et.id,
            topic: constants.events.file.newLine,
            payload: evt.detail
        })
    })
   
});