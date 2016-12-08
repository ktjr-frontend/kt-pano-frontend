/**
 * common tools
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular
        .module('kt.common')
        .factory('ktCaptcha', ktCaptcha)
        .factory('ktCaptchaHelper', ktCaptchaHelper)

    function ktCaptcha($timeout) {

        var possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        var defaults = {

            selector: "#captcha",
            text: null,
            randomText: true,
            randomColours: true,
            width: 300,
            height: 200,
            colour1: '#eef7fb',
            colour2: '#4a6920',
            font: 'bold 48px "Comic Sans MS", cursive, sans-serif',
            onSuccess: function() {
                alert('Correct!');
            },
            onError: function() {
                alert('Error');
            }
        };

        /**
         * [shadeBlend demo]
         * var color1 = "#FF343B";
         * var color2 = "#343BFF";
         * var color3 = "rgb(234,47,120)";
         * var color4 = "rgb(120,99,248)";
         * var shadedcolor1 = shadeBlend(0.75,color1);
         * var shadedcolor3 = shadeBlend(-0.5,color3);
         * var blendedcolor1 = shadeBlend(0.333,color1,color2);
         * var blendedcolor34 = shadeBlend(-0.8,color3,color4); // Same as using 0.8
         * @return {[type]}    [description]
         */
        function shadeBlend(p, c0, c1) { //darken & ligten & blend
            var n = p < 0 ? p * -1 : p,
                u = Math.round,
                w = parseInt;
            if (c0.length > 7) {
                var f = c0.split(","),
                    t = (c1 ? c1 : p < 0 ? "rgb(0,0,0)" : "rgb(255,255,255)").split(","),
                    R = w(f[0].slice(4)),
                    G = w(f[1]),
                    B = w(f[2]);
                return "rgb(" + (u((w(t[0].slice(4)) - R) * n) + R) + "," + (u((w(t[1]) - G) * n) + G) + "," + (u((w(t[2]) - B) * n) + B) + ")"
            } else {
                var f = w(c0.slice(1), 16),
                    t = w((c1 ? c1 : p < 0 ? "#000000" : "#FFFFFF").slice(1), 16),
                    R1 = f >> 16,
                    G1 = f >> 8 & 0x00FF,
                    B1 = f & 0x0000FF;
                return "#" + (0x1000000 + (u(((t >> 16) - R1) * n) + R1) * 0x10000 + (u(((t >> 8 & 0x00FF) - G1) * n) + G1) * 0x100 + (u(((t & 0x0000FF) - B1) * n) + B1)).toString(16).slice(1)
            }
        }

        var CAPTCHA = function(config) {

            var that = this;

            this._settings = $.extend({}, defaults, config || {});

            this._container = $(this._settings.selector);

            var canvasWrapper = $('<div>').appendTo(this._container);

            this._canvas = $('<canvas>').appendTo(canvasWrapper).attr({
                    height: this._settings.height,
                    width: this._settings.width
                })
                .on('click', function() {
                    that.generate()
                });

            // var controlWrapper = $('<div>').appendTo(this._container);

            // this._input = $('<input>').addClass('user-text')
            //     .on('keypress', function(e) {
            //         if (e.which == 13) {
            //             that.validate(that._input.val());
            //         }
            //     })
            //     .appendTo(controlWrapper);

            // this._button = $('<button>').text('submit')
            //     .addClass('validate')
            //     .on('click', function() {
            //         that.validate(that._input.val());
            //     })
            //     .appendTo(controlWrapper);

            this._context = this._canvas.get(0).getContext("2d");

        };

        CAPTCHA.prototype = {

            generate: function() {
                var that = this;
                var context = this._context;

                //if there's no text, set the flag to randomly generate some
                if (this._settings.text === null || this._settings.text === '') {
                    this._settings.randomText = true;
                }

                if (this._settings.randomText) {
                    this._generateRandomText();
                }

                if (this._settings.randomColours) {
                    this._settings.colour1 = this._generateRandomColour(180, 255);
                    this._settings.colour2 = this._generateRandomColour(0, 100);
                    // this._settings.colour1 = 'rgb(238,238,238)';
                    // this._settings.colour2 = 'rgb(238,238,238)';
                }
                context.clearRect(0, 0, this._settings.width, this._settings.height);
                $timeout(function() {
                    // var gradient1 = context.createLinearGradient(0, 0, that._settings.width, 0);
                    // gradient1.addColorStop(0, that._settings.colour1);
                    // gradient1.addColorStop(1, that._settings.colour2);

                    // context.fillStyle = gradient1;
                    context.fillStyle = that._settings.colour1;
                    context.fillRect(0, 0, that._settings.width, that._settings.height);

                    // var gradient2 = context.createLinearGradient(0, 0, that._settings.width, 0);
                    // gradient2.addColorStop(0, shadeBlend(-0.1, that._settings.colour2));
                    // gradient2.addColorStop(1, shadeBlend(-0.1, that._settings.colour1));

                    // context.fillStyle = gradient2;
                    context.fillStyle = that._settings.colour2;
                    context.font = that._settings.font;

                    context.setTransform((Math.random() / 10) + 0.9, //scalex
                        0.1 - (Math.random() / 5), //skewx
                        0.1 - (Math.random() / 5), //skewy
                        (Math.random() / 10) + 0.9, //scaley
                        10, //transx
                        25); //transy

                    context.fillText(that._settings.text, 0, 0);

                    context.setTransform(1, 0, 0, 1, 0, 0);

                    var numRandomCurves = Math.floor((Math.random() * 1) + 5);

                    for (var i = 0; i < numRandomCurves; i++) {
                        that._drawRandomCurve();
                    }
                }, (300 * Math.random() + 100))
            },

            validate: function(userText, callback) {
                if (this._settings.text && userText && userText.toLowerCase() === this._settings.text.toLowerCase()) {
                    this._settings.onSuccess();
                    this._settings.text = ''
                    callback && callback(true)
                } else {
                    this._settings.onError();
                    this.generate();
                    callback && callback(false)
                }
            },

            _drawRandomCurve: function() {

                var ctx = this._context;

                // var gradient1 = ctx.createLinearGradient(0, 0, this._settings.width, 0);
                // gradient1.addColorStop(0, Math.random() < 0.5 ? this._settings.colour1 : this._settings.colour2);
                // gradient1.addColorStop(1, Math.random() < 0.5 ? this._settings.colour1 : this._settings.colour2);

                // ctx.strokeStyle = gradient1;
                ctx.strokeStyle = this._settings.colour2;
                ctx.lineWidth = Math.floor((Math.random() * 1) + 1);
                ctx.beginPath();
                ctx.moveTo(Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)));
                ctx.bezierCurveTo(Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)),
                    Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)),
                    Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)));
                ctx.stroke();
            },

            _generateRandomText: function() {
                this._settings.text = '';
                // var length = Math.floor((Math.random() * 3) + 6);
                var length = 4;
                for (var i = 0; i < length; i++) {
                    this._settings.text += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
                }
            },

            _generateRandomColour: function(min, max) {
                max = max || 255;
                min = min || 0;
                return "rgb(" + Math.floor((Math.random() * max) + min) + ", " + Math.floor((Math.random() * max) + min) + ", " + Math.floor((Math.random() * max) + min) + ")";
            }
        };
        return CAPTCHA;
    }

    function ktCaptchaHelper() {
        return {
            timerMessage: function($scope) {
                return function(second) {
                    var timerHandlerMessage
                    var timeSum = 0
                    $scope.timerMessage = second

                    timerHandlerMessage = setInterval(function() {
                        $scope.timerMessage--
                        if ($scope.timerMessage <= 0) {
                            $scope.waitCaptchaMessage = false
                            clearInterval(timerHandlerMessage)
                        }
                        
                        timeSum++
                        if (timeSum > 10){
                            $scope.messageTimerMoreThanTen = true
                        }

                        $scope.$apply();
                    }, 1000)
                }
            },
            timerTel: function($scope) {
                return function(second) {
                    var timerHandlerTel

                    $scope.timerTel = second
                    timerHandlerTel = setInterval(function() {
                        $scope.timerTel--
                        if ($scope.timerTel <= 0) {
                            $scope.waitCaptchaTel = false
                            clearInterval(timerHandlerTel)
                        }
                        $scope.$apply();
                    }, 1000)
                }
            }
        }
    }


})();
