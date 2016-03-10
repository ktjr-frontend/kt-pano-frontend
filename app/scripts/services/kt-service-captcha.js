/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')

    .factory('ktCaptchaService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/users/captcha')
    })

})();
