/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')

    // 用户基本信息
    .factory('ktUserService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/sessions', {}, {
            'get': {
                method: 'GET',
                // apiMock: true,
                // cache: ktAjaxCache
            }
        })
    })

    // 用户业务详细信息
    .factory('ktUserInfoService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/person/info')
    })

    // 偏好资产
    .factory('ktAssetTypeService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/asset_types/:id', {
            id: '@id'
        })
    })

    // 业务偏好
    .factory('ktBusinessTypeService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/business_types/:id', {
            id: '@id'
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

    // 详情信息
    .factory('ktDetailsService', function($resource, ktApiVersion) {
        return $resource('/api/' + ktApiVersion + '/person/invitees')
    })

})();
