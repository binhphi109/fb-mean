(function () {

    var config = {
        directory: {
            views: 'views/',
            controllers: 'controllers/',
            templates: 'templates/'
        }
    };

    angular.module('myApp').value('config', config);

}());