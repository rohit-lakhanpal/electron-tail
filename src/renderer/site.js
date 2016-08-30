(function () {
    var app = angular.module("panvivaApp", ['ui.bootstrap', 'toastr']);

    app.run(['$anchorScroll', function ($anchorScroll) {
        $anchorScroll.yOffset = 100;   // always scroll by 50 extra pixels
    }]);

    app.factory('electronSvc', ['$window', 'toastr', function (win, toastr) {
        let package = win._et.package;
        let utils = {
            openLinkInExternalWindow: function (url) {
                win._et.electron.send('message', { command: 'openExternal', param: url });
            },
            crash: function () {
                win._et.process.crash();
            },
            hang: function () {
                win._et.process.hang();
            }
        };
        return {
            'product': function () {
                return {
                    name: package.productName,
                    version: package.version,
                    author: {
                        name: package.authorDetails.name,
                        url: package.authorDetails.url,
                        handle: package.authorDetails.handle
                    },
                    sponsor: {
                        name: package.sponsor.name,
                        url: package.sponsor.url,
                        handle: package.sponsor.handle
                    },
                    repository: {
                        type: package.repository.type,
                        url: package.repository.url
                    },
                };
            } (),
            'file': function () {
                return {
                    fileName: ''
                };
            } (),
            'os': _et.os,
            // "remote": remote,
            // "greet": greet,
            // "env": env,
            "utils": utils,
            // "dialog": remote.dialog,
            // "fs": fs,
            // "events": events,
            // "alert": alerts,
            // "tail": tail,
            // "fileHelpers": fileHelpers,
            // "windowFunctions": windowFunctions,
            'package': package
        };
    }]);
    app.directive('openExternal', ['electronSvc', function (electronSvc) {
        return {
            restrict: 'A', //E = element, A = attribute, C = class, M = comment         
            scope: {
                //@ reads the attribute value, = provides two-way binding, & works with functions
                title: '@'
            },
            link: function ($scope, element, attrs) {
                element.bind('click', function (el, at) {
                    electronSvc.utils.openLinkInExternalWindow(attrs.openExternal);
                });
            } //DOM manipulation
        }
    }]);
    app.controller('navCtrl', ['$scope', 'electronSvc', function ($scope, electronSvc) {
        console.log(electronSvc.package);
        var that = $scope;
        debugger;
        that.data = {
            product: electronSvc.product,
            file: electronSvc.file
        };

        that.methods = {
            selectFile: function () {
                // TODO: Write code to select a file
            }
        };
    }]);
    app.controller('footerCtrl', ['$scope', 'electronSvc', function ($scope, electronSvc) {
        var that = $scope;
        debugger;
        that.data = {
            product: electronSvc.product,
            file: electronSvc.file
        };

        that.methods = {
            selectFile: function () {
                // TODO: Write code to select a file
            }
        };
    }]);
    // app.controller("baseCtrl", ['$scope', '$anchorScroll', '$location', '$interval', 'electronSvc',
    //     function ($scope, $anchorScroll, $location, $interval, electronSvc) {

    //     }]);

} ());