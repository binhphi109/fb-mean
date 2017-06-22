(function () {

    var injectParams = ['$scope', '$uibModalInstance', 'options'];

    var FileUploadController = function ($scope, $uibModalInstance, options) {

        $scope.options = {
            header: 'File Upload',
            action: 'Upload'
        };

        $scope.upload = function () {
            $uibModalInstance.close({
                status: 'OK'
            });
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
        }
        
        function init() {
            angular.extend($scope.options, options);
        }

        init();
    };

    FileUploadController.$inject = injectParams;

    angular.module('myApp').controller('FileUploadController', FileUploadController);

}());