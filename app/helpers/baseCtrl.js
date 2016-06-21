(function () {
    var app = angular.module("panvivaApp");
    app.controller("baseCtrl", ['$scope', '$anchorScroll', '$location', '$interval', 'electronSvc', function ($scope, $anchorScroll, $location, $interval, electronSvc) {
        var that = $scope;

        that.platformInfo = electronSvc.os.platform();
        that.envName = electronSvc.env.name;
        that.openFiles = [];

        // Setup function to initialse dataset
        that.init = function () {            
            that.file = {
                fileName: "",
                fileData: [],
                fileSizeInKb: 0
            };            
            that.tail = null;            
        };
        that.init();

        that.calcSize = function () {
            var fsz = electronSvc.fileHelpers.getFilesizeInBytes(that.file.fileName);
            that.file.fileSizeInKb = fsz > 1000? fsz/1000 : 0;
        };              
        
        that.closeFile = function (idx){
            that.init();  
            try{that.openFiles.splice(idx, 1);}
            catch(exc) {}
        };

        // Functionality on file selection
        that.selectFile = function () {
            electronSvc.dialog.showOpenDialog(function (fileNames) {                
                if (fileNames === undefined) {
                    try {
                        that.tail.unwatch();
                    } catch (err) { }
                    that.tail = null;
                    that.$apply();
                    return;
                }                
                that.file.fileName = fileNames[0]; // set the filename
                if(that.openFiles && that.openFiles.indexOf(that.file.fileName) != -1){
                    that.openFiles.splice(that.openFiles.indexOf(that.file.fileName), 1);
                }
                that.openFiles.unshift(that.file.fileName);
                that.$apply();
                that.calcSize();

                that.tail = new electronSvc.tail.Tail(that.file.fileName, { fromBeginning: true });
                that.tail.on("line", function (data) {
                    that.file.fileData.push(data);
                    that.$apply();

                    // Get last element
                    var length = that.file.fileData.length - 1;
                    if(length % 10 == 0) that.calcSize();
                    var newHash = 'anchor' + length;
                    $location.hash(newHash);
                    $anchorScroll();
                });
            });
        };

        that.continueTailing = function () {
            if (that.file.fileName != "" && that.tail != null) {
                try {
                    that.tail.watch();
                } catch (err) {
                    electronSvc.alert.error("Error occured when trying to continue tailing the file. " + err);
                }
            } else {
                electronSvc.alert.warning("Can't tail a file that does not exist! Please select a file.");
            }
        };

        that.pauseTailing = function () {
            if (that.file.fileName != "" && that.tail != null) {
                try {
                    that.tail.unwatch();
                } catch (err) {
                    electronSvc.alert.error("Error occured when trying to pause tailing the file. " + err);
                }
            } else {
                electronSvc.alert.warning("Can't tail a file that does not exist! Please select a file.");
            }

        };

        that.clearOutput = function () {
            that.file.fileData = [];
        };
    }]);
} ())

