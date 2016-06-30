;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktPanoCtrl', function($scope, $rootScope, $state, $templateRequest, ktS, ktFeedbackService, user) {

            $rootScope.goHome = function() {
                $state.go($rootScope.defaultRoute)
            }

            $scope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState) {

                window.requestAnimationFrame(function() {

                    // 会员页面 切换子页面不回到顶部
                    if (fromState.name === toState.name) {
                        return
                    }

                    // 切换页面成功后回到顶部
                    $('body').scrollTop(0)
                })
            });

            $templateRequest('common/directives/feedback/template.html')
                .then(function(tpl) {
                    tpl = $(tpl)
                    $scope.options = {
                        customAjax: function(feedback) {
                            return ktFeedbackService.save($.extend({ from: 'compass' }, user, feedback)).$promise
                        },
                        postHTML: false,
                        postURL: false,
                        postBrowserInfo: false,
                        initButtonText: '<i class="icon-pano icon-pen"></i>意见反馈',
                        html2canvasURL: ktS('common/libs/html2canvas.min.js'),
                        tpl: {
                            description: tpl.filter('#feedback-welcome')[0].outerHTML,
                            highlighter: tpl.filter('#feedback-highlighter')[0].outerHTML,
                            overview: tpl.filter('#feedback-overview')[0].outerHTML,
                            submitSuccess: tpl.filter('#feedback-submit-success')[0].outerHTML,
                            submitError: tpl.filter('#feedback-submit-error')[0].outerHTML,
                        },
                    }
                })

        })

})();
