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
       }
   }   


   let tl = new tail.Tail(window.et.file.name, { separator: /[\r]{0,1}\n/, fromBeginning: true });
   tl.on('line', (data) => {
       window.et.file.lines++;
       if(window.et.file.lines && window.et.file.lines % 10 == 0){
           window.et.file.sizeInKB = calcSize(window.et.file.name);
       }
       console.log(`Line ${window.et.file.lines} and Size ${window.et.file.sizeInKB} KB`, data);
   })
   //tl.watchEvent.call(tail, "change");
});