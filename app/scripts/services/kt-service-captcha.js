/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')

    // 图形验证码
    .factory('ktCaptchaService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/captcha')
    })

})();
