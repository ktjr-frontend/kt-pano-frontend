/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')

    /*
     * @jwt interceptor & seo
     */
    .factory('ktTokenInterceptor', ['$q', '$injector', '$window', function($q, $injector, $window) {
        return {
            request: function(req) {
                req.headers = req.headers || {};
                if ($window.localStorage.token) {
                    req.headers.Authorization = $window.localStorage.token;
                }
                return req;
            },

            /*// for seo
            response: function(res) {
                var $http = $http || $injector.get('$http');
                var $timeout = $injector.get('$timeout');
                var $rootScope = $injector.get('$rootScope');
                if($http.pendingRequests.length < 1) {
                    $timeout(function(){
                        if($http.pendingRequests.length < 1){
                            $rootScope.htmlReady();
                        }
                    }, 700);//an 0.7 seconds safety interval, if there are no requests for 0.7 seconds, it means that the app is through rendering
                }
                return res
            }*/
        }
    }])

    .factory('ktResInterceptor', ['$q', '$injector', function($q, $injector) {
        return {
            request: function(req) {
                var $location = $injector.get('$location')
                var $rootScope = $injector.get('$rootScope')
                var ktS = $injector.get('ktS')
                var ktUri = $injector.get('ktUri')
                var search = $location.search()

                //apimock 替换为get方式
                if (search.apimock) {
                    req.method = 'GET'
                    $.extend(req.params, req.data) //替换为url参数
                }

                //数据接口缓存处理
                if (req.url.indexOf('/ajax/v') > -1) {
                    req.url = ktUri.appendParams(req.url, {
                        ac: $rootScope.apiCode
                    })

                    // 其他资源文件根据版本缓存
                } else {
                    req.url = ktS(req.url)
                }
                return req
            },

            response: function(res) {
                var headers = res.headers()

                // 获取分页信息
                if (headers['content-type'] && headers['content-type'].indexOf('application/json') > -1) {
                    /*jshint -W030 */
                    /*eslint-disable*/
                    angular.isObject(res.data) && !res.data.total_items && (res.data.total_items = headers['x-total'] || headers['X-Total'] || 0)
                    if (headers['ext_data']) {
                        angular.isObject(res.data) && $.extend(res.data, JSON.parse(headers['ext_data']))
                    }
                    /*eslint-enable*/
                }
                return res
            },

            responseError: function(res) {
                var $state = $injector.get('$state') //拦截器内需要使用$inject方式手动注入，否则报错$inject:cdep
                var $rootScope = $injector.get('$rootScope')
                var $location = $injector.get('$location')
                var $window = $injector.get('$window')
                var ktSweetAlert = $injector.get('ktSweetAlert')
                var ipCookie = $injector.get('ipCookie')
                var CacheFactory = $injector.get('CacheFactory')

                if (res.status === 419 || res.status === 401) {
                    var search = $location.search()
                    var stateParams = {}

                    // 确保apimock 的传递
                    if (search.apimock) stateParams.apimock = search.apimock

                    // 清除本地数据
                    $rootScope.user = null
                        // $rootScope.currentUrl = '';
                    delete $window.localStorage.token
                        // delete $window.localStorage.user
                    ipCookie.remove('token')
                    CacheFactory.clearAll()

                    // ipCookie.remove('connect.sid') //这是httpOnly Cookie 前端无法删除
                    if (res.config && res.config.params && res.config.params.notRequired) { //官网不需要跳转登录页面
                        return $q.reject(res.data)
                    }

                    $state.go('account.login', stateParams)

                } else if (res.status === 403) {
                    ktSweetAlert.swal({
                        title: '请求失败！',
                        text: '您的权限不足！',
                        type: 'error'
                    });
                } else if (res.status === 500) { // 注释掉是为了接部分接口
                    ktSweetAlert.swal({
                        title: '请求失败！',
                        text: '抱歉！服务器繁忙。',
                        type: 'error'
                    });
                    // $state.go('error.500')
                }
                return $q.reject(res.data)
            }
        }
    }])
})();
