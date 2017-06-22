'use strict';

(function () {

    var injectParams = ['$uibModal', 'config'];

    var modalService = function ($uibModal, config) {

        var defaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '/partials/modal.html'
        };

        var options = {
            header: 'Proceed',
            body: 'Perform this action?',
            action: 'OK',
            close: 'Close'
        };

        this.showModal = function (customDefaults, customOptions) {
            if (!customDefaults) customDefaults = {};
            customDefaults.backdrop = 'static';
            return this.show(customDefaults, customOptions);
        };

        this.show = function (customDefaults, customOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempDefaults = {};
            var tempOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in this service
            angular.extend(tempDefaults, defaults, customDefaults);

            //Map modal.html $scope custom properties to defaults defined in this service
            angular.extend(tempOptions, options, customOptions);

            if (!tempDefaults.controller) {
                tempDefaults.controller = function ($scope, $uibModalInstance) {
                    $scope.options = tempOptions;
                    $scope.options.ok = function (result) {
                        $uibModalInstance.close('ok');
                    };
                    $scope.options.cancel = function (result) {
                        $uibModalInstance.close('cancel');
                    };
                };

                tempDefaults.controller.$inject = ['$scope', '$uibModalInstance'];
            }

            return $uibModal.open(tempDefaults).result;
        };

        this.showModalWithTemplate = function (baseName, path, options, customDefaults) {
            //Create temp objects to work with since we're in a singleton service
            if (!path) path = '';
            if (!customDefaults) customDefaults = {};
            var tempDefaults = {};

            //Map angular-ui modal custom defaults to modal defaults defined in this service
            angular.extend(tempDefaults, defaults, customDefaults);

            tempDefaults.templateUrl = config.directory.templates + path + baseName + '.html';
            tempDefaults.controller = baseName + 'Controller';
            tempDefaults.resolve = {
                load: ['$q', '$rootScope', function ($q, $rootScope) {
                    var dependencies = [config.directory.templates + path + baseName + 'Controller.js'];
                    var defer = $q.defer();
                    // require(dependencies, function () {
                    defer.resolve();
                    // });
                    return defer.promise;
                }],
                options: options
            };

            return $uibModal.open(tempDefaults).result;
        };
    };

    modalService.$inject = injectParams;

    angular.module('myApp').service('modalService', modalService);

}());

// Sample usage of default modal
// modalService.showModal({}, {
//     header: 'Confirm Delete',
//     body: 'Are you sure you want to delete this discount?',
//     action: 'Delete Discount',
//     close: 'Cancel'
// }).then(function (result) {
//     if (result === 'ok') {
//         alert();
//     }
// });

// Sample usage of modal with template
// modalService.showModalWithTemplate('FileUpload', 'fileUpload/', {
//     url: 'api/v1/users/picture',
//     alias: 'newProfilePicture',
//     header: 'Update Profile Picture',
//     action: 'Upload Photo'
// }).then(function (results) {
//     if (results) {
//         // reload data
//         init();
//     }
// });