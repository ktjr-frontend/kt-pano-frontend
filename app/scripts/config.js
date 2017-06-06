/**
 * 应用配置
 * @author luxueyan
 */
;
(function() {
    'use strict';

    function configApp($ocLazyLoadProvider, $compileProvider, $locationProvider, $httpProvider,
        $resourceProvider, $analyticsProvider, ktRouterProvider) {

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
        .run(function($rootScope, $state, $window, $location, $templateRequest, $q,
            $timeout, $http, ktLogService, ktPermits, ktHomeResource,
            uibPaginationConfig, ktUserService, ktS, ktSweetAlert, CacheFactory,
            ktEchartTheme1, ktRedirectState) {

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
                firstText: '«',
                itemsPerPage: 10,
                lastText: '»',
                nextText: '›',
                previousText: '‹',
                rotate: false
            })

            echarts.registerTheme('theme1', ktEchartTheme1) //echarts-3.x

            ktHomeResource.init()
            $rootScope.apiCode = Math.random().toString(16).slice(2) // ajax disable catch
            $rootScope.ktS = ktS // 资源哈希表
            $rootScope.$state = $state
            $rootScope.back = function() {
                window.history.back()
            }

            // 百度事件跟踪
            $rootScope.bdTrack = function(track) {
                window._hmt && window._hmt.push(['_trackEvent'].concat(track)) // eslint-disable-line
            }

            function resetWantGo(toState) {
                if (!_.includes(['account.perfect', 'account.prefer'], toState.name)) {
                    $rootScope.wantGo = null
                }
            }

            $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
                // 通过url传播token 实现单点登录
                if (toParams._t && toParams._t !== 'undefined') {
                    $window.localStorage.token = decodeURIComponent(toParams._t)
                }

                if (!toState.resolve) { toState.resolve = {} }
                if ($rootScope.user && $rootScope.user.group) {
                    delete toState.resolve.user
                    if (!ktPermits(toState)) {
                        event.preventDefault()
                        $state.go(ktRedirectState())
                    } else {
                        resetWantGo(toState)
                    }
                } else if (!toState.data.skipAuth) { // 略过权限校验
                    toState.resolve.user = [
                        '$q',
                        function($q) { // eslint-disable-line
                            var deferred = $q.defer();
                            ktUserService.get(function(res) {
                                $rootScope.defaultRoute = 'pano.overview'
                                    // res.account.group = 'normal'
                                    // res.account.status = 'passed'
                                $rootScope.user = res.account
                                if (!ktPermits(toState)) {
                                    // 决定路由何处
                                    event.preventDefault()
                                    $state.go(ktRedirectState())
                                } else {
                                    resetWantGo(toState)
                                }
                                deferred.resolve(res.account)
                            }, function() {
                                $rootScope.wantGo = {
                                    toState: toState,
                                    toParams: toParams
                                }
                                deferred.resolve(null)
                            })
                            return deferred.promise
                        }
                    ]
                } else if (toState.data.skipAuth) {
                    delete toState.resolve.user
                }

                $rootScope.error401 = '' // 重置401的错误 @deprecated

                // 首页获取user的逻辑不要尝试在这里解决，放到路由的resolve里面解决，否则很容易造成死循环，注意这个坑
                var search = $location.search()

                // 确保传递apimock
                if (search.apimock && !toParams.apimock) {
                    toParams.apimock = search.apimock
                }

            })

            $rootScope.$on('$stateChangeError', function() {
                // $state.go('error.404', toParams);
                ktSweetAlert.swal({
                    title: '提示',
                    text: '抱歉您查看的网页出错了，请手动刷新重试。',
                    confirmButtonText: '刷新页面',
                    showCancelButton: true,
                    cancelButtonText: '返回首页',
                }, function(isConfirm) {
                    if (isConfirm) {
                        $window.location.reload()
                            // $state.go($state.current.name, {}, { reload: true })
                    } else {
                        $state.go('home.index')
                    }
                })
            })

            $rootScope.$on('$stateNotFound', function() {
                // $state.go('error.404', toParams);
                ktSweetAlert.swal({
                    title: '提示',
                    text: '抱歉您查看的网页出错了，请刷新重试。',
                    confirmButtonText: '刷新页面',
                    showCancelButton: true,
                    cancelButtonText: '返回首页',
                }, function(isConfirm) {
                    if (isConfirm) {
                        $window.location.reload()
                            // $state.go($state.current.name, {}, { reload: true })
                    } else {
                        $state.go('home.index')
                    }
                })
            })

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                // 非认证用户弹出提示
                if ($rootScope.user && toState.data.normalLimit && $rootScope.user.group === 'normal') {
                    ktSweetAlert.swal({
                        title: '',
                        text: '请您进行名片认证，以使用该功能',
                        confirmButtonText: '去认证',
                        showCancelButton: true,
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true,
                        cancelButtonText: '取消',
                    }, function(isConfirm) {
                        if (isConfirm) {
                            $q.all([
                                $templateRequest('views/common/simple.html'),
                                $templateRequest('views/common/footer.html'),
                                $templateRequest('views/common/simple_header.html'),
                                $templateRequest('views/perfect.html'),
                                $templateRequest('scripts/directives/register-flow/template.html'),
                                $templateRequest('scripts/directives/business-card-upload/template.html')
                            ]).then(function() {
                                $state.go('account.perfect', { certifyApplication: 1 })
                                ktSweetAlert._self.close()
                            })
                        } else if (fromState.name &&
                            fromState.name !== toState.name &&
                            _.includes(['pano.settings', 'pano.overview', 'home.index', 'pano.institutions.detail'], fromState.name)) {
                            $state.go(fromState.name, fromParams)
                        } else {
                            $state.go($rootScope.defaultRoute)
                        }
                    })
                } else if ($rootScope.user && $rootScope.user.status === 'rejected' && toState.data.rejectedLimit) {
                    // 审核不通过弹出提示
                    ktSweetAlert.swal({
                        title: '',
                        text: '您的认证审核未通过，暂时无法使用该功能，请重新提交审核。',
                        confirmButtonText: '前往',
                        showCancelButton: true,
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true,
                        cancelButtonText: '取消',
                    }, function(isConfirm) {
                        if (isConfirm) {
                            $q.all([
                                $templateRequest('views/pano/account/settings.html')
                            ]).then(function() {
                                $state.go('pano.settings')
                                ktSweetAlert._self.close()
                            })
                        } else if (fromState.name &&
                            fromState.name !== toState.name &&
                            _.includes(['pano.settings', 'pano.overview', 'home.index', 'pano.institutions.detail'], fromState.name)) {
                            $state.go(fromState.name, fromParams)
                        } else {
                            $state.go($rootScope.defaultRoute)
                        }
                    })
                }

                // 存储状态
                $rootScope.previousState = fromState.name
                $rootScope.previousStateParams = fromParams
                $rootScope.currentState = toState.name
                $rootScope.nowLocate = moment.localeData().meridiem(moment().hour(), moment().minute())

                setTimeout(function() { //定时器为了等待state 切换完成（url地址），
                    ktLogService.get()
                }, 500)
                window.scrollTo(0, 0)
            })

            // ng-include 加载完后延迟显示footer, 避免闪烁
            $rootScope.$on('$includeContentLoaded', function() {
                setTimeout(function() {
                    $('#footer').css('display', 'block')
                }, 100)
            })
        })
})();
