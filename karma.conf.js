module.exports = function(config) {
    config.set({
        /**
         * From where to look for files, starting with the location of this file.
         */
        basePath: '',

        /**
         * This is the list of file patterns to load into the browser during testing.
         */
        files: [
            /*injector:js*/
            "bower_components/jquery/dist/jquery.min.js",
            "bower_components/angular/angular.min.js",
            "bower_components/oclazyload/dist/ocLazyLoad.js",
            "bower_components/angular-cookie/angular-cookie.min.js",
            "bower_components/angular-animate/angular-animate.min.js",
            "bower_components/angular-sanitize/angular-sanitize.min.js",
            "bower_components/angular-messages/angular-messages.min.js",
            "bower_components/angular-ui-router/release/angular-ui-router.min.js",
            "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
            "bower_components/checklist-model/checklist-model.js",
            "bower_components/angular-resource/angular-resource.js",
            "bower_components/angular-notify/dist/angular-notify.min.js",
            "bower_components/angulartics/dist/angulartics.min.js",
            "bower_components/angulartics/dist/angulartics-baidu.min.js",
            "bower_components/angulartics-google-analytics/dist/angulartics-google-analytics.min.js",
            "bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js",
            "bower_components/moment/min/moment.min.js",
            "bower_components/moment/locale/zh-cn.js",
            "bower_components/metisMenu/dist/metisMenu.min.js",
            "bower_components/sweetalert/dist/sweetalert.min.js",
            "bower_components/angular-apimock/dist/angular-apimock.min.js",
            "app/scripts/init.js",
            "app/scripts/app.js",
            "app/scripts/config.js",
            "app/common/kt-common.js",
            "app/common/locale/angular-locale_zh-cn.js",
            "app/common/factories/kt-resource-assetmap.js",
            "app/common/factories/kt-captcha.js",
            "app/common/factories/kt-alert.js",
            "app/common/factories/kt-uri.js",
            "app/common/factories/kt-image.js",
            "app/common/filters/kt-filter-common.js",
            "app/common/directives/kt-safari-image-directive.js",
            "app/common/directives/kt-common-directive.js",
            "app/scripts/resources/kt-resource-home.js",
            "app/scripts/factories/kt-tools-function.js",
            "app/scripts/services/kt-service.js",
            "app/scripts/services/kt-service-account.js",
            "app/scripts/services/kt-service-assets.js",
            "app/scripts/services/kt-service-news.js",
            "app/scripts/services/kt-service-captcha.js",
            "app/scripts/filters/kt-filter-assets.js",
            "app/scripts/helpers/kt-data-helper-assets.js",
            "app/scripts/interceptors/kt-interceptor.js",
            /*endinjector*/
            "bower_components/angular-mocks/angular-mocks.js",
            "test/unit/service.js"
        ],

        exclude : [
        ],

        preprocessors: {
            'app/scripts/**/*.js': 'coverage',
            'app/common/**/*.js': 'coverage'
        },

        frameworks: ['jasmine'],

        plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-coverage'],

        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        /**
         * How to report, by default.
         */
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },

        /**
         * On which port should the browser connect, on which port is the test runner
         * operating, and what is the URL path for the browser to use.
         */
        port: 7019,

        urlRoot: '/',

        /**
         * Disable file watching by default.
         */
        autoWatch: true,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        captureTimeout: 60000,
        /**
         * The list of browsers to launch to test ondest     * default, but other browser names include:
         * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
         *
         * Note that you can also use the executable name of the browser, like "chromium"
         * or "firefox", but that these vary based on your operating system.
         *
         * You may also leave this blank and manually navigate your browser to
         * http://localhost:9018/ when you're running tests. The window/tab can be left
         * open and the tests will automatically occur there during the build. This has
         * the aesthetic advantage of not launching a browser every time you save.
         */
        browsers: [
            'Chrome'
        ]
    });
};
