;
(function() {
    'use strict';
    angular.module('kt.pano')
        .directive('ktLogout', function($window, $rootScope, $state, ipCookie, CacheFactory) {
            return {
                restrict: 'A',
                link: function(scope, elem) {
                    elem.on('click', function(event) {
                        event.stopPropagation()
                        event.preventDefault()

                        // delete $window.localStorage.user
                        delete $window.localStorage.token
                        $rootScope.user = null
                        $rootScope.currentUrl = ''
                        $rootScope.wantJumpUrl = ''
                        ipCookie.remove('token')
                        CacheFactory.clearAll()

                        $state.go('account.login', {}, {
                            reload: true
                        })
                    })
                }
            }
        })
})();
