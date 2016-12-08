/**
 * datepicker 指令
 * @require ['jQuery', 'kt-captcha.js','jquery.fullpage.min.js']
 */
;
(function() {
    'use strict';
    angular
        .module('kt.common')
        .directive('ktPageTitle', ktPageTitle)
        .directive('ktSideNavigation', ktSideNavigation)
        .directive('ktMinimalizaMenu', ktMinimalizaMenu)
        .directive('ktSparkline', ktSparkline)
        .directive('ktSmallHeader', ktSmallHeader)
        .directive('ktAnimatePanel', ktAnimatePanel)
        .directive('ktLoadingStatus', ktLoadingStatus)
        .directive('ktCompareTo', ktCompareTo)
        .directive('ktGreaterThan', ktGreaterThan)
        .directive('ktMin', ktMin)
        .directive('ktMax', ktMax)
        .directive('ktImagePreload', ktImagePreload)
        .directive('ktValidateOnBlur', ktValidateOnBlur)
        .directive('ktAccessibleForm', ktAccessibleForm)
        .directive('ktTouchSpin', ktTouchSpin)
        .directive('ktReadonly', ktReadonly)
        .directive('ktTableSort', ktTableSort)
        .directive('ktAutoFillFix', ktAutoFillFix)
        .directive('ktAutofillSubmit', ktAutofillSubmit)
        .directive('ktFullPage', ktFullPage)
        .directive('ktFullScreen', ktFullScreen)
        .directive('ktFullPageDestroy', ktFullPageDestroy)
        .directive('ktMousemoveBg', ktMousemoveBg)
        .directive('ktBlink', ktBlink)
        .directive('ktScrollHeader', ktScrollHeader)
        .directive('ktTableLineSelect', ktTableLineSelect)
        .directive('ktAutoFocus', ktAutoFocus)
        .directive('ktBlankClickHide', ktBlankClickHide)
        .directive('ktEnter', ktEnter)
        // .directive('ktFixedTable', ktFixedTable)


    /**
     * ktPageTitle - Directive for set Page title - mata title
     */
    function ktPageTitle($rootScope, $timeout) {
        return {
            link: function(scope, element, attrs) {
                var instName = attrs.instName
                var listener = function(event, toState) {
                    var title = instName || '开通金融'

                    if (toState.data && toState.data.pageTitle) {
                        title = title + '-' + toState.data.pageTitle;
                    }

                    $timeout(function() {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        }
    }

    /**
     * ktSideNavigation - Directive for run metsiMenu on sidebar navigation
     */
    function ktSideNavigation() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                // Call the metsiMenu plugin and plug it to sidebar navigation
                element.metisMenu();
            }
        }
    }

    /**
     * minimalizaSidebar - Directive for minimalize sidebar
     */
    function ktMinimalizaMenu() {
        return {
            restrict: 'EA',
            template: '<div class="header-link hide-menu" ng-click="minimalize()"><i class="fa fa-bars"></i></div>',
            controller: function($scope) {

                $scope.minimalize = function() {
                    if ($(window).width() < 769) {
                        $('body').toggleClass('show-sidebar');
                    } else {
                        $('body').toggleClass('hide-sidebar');
                    }
                }
            }
        }
    }


    /**
     * ktSparkline - Directive for ktSparkline chart
     */
    function ktSparkline() {
        return {
            restrict: 'A',
            scope: {
                sparkData: '=',
                sparkOptions: '=',
            },
            link: function(scope, element) {
                scope.$watch(scope.sparkData, function() {
                    render();
                });
                scope.$watch(scope.sparkOptions, function() {
                    render();
                });
                var render = function() {
                    $(element).sparkline(scope.sparkData, scope.sparkOptions);
                };
            }
        }
    }


    /**
     * ktSmallHeader - Directive for page title panel
     */
    function ktSmallHeader() {
        return {
            restrict: 'A',
            scope: true,
            controller: function($scope, $element) {
                $scope.small = function() {
                    var icon = $element.find('i:first');
                    var breadcrumb = $element.find('#hbreadcrumb');
                    $element.toggleClass('small-header');
                    breadcrumb.toggleClass('m-t-sm');
                    icon.toggleClass('fa-arrow-up').toggleClass('fa-arrow-down');
                }
            }
        }
    }

    function ktAnimatePanel($timeout, $q, ktImage) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                //Set defaul values for start animation and delay
                var startAnimation = 0;
                var delay = 0.1; // secunds
                var start = startAnimation;
                var emitBy = attrs.emitBy || '' // 基于什么触发
                var emitByEvent = attrs.emitByEvent || '' // 基于什么触发
                var slickElem = attrs.slickElem || '' //基于触发的slick的选择器
                var slickItemIndex = $(element).closest('.slick-item').index()
                    // Set default values for attrs
                    // if (!attrs.effect) {
                    //     attrs.effect = 'zoomIn'
                    // }

                if (attrs.delay) {
                    delay = parseFloat(attrs.delay)
                }

                var duration = attrs.duration || 0.5

                if (!attrs.child) {
                    attrs.child = '.row > div'
                } else {
                    attrs.child = '.' + attrs.child
                }

                // Get all visible element and set opactiy to 0
                var panel = element.find(attrs.child);
                var imgs = panel.filter('img')
                var effect = attrs.effect || 'zoomIn'
                var outEffect = attrs.outEffect || 'zoomOut'
                panel.addClass('opacity-0');


                // slick 逻辑
                if (emitBy === 'slick' && slickElem && $(slickElem).length) {

                    $(slickElem).on('beforeChange', function(e, slick, currS, nextS) {
                        if (currS === slickItemIndex) {
                            addAnimationOut()
                        }
                        if (nextS === slickItemIndex) {
                            addAnimationLazy()
                        }
                    })

                    /*$(slickElem).on('afterChange', function(e, slick, currS){
                        if (currS === slickItemIndex)
                            addAnimationLazy()
                    })*/

                } else if (emitByEvent) { //基于自定义事件触发
                    scope.$on(emitByEvent, function(event, data) {
                        if (data.type === 'out') {
                            addAnimationOut()
                        } else {
                            /*eslint-disable*/
                            data.lazyLoad ? addAnimationLazy() : addAnimationIn()
                                /*eslint-enable*/
                        }
                    })
                }

                if ((!emitBy && !emitByEvent) || slickItemIndex === 0) { //如果不基于slick触发或者属于第一个slick
                    addAnimationLazy()
                }

                /**
                 * lazy 添加动画，等待加载图片
                 */
                function addAnimationLazy() {
                    if (imgs.length) { //如果动画元素包含图片，加载完成再执行
                        var imgPromises = []
                        imgs.each(function() {
                            imgPromises.push(ktImage.load(this))
                        })
                        $q.all(imgPromises).then(function() {
                            addAnimationIn()
                        })
                    } else {
                        addAnimationIn()
                    }
                }

                /**
                 * 进入动画添加
                 */
                function addAnimationIn() {
                    // Wrap to $timeout to execute after ng-repeat
                    $timeout(function() {
                        panel = element.find(attrs.child);
                        start = Math.abs(delay) + startAnimation;

                        panel.each(function(i, elm) {
                            start += delay;
                            var de = $(elm).attr('delay') || start
                            var du = $(elm).attr('duration') || duration
                            var ef = $(elm).attr('effect') || effect
                            var oef = $(elm).attr('out-effect') || outEffect
                            de = Math.round(de * 10) / 10;

                            $(elm).addClass('animated-panel').removeClass(oef).addClass(ef);
                            $(elm).css('animation-duration', du + 's')
                            $(elm).css('animation-delay', de + 's')
                            $(elm).removeClass('opacity-0');
                        });

                    }, 100, false);
                }

                /**
                 * 离开动画添加
                 */
                function addAnimationOut() {
                    panel = element.find(attrs.child);
                    // start = Math.abs(delay) + startAnimation;
                    panel.each(function(i, elm) {
                        // start += delay;
                        // var de = $(elm).attr('delay') || start
                        var du = $(elm).attr('duration') || duration
                        var ef = $(elm).attr('effect') || effect
                        var oef = $(elm).attr('out-effect') || outEffect
                            // de = Math.round(de * 10) / 10;

                        $(elm).addClass('animated-panel').removeClass(ef).addClass(oef);
                        $(elm).css('animation-duration', du + 's')
                        $(elm).css('animation-delay', '0s')
                            // $(elm).addClass('opacity-0');
                    });
                }

            }
        }
    }

    /**
     * ajax 请求，显示加载样式
     */
    function ktLoadingStatus($http, ktUri) {
        return {
            restrict: 'A',
            replace: false,
            // scope: {
            //     isLoading: "="
            // },
            template: '<div class="text-center kt-loading-status"><img src="images/loading-bars.svg" width="{{width}}" height="{{height}}" /></div>',
            link: function(scope, elm, attrs) {
                var ignores = attrs.ignores ? attrs.ignores.split(',') : []

                // 构建成object，可以判断方法
                var ignoreObjs = _.map(ignores, function(v) {
                    var match = v.toLowerCase().match(/(.+?)(?:\[(.+)\])*$/i)
                    return {
                        url: match ? match[1] : '',
                        methods: match ? (match[2] ? match[2].split('|') : ['get', 'put', 'post', 'delete']) : []
                    }
                })
                scope.height = attrs.height
                scope.width = attrs.width

                scope.isLoading = function() {
                    var validPendings = _.filter($http.pendingRequests, function(v) {
                        return !_.some(ignoreObjs, function(iobj) {
                            return ktUri.appendParams(v.url, v.params) === iobj.url && _.includes(iobj.methods, v.method.toLowerCase())
                        })

                        // return !_.includes(ignores, ktUri.appendParams(v.url, v.params))
                    })
                    return validPendings.length > 0;
                }

                scope.$watch(scope.isLoading, function(v) {
                    if (v) {
                        elm.show();
                    } else {
                        elm.hide();
                    }
                })
            }
        }
    }

    /**
     * 表单验证是否相等，例如密码重复输入校验
     */
    function ktCompareTo() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: '=ktCompareTo'
            },
            link: function($scope, $element, $attrs, ngModel) {

                ngModel.$validators.ktCompareTo = function(modelValue) {
                    return modelValue === $scope.otherModelValue;
                }

                $scope.$watch('otherModelValue', function() {
                    ngModel.$validate();
                })
            }
        }
    }
    /**
     * 表单验证大于
     */
    function ktGreaterThan() {
        return {
            require: 'ngModel',
            // scope: {
            //     otherModelValue: '=ktGreaterThan'
            // },
            link: function($scope, $element, $attrs, ngModel) {
                var greaterThanInput = $($attrs.greaterThanInput)

                ngModel.$validators.ktGreaterThan = function(modelValue) {
                    return modelValue >= $scope.otherModelValue;
                }

                $scope.$watch('otherModelValue', function() {
                    ngModel.$validate();
                })
            }
        }
    }

    function ktMin() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attr, ctrl) {
                scope.$watch(attr.ktMin, function() {
                    ctrl.$setViewValue(ctrl.$viewValue);
                })

                var minValidator = function(value) {
                    var min = scope.$eval(attr.ktMin) || 0;
                    if (!_.isEmpty(value) && value < min) {
                        ctrl.$setValidity('ktMin', false)
                        return undefined
                    }

                    ctrl.$setValidity('ktMin', true);
                    return value;

                }

                ctrl.$parsers.push(minValidator)
                ctrl.$formatters.push(minValidator)
            }
        };
    }

    function ktMax() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attr, ctrl) {
                scope.$watch(attr.ktMax, function() {
                    ctrl.$setViewValue(ctrl.$viewValue);
                })

                var maxValidator = function(value) {
                    var max = scope.$eval(attr.ktMax) || Infinity;
                    if (!_.isEmpty(value) && value > max) {
                        ctrl.$setValidity('ktMax', false)
                        return undefined
                    }
                    ctrl.$setValidity('ktMax', true)
                    return value;
                }

                ctrl.$parsers.push(maxValidator)
                ctrl.$formatters.push(maxValidator)
            }
        };
    }

    /**
     * 预加载图片
     */
    function ktImagePreload($timeout) {
        return {
            restrict: 'A',
            scope: {
                ngSrc: '@'
            },
            link: function(scope, element, attrs) {
                var effect = attrs.effect || 'zoomIn'
                var delay = attrs.delay || 0.1
                var duration = attrs.duration || 0.5
                element.css({
                    'animation-delay': delay + 's',
                    'animation-duration': duration + 's',
                })
                element.on('load', function() {
                    $timeout(function() {
                        element.addClass(effect);
                    })
                })

                scope.$watch('ngSrc', function() {
                    $timeout(function() {
                        element.removeClass(effect);
                    })
                });
            }
        }
    }


    /**
     * 表单验证，在失去焦点的时候验证
     */
    function ktValidateOnBlur() {

        /**
         * After blur has occurred on a field, reapply change monitoring
         * @param scope
         * @param elm
         * @param attr
         * @param ngModelCtrl
         */
        var removeBlurMonitoring = function(scope, elm, attr, ngModelCtrl) {
            elm.unbind('blur');

            // Reapply regular monitoring for the field
            elm.bind('keydown input change blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        };

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elm, attr, ngModelCtrl) {
                var allowedTypes = ['text', 'email', 'password'];
                if (allowedTypes.indexOf(attr.type) === -1) {
                    return;
                }

                // Unbind onchange event so that validation will be triggerd onblur
                elm.unbind('input').unbind('keydown').unbind('change');

                // Set OnBlur event listener
                elm.bind('blur', function() {
                    // if (!elm.val()) return

                    scope.$apply(function() {
                        ngModelCtrl.$setViewValue(elm.val());
                    })

                    if (ngModelCtrl.$invalid) removeBlurMonitoring(scope, elm, attr, ngModelCtrl);
                });
            }
        }
    }

    /**
     * 通过事件focus表单元素
     */
    function ktAccessibleForm() {
        return {
            restrict: 'A',
            // scope: true,
            link: function(scope, elem) {
                // set up event handler on the form element
                elem.on('accessible.' + elem.attr('id'), function(event, data) {
                    // find the first invalid element
                    var firstInvalid = (function() {
                            if (data.field) {
                                return $('input[name="' + data.field + '"]')
                            }
                            return elem[0].querySelector('.ng-invalid');
                        })()
                        // if we find one, set focus
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                });
            }
        }
    }

    function ktTouchSpin($timeout) {
        return {
            restrict: 'A',
            scope: {
                spinOptions: '=',
            },
            link: function(scope, elem) {
                /*eslint-disable*/
                elem.TouchSpin(scope.spinOptions);
                /*eslint-enable*/
                elem.on('touchspin.on.startupspin', function() {
                    elem.trigger('blur')
                })

                scope.$watch('spinOptions', function() {
                    $timeout(function() {
                        update();
                    }, 10)
                }, true)

                var update = function() {
                    elem.trigger('touchspin.updatesettings', scope.spinOptions);
                }
            }
        }
    }

    /**
     * 只读
     */
    function ktReadonly() {
        return {
            restrict: 'A',
            link: function(scope, elem) {
                elem.addClass('disabled')
                elem.on('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                })
            }
        }
    }
    /**
     * 表格排序组件
     */
    function ktTableSort($location) {
        return {
            restrict: 'A',
            // scope: true,
            // controller: function ($scope, $element) {
            //     $scope.sort
            // }
            link: function(scope, elem) {
                var columns = elem.find('.sort-column')
                var search = $location.search()
                columns.each(function() {
                    var field = $(this).attr('field')
                    if (search.sort_by === field) {
                        $(this).addClass('sort-' + (search.order ? search.order : 'none'))
                    }
                })

                elem.on('click', '.sort-column', function() {
                    var column = $(this)
                        // var search = $location.search()
                    var orderList = ['asc', 'desc', 'init']
                    var nowIndex = (function() {
                        var field = column.attr('field')
                        if (!search.order) return -1
                        return search.sort_by === field ? _.indexOf(orderList, search.order) : -1
                    })();

                    var order = orderList[(nowIndex + 1) % orderList.length]
                    column.removeClass('sort-desc sort-asc sort-init').addClass('sort-' + order)
                    column.siblings('.sort-column').removeClass('sort-desc sort-asc sort-init')
                    scope.$apply(function() {
                        $location.search($.extend(search, {
                            page: 1,
                            sort_by: order !== 'init' ? column.attr('field') : null,
                            order: order !== 'init' ? order : null
                        }))
                    })
                })
            }
        }
    }

    /**
     * [ktAutoFillFix 可以用来实现表单提交按钮点击来验证表单的逻辑]
     */
    function ktAutoFillFix($timeout) {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, ngModel) {
                $timeout(function() {
                    var origVal = element.val();
                    if (origVal) {
                        element.trigger('input').trigger('change').trigger('keydown')
                        ngModel.$modelValue = ngModel.$modelValue || origVal;
                    }
                }, 1000)
            }
        }
    }

    /**
     * 需要调用scope parent, 要保证指令的scope的父scope是form所在的scope
     */
    function ktAutofillSubmit() {
        return {
            restrict: 'A',
            priority: -10,
            scope: {
                ktSubmit: '&',
            },
            link: function(scope, element, attrs) {
                function updateValidateWay() {
                    var parentScope = scope.$parent[attrs.name]
                    var inputs = element.find('input, textarea, select')

                    inputs.on('change', function() {
                        var name = $(this).attr('name')
                        parentScope[name].$setValidity('backendError', true)
                        scope.$apply()
                    })

                    scope.$parent.$watch(attrs.name, function(newValue) {
                        var k = _.keys(newValue.backendErrors)
                        var headerHeight = $('#header').height()

                        if (k && k.length) {

                            var first = _.chain(k).map(function(v, i) {
                                var el = element.find('[name=' + k[i] + ']')
                                return { el: el, trIndex: el.closest('tr').index() }
                            }).minBy('trIndex').value()
                            var offset = first.el.offset()

                            if (offset && offset.top < $(window).scrollTop() + headerHeight) {
                                $(window).scrollTop(offset.top - headerHeight)
                            }

                            first.el.focus()
                        }
                    }, true)

                    element.on('submit', function(event) {
                        inputs.trigger('input').trigger('change').trigger('keydown')
                        parentScope.$setDirty()
                        if (parentScope.$invalid) {
                            var firstError = parentScope.$error[_.keys(parentScope.$error)[0]]
                            parentScope[firstError[0].$name].$setDirty()
                            var firstErrorElem = $('[name="' + firstError[0].$name + '"]', element)
                            firstErrorElem.focus()
                            event.preventDefault()
                            return false
                        }

                        scope.ktSubmit()
                        event.preventDefault()
                        return false
                    })
                }

                if (!attrs.startByEvent) { //立即执行
                    updateValidateWay()
                } else { // 如果设置了异步事件，则等待事件执行
                    scope.$on(attrs.startByEvent, function() {
                        updateValidateWay()
                    })
                }
            }
        }
    }

    /**
     * 全屏模式
     * require [jquery.fullpage.min.js]
     */
    function ktFullPage() {
        return {
            restrict: 'A',
            scope: {
                settings: '=pageSettings'
            },
            link: function(scope, element, attrs) {
                var settings = $.extend(true, {}, scope.settings, attrs)
                    /*eslint-disable*/
                $.fn.fullpage.destroy && $.fn.fullpage.destroy('all')
                    /*eslint-enable*/
                element.fullpage(settings)
            }
        }
    }

    /**
     * 全屏元素
     */
    function ktFullScreen($window) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.height($window.innerHeight)
                $($window).on('resize', function() {
                    element.height($window.innerHeight)
                })
            }
        }
    }

    function ktFullPageDestroy() {
        return {
            restrict: 'A',
            link: function() {
                /*eslint-disable*/
                $.fn.fullpage && $.fn.fullpage.destroy && $.fn.fullpage.destroy('all')
                    /*eslint-enable*/
            }
        }
    }

    /**
     * 跟随鼠标，背景移动
     */
    function ktMousemoveBg() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                var startX
                var startY

                element.on('mousemove', function(e) {
                    var offsetX = e.offsetX
                    var offsetY = e.offsetY

                    if (!startX && !startY) {
                        startX = offsetX
                        startY = offsetY
                        return
                    }

                    var deltaX = offsetX - startX

                    var bg = element.css('background-position')
                    element.css('background-position', bg.replace(/(\d+)%\s(\d+)%/g, function(ma, m1, m2) {
                        var newX = +m1 + (deltaX / 10 | 0)
                            /*eslint-disable*/
                        newX = newX > 100 ? 100 : (newX < 0 ? 0 : newX)
                            /*eslint-enable*/
                        return newX + '% ' + m2 + '%'
                    }))

                    startX = offsetX
                    startY = offsetY
                })
            }
        }
    }

    /**
     * 闪烁元素
     */
    function ktBlink($timeout) {
        return {
            restrict: 'A',
            scope: {
                'watchObj': '=onChange'
            },
            link: function(scope, element, attrs) {
                var watchValues = attrs.watchValues ? attrs.watchValues.split(',') : []
                scope.$watchCollection('watchObj', function(newValue, oldValue) {

                    var hasChange = _.some(watchValues, function(v) {
                        return newValue[v] !== oldValue[v]
                    })

                    if (hasChange) blink()
                })

                function blink() {
                    if (element.data('animating') !== 'on') {
                        element.data('animating', 'on')
                        var animateName = 'blink' + (attrs.blinkColor || 'Orange')
                        element.addClass(animateName)

                        $timeout(function() {
                            element.data('animating', 'off')
                            element.removeClass(animateName)
                        }, 1500)
                    }
                }
            }
        }
    }

    /**
     * 向下滚动时，固定头部菜单栏
     */
    function ktScrollHeader() {
        return {
            restrict: 'A',
            link: function(scope, element) {
                $(window).on('scroll', function() {
                    element.toggleClass('fixed-head', $(window).scrollTop() > 200)
                })
            }
        }
    }

    /**
     * 表格行点击默认显示相应checkbox
     */
    function ktTableLineSelect() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.on('click', function() {
                    $(this).find(attrs.targetElement).trigger('click')
                })
            }
        }
    }

    function ktAutoFocus() {
        return {
            restrict: 'A',
            scope: {
                focusOn: '=focusOn'
            },
            link: function(scope, element) {
                scope.$watch('focusOn.focus', function(newValue) {
                    if (newValue) {
                        element.focus()
                    }
                })
            }
        }
    }

    function ktBlankClickHide() {
        return {
            restrict: 'A',
            scope: {
                onClose: '&onClose',
            },
            link: function(scope, element) {
                $(document).on('click', function(event) {
                    var target = event.target
                    if (!$.contains(element[0], target) && element[0] !== target) {
                        scope.onClose()
                    }
                })
            }
        }
    }

    // enter键
    function ktEnter() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ktEnter)
                    })

                    event.preventDefault()
                }
            })
        }
    }

    /*
     * 解决windows系统下面，表格太长不方便操作的问题，目前被废弃，使用判断屏幕高度计算per_page的长度，保证当前屏可放下
     */
    // function ktFixedTable($interval, $http) {
    //     return {
    //         restrict: 'A',
    //         link: function(scope, element, attrs) {
    //             if (!$('html').hasClass('windows') || $('html').hasClass('mobile')) return

    //             var winH = window.innerHeight
    //             var minH = winH - 80 - (parseInt(attrs.fixedBottom, 10) || 124)
    //             var fixedLinkElements = $('.' + attrs.fixedLink)

    //             element.on('scroll', function(e) {
    //                 element.find('thead').css({
    //                     transform: 'translateY(' + $(this).scrollTop() + 'px)'
    //                 })
    //                 e.stopPropagation()
    //                 e.cancelBubble = true
    //                 return false
    //             })

    //             var loopHand = $interval(function() {
    //                 // if (element.find(':first-child').width() <= element.width()) return
    //                 if ($http.pendingRequests.length) return
    //                 $interval.cancel(loopHand)

    //                 var eOffset = element.offset()
    //                 element.closest('.hpanel').height(element.closest('.hpanel').height())

    //                 $(window).on('scroll', function() {
    //                     if ($(window).scrollTop() >= eOffset.top) {
    //                         // element.parent().css({
    //                         //     height: element.parent().height()
    //                         // })
    //                         $('#main-view').css({
    //                             background: element.closest('.panel-body').css('background'),
    //                         })

    //                         element.css({
    //                             height: minH
    //                         }).addClass('fixed-model')

    //                         fixedLinkElements.each(function() {
    //                             // $(this).parent().css({
    //                             //     height: $(this).parent().height
    //                             // })
    //                             $(this).addClass('fixed-link-model').css({
    //                                 bottom: $(this).data('bottom')
    //                             })
    //                         })

    //                         $('#footer').hide()

    //                     } else {
    //                         element.css({
    //                             height: 'auto'
    //                         })

    //                         fixedLinkElements.removeClass('fixed-link-model')
    //                         element.removeClass('fixed-model')

    //                         $('#footer').show()
    //                         $('#main-view').css({
    //                             background: 'none'
    //                         })
    //                     }
    //                 })

    //                 /*$(window).on('mousewheel DOMMouseScroll', function(e) {
    //                     if (!$(e.target).closest('.fixed-model').is(element) && element.hasClass('fixed-model') && e.originalEvent.wheelDeltaY < 0) {
    //                         e.stopPropagation()
    //                         e.cancelBubble = true
    //                         return false
    //                     }
    //                 })*/
    //             }, 500)
    //         }
    //     }
    // }
})();
