// // Here is the starting point for your application code.
// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('test').innerHTML = "This content has been populated by app.js"

//     // document.getElementById('tail').onclick = function () {        
//     // };
// });
(() => {
    var app = angular.module('electronTail', ['ui.bootstrap', 'toastr']);
    // app.factory('ipcService', ['$window', (win)=>{
    //     return {
    //         ipcRenderer: win.et.ipcRenderer            
    //     }
    // }]);    
    app.factory('constantsSvc', ['$window', (win)=>{
        return win.et.constants
    }]);

    app.factory('windowManagementSvc', ['$window', 'constantsSvc', ($window, constantsSvc) => {
        
        let _minimize = () => {            
            $window.et.ipcRenderer.send(constantsSvc.events.window.minimize);
        };        

        let _restore = () => {
            $window.et.ipcRenderer.send(constantsSvc.events.window.restore);
        };

        let _close = () => {
            $window.et.ipcRenderer.send(constantsSvc.events.window.close);
        };

        return {
            minimize: _minimize,
            restore: _restore,            
            close: _close
        }
    }]);
    app.controller('navCtrl', ['$scope', 'windowManagementSvc', ($scope, windowManagementSvc) => {
        let that = $scope;
        //let that = this;

        that.methods = {
            close: () => { windowManagementSvc.close(); },  
            restore: () => { windowManagementSvc.restore(); },
            minimize: () => { windowManagementSvc.minimize(); }
        }   
    }]);
})()