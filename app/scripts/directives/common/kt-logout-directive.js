;
(function() {
    'use strict';
    angular.module('kt.pano')
        .directive('ktLogout', function($window, $state, ktSession) {
            return {
                restrict: 'A',
                link: function(scope, elem) {
                    elem.on('click', function(event) {
                        event.stopPropagation()
                        event.preventDefault()
                        ktSession.clear()

                        $state.go('account.login', {}, {
                            reload: true
                        })
                    })
                }
            }
        })
})();
