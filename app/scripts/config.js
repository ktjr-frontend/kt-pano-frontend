/**
 * 应用配置
 * @author luxueyan
 */
;
(function() {
    'use strict';

    function configApp($ocLazyLoadProvider, $compileProvider, $locationProvider, $httpProvider, $resourceProvider, $analyticsProvider, ktRouterProvider) {

        // 开发环境开启调试模式，使用ng-inpector调试
        $compileProvider.debugInfoEnabled(true);

        $httpProvider.interceptors.push('ktTokenInterceptor'); //jwt interceptor
        $httpProvider.interceptors.push('ktResInterceptor'); //custom interceptor
        $httpProvider.defaults.cache = false; // ajax cache

        // window.history.pushState = null // 用于mock不支持pushstate的浏览器
        // window.history.popState = null

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false //set false means no depend on the base tag in html head
        }).hashPrefix('!')

        // $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
        // $analyticsProvider.withAutoBase(true);  /* Records full path */

        $ocLazyLoadProvider.config({
            debug: true,
        })

        $resourceProvider.defaults.actions = {
            create: {
                method: 'POST'
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET'
            },
            query: {
                method: 'GET',
                isArray: true
            },
            remove: {
                method: 'DELETE'
            },
            'delete': {
                method: 'DELETE'
            }
        }

        /*TourConfigProvider.set('scrollOffset', 50);

        TourConfigProvider.set('onStart', function() {
            console.log('Started Tour')
        })

        TourConfigProvider.set('onNext', function() {
            console.log('Moving on...')
        })*/

        // mock data 废弃了启用mock-server.js替代
        // apiMockProvider.config({
        //     mockDataPath: '/mock_data',
        //     apiPath: '/api',
        //     // disable: true //关闭api mock
        // })

        // 启动路由
        ktRouterProvider.run()
    }

    angular
        .module('kt.pano')
        .config(configApp)
        .run(function($rootScope, $state, $location, $timeout, $http, ktLogService, ktPermits, ktHomeResource, uibPaginationConfig, ktUserService, ktS, CacheFactory, ktEchartTheme1) {

            // ajax 请求的缓存策略
            /*eslint-disable*/
            /*$http.defaults.cache = CacheFactory('ajaxCache', {
                maxAge: 30 * 1000, // 30秒缓存
                recycleFreq: 3 * 1000, // 3秒检查一次缓存是否失效
                // cacheFlushInterval: 60 * 60 * 1000, // 每小时清一次缓存
                deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
            });*/
            /*eslint-enable*/

            // 本地化分页
            $.extend(uibPaginationConfig, {
                boundaryLinks: true, //首页 尾页
                directionLinks: true,
                firstText: '首页',
                itemsPerPage: 10,
                lastText: '尾页',
                nextText: '下一页',
                previousText: '上一页',
                rotate: true
            })

            echarts.registerTheme('theme1', ktEchartTheme1) //echarts-3.x

            ktHomeResource.init()
            $rootScope.apiCode = Math.random().toString(16).slice(2) // ajax disable catch
            $rootScope.ktS = ktS // 资源哈希表
            $rootScope.$state = $state
            $rootScope.back = function() {
                window.history.back()
            }

            // 判断是否需要权限验证
            function judgeUserPermit(user) {
                if (!user || !user.grade) {
                    return true
                } else if (user.grade === '1' && user.status !== 'passed') {
                    return true
                } else if (user.grade === '0') {
                    return true
                }
                return false
            }

            function permitInterceptor(event, toState, toParams, user) {
                // 权限控制，无法控制刷新页面的行为
                if (toState.data.permits && !toParams.jump) {
                    if (!ktPermits(toState.data.permits)) {
                        event.preventDefault()
                        return
                    }
                    // 强制跳转标记，避免从pano.** -> pano.** 跳转的死循环
                } else if (toParams.jump && !toParams.forceJump) {
                    if (user.status === 'initialized') {
                        $state.go('account.perfect')
                    } else if (user.status === 'rejected') {
                        $state.go('pano.settings', { forceJump: true })
                    } else if (user.status === 'pended' && toState.name !== 'pano.settings') {
                        // if (user.grade === '1') {
                            $state.go($rootScope.defaultRoute, { forceJump: true })
                        // } else {
                        //     $state.go('pano.settings', { forceJump: true }, { location: 'replace' })
                        // }
                    } else { // 默认跳转的state，可以移除跳转的标识jump，否则会在路由上存在jump
                        $state.go(toState.name, { forceJump: true })
                    }
                }
            }
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {

                if (!toState.resolve) { toState.resolve = {} }

                // 路由权限拦截
                if (toState.name.indexOf('pano.') > -1 && judgeUserPermit($rootScope.user)) {

                    if (!$rootScope.user || !$rootScope.user.grade) {

                        toState.resolve.user = [ // 注意这样会导致每个state都会reload，当前页面路由的改变会刷新页面 所以上面判断
                            '$q',
                            function($q) {
                                var deferred = $q.defer();
                                ktUserService.get(function(res) {
                                    $rootScope.defaultRoute = 'pano.overview'
                                    var user = $rootScope.user = res.account
                                    permitInterceptor(event, toState, toParams, user)
                                    deferred.resolve(user)
                                }, function() {
                                    deferred.resolve(null)
                                })
                                return deferred.promise
                            }
                        ]
                    } else {
                        delete toState.resolve.user
                        permitInterceptor(event, toState, toParams, $rootScope.user)
                    }
                } else {
                    toParams.jump = null
                    toParams.forceJump = false
                    delete toState.resolve.user
                }

                $rootScope.error401 = '' // 重置401的错误 @deprecated

                // 首页获取user的逻辑不要尝试在这里解决，放到路由的resolve里面解决，否则很容易造成死循环，注意这个坑
                var search = $location.search()

                // 确保传递apimock
                if (search.apimock && !toParams.apimock) {
                    toParams.apimock = search.apimock
                }

                if (toState.name.indexOf('pano') > -1) {
                    $rootScope.wantJumpUrl = $state.href(toState.name, toParams)
                }
            })

            $rootScope.$on('$stateChangeError', function(event, toState, toParams) {
                $state.go('error.404', toParams);
            })

            $rootScope.$on('$stateNotFound', function(event, toState, toParams) {
                $state.go('error.404', toParams);
            })

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

                toParams.forceJump = false
                toParams.jump = null

                // 存储非错误和登录注册框的url 供redirect或者返回用
                if (toState.name.indexOf('pano') > -1) {
                    $rootScope.wantJumpUrl = ''
                }

                // 存储状态
                $rootScope.previousState = fromState.name
                $rootScope.previousStateParams = fromParams
                $rootScope.currentState = toState.name
                $rootScope.nowLocate = moment.localeData().meridiem(moment().hour(), moment().minute())

                setTimeout(function() { //定时器为了等待state 切换完成（url地址），
                    ktLogService.get()
                }, 500)
            })

            // ng-include 加载完后延迟显示footer, 避免闪烁
            $rootScope.$on('$includeContentLoaded', function() {
                setTimeout(function() {
                    $('#footer').css('display', 'block')
                }, 100)
            })
        })
})();
