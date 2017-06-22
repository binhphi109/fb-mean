'use strict';

(function () {

    var injectParams = ['$scope', '$timeout', '$window', '$uibModalInstance', 'FileUploader', 'options'];

    var FileUploadController = function ($scope, $timeout, $window, $uibModalInstance, FileUploader, options) {

        var results = {};

        $scope.options = {
            url: 'api/v1/upload',
            alias: 'newUploadFile',
            header: 'File Upload',
            action: 'Upload'
        };

        // Apply new configuration
        angular.extend($scope.options, options);

        // Create file uploader instance
        $scope.uploader = new FileUploader({
            url: $scope.options.url,
            alias: $scope.options.alias
        });

        // Set file uploader image filter
        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // Called after the user selected a new file file
        $scope.uploader.onAfterAddingFile = function (fileItem) {
            if ($window.FileReader) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(fileItem._file);

                fileReader.onload = function (fileReaderEvent) {
                    $timeout(function () {
                        $scope.imageURL = fileReaderEvent.target.result;
                    }, 0);
                };
            }
        };
        
        // Called after the user has successfully uploaded a new file
        $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            // Show success message
            $scope.success = true;

            results.fileItem = response;
            results.response = response;
        };

        // Called after the user has failed to uploaded a new file
        $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
            // Clear upload buttons
            $scope.uploader.clearQueue();

            // Show error message
            $scope.error = response.message;
        };

        // Start to the upload process
        $scope.upload = function () {
            // Clear messages
            $scope.success = $scope.error = null;

            // Start upload
            $scope.uploader.uploadAll();
        };

        // Complete the upload process
        $scope.done = function () {
            // Clear upload buttons
            $scope.uploader.clearQueue();

            // TODO: Show notification
            $uibModalInstance.close(results);
        };

        // Cancel the upload process
        $scope.cancel = function () {
            $scope.uploader.clearQueue();
            $uibModalInstance.close();
        };
    };

    FileUploadController.$inject = injectParams;

    angular.module('myApp').controller('FileUploadController', FileUploadController);

}());