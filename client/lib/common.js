'use strict';

(function () {

    var injectParams = [];

    var Common = function () {
        // initialize
        
    };

    // Check like of currentUser for each post
    Common.isLiked = function(likes, currentUser) {
        var index = _.findIndex(likes, function(user){
            return user._id === currentUser._id;
        });
        if(index < 0){
            return false;
        } else {
            return true;
        }
    }

    Common.$inject = injectParams;

    angular.module('myApp').value('Common', Common);

}());