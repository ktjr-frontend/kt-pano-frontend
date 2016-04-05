/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')

    // user service
    .factory('ktUserService', function($resource, ktAjaxCache, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/sessions', {}, {
            'get': {
                method: 'GET',
                // apiMock: true,
                cache: ktAjaxCache
            }
        })
    })

    // 登录接口
    .factory('ktLoginService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/sessions/:confirm', {
            confirm: '@confirm'
        }, {
            'post': {
                method: 'POST',
                // apiMock: true,
            },
            'save': {
                method: 'POST',
                // apiMock: true,
            }
        })
    })

    // 登录接口
    .factory('ktLoginService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/sessions/:confirm', {
            confirm: '@confirm'
        }, {
            'post': {
                method: 'POST',
                // apiMock: true,
            },
            'save': {
                method: 'POST',
                // apiMock: true,
            }
        })
    })

    // 注册接口
    .factory('ktRegisterService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/registrations/:content', {
            content: '@content'
        })
    })

    // 找回密码
    .factory('ktRecoverService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/recoveries/:content', {
            content: '@content'
        })
    })

    // 用户信息
    .factory('ktAccountService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/accounts/:content', {
            content: '@content'
        })
    })


})();
