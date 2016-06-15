(function () {
    var app = angular.module("panvivaApp");
    app.controller("baseCtrl", ['$scope', '$anchorScroll', '$location', 'electronSvc', function ($scope, $anchorScroll, $location, electronSvc) {
        var that = $scope;
        that.greetingMessage = electronSvc.greet();
        that.platformInfo = electronSvc.os.platform();
        that.envName = electronSvc.env.name;
        that.fileName = "";
        that.fileData = [];        
        that.tail = null;
        that.selectFile = function () {
            electronSvc.dialog.showOpenDialog(function (fileNames) {
                that.fileName = "";
                that.fileData = [];
                if (fileNames === undefined) {
                    try {
                        that.tail.unwatch();
                    } catch (err) { }
                    that.tail = null;
                    that.$apply();
                    return;
                }
                that.fileName = fileNames[0];
                that.$apply();

                that.tail = new electronSvc.tail.Tail(that.fileName);
                that.tail.on("line", function (data) {
                    that.fileData.push(data);
                    that.$apply();

                    // Get last element
                    var length = that.fileData.length - 1;
                    var newHash = 'anchor' + length;
                    $location.hash(newHash);
                    $anchorScroll();                                       
                });
            });
        };
        that.continueTailing = function () {
            if (that.fileName != "" && that.tail != null) {
                that.tail.watch();                
            } else {
                electronSvc.alert.error("Can't tail a file that does not exist!");
            }
        };
        that.pauseTailing = function () {
            try {
                that.tail.unwatch();
            } catch (err) { }
        };
        that.clearOutput = function () {            
            that.fileData = [];
        };
    }]);
} ())

