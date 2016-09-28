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
    app.factory('constantsSvc', ['$window', (win) => {
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

        let _openExternal = (url, callback) => {
            $window.et.ipcRenderer.send(constantsSvc.events.window.openExternal, {
                type: constantsSvc.events.type.request,
                data: url
            });
            $window.et.ipcRenderer.once(constantsSvc.events.window.openExternal, (event, arg) => {
                if (arg && arg.type == constantsSvc.events.type.response) {
                    callback(arg);
                }
            });
        }

        return {
            minimize: _minimize,
            restore: _restore,
            close: _close,
            openExternal: _openExternal
        }
    }]);

    app.factory('logSvc', ['$log', ($log) => {
        return $log
    }])

    app.factory('appInfoSvc', ['$window', ($window) => {
        var _getLocale = () => $window.et.appData.locale;
        var _getPackageInfo = () => $window.et.appData.package;

        return {
            getLocale: _getLocale,
            getPackageInfo: _getPackageInfo
        }
    }]);

    app.directive('openExternal', ['toastr', 'windowManagementSvc', 'constantsSvc', function (toastr, windowManagementSvc, constantsSvc) {
        return {
            restrict: 'A', //E = element, A = attribute, C = class, M = comment         
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                title: '@'
            },
            link: function ($scope, element, attrs) {
                element.bind('click', function (el, at) {
                    windowManagementSvc.openExternal(attrs.openExternal, (arg) => {
                        if (arg.status == constantsSvc.events.status.success) {
                            toastr.info(`${arg.data} was successfully opened in your default browser.`, 'Link successfully opened');
                        } else {
                            toastr.error(`Unable to open ${arg.data} in your default browser.`, 'Error opening link');
                        }
                    });
                });
            } //DOM manipulation
        }
    }]);

    app.run(['$rootScope', ($rootScope) => {
        $rootScope.rsdata = {
            file: {
                name: '',
                lines: 0,
                sizeInKB: 0
            }
        }
    }]);

    app.controller('navCtrl', ['$scope', 'windowManagementSvc', 'appInfoSvc', ($scope, windowManagementSvc, appInfoSvc) => {
        let that = $scope;
        //let that = this;

        that.data = {
            product: {
                name: appInfoSvc.getPackageInfo().productName,
                description: appInfoSvc.getPackageInfo().description,
                version: appInfoSvc.getPackageInfo().version,
            }
        }

        that.methods = {
            close: () => { windowManagementSvc.close(); },
            restore: () => { windowManagementSvc.restore(); },
            minimize: () => { windowManagementSvc.minimize(); }
        }
    }]);

    app.factory('dialogSvc', ['$window', 'logSvc', ($window, logSvc) => {
        let _showOpenDialog = () => $window.et.dialog.showOpenDialog({
            title: 'Select a file to tail',
            buttonLabel: 'Tail this file',
            filters: [
                { name: 'Text File Formats', extensions: ['txt', 'log', 'conf', 'config'] },
                { name: 'All Files', extensions: ['*'] }
            ],
            properties: ['openFile', 'showHiddenFiles']
        });
        return {
            selectFile: _showOpenDialog
        };
    }]);

    app.controller('contentCtrl', ['$scope', '$rootScope', 'dialogSvc', 'logSvc', ($scope, $rootScope, dialogSvc, logSvc) => {
        let that = $scope;

        that.data = {

        };

        that.methods = {
            selectFile: () => {
                let selectedFile = dialogSvc.selectFile();
                logSvc.log('Opened a new file to tail.', selectedFile);
                if (selectedFile && angular.isArray(selectedFile) && selectedFile.length > 0) {
                    $rootScope.rsdata.file = {
                        name: selectedFile[0],
                        lines: 0,
                        sizeInKB: 0.0
                    }
                }
            }
        };
    }]);

    app.controller('footerCtrl', ['$scope', '$rootScope', 'appInfoSvc', ($scope, $rootScope, appInfoSvc) => {
        let that = $scope;
        //let that = this;

        that.data = {
            product: {
                author: appInfoSvc.getPackageInfo().authorDetails,
                sponsor: appInfoSvc.getPackageInfo().sponsor,
                version: appInfoSvc.getPackageInfo().version,
                repository: appInfoSvc.getPackageInfo().repository
            }
        }

        // that.methods = {
        //     close: () => { windowManagementSvc.close(); },  
        //     restore: () => { windowManagementSvc.restore(); },
        //     minimize: () => { windowManagementSvc.minimize(); }
        // }   
    }]);
})()