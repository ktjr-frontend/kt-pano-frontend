// An example configuration file
exports.config = {
    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    // Spec patterns are relative to the configuration file location passed
    // to protractor (in this example conf.js).
    // They may include glob patterns.
    specs: ['test/e2e/spec.js'],

    directConnect: true,

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true // Use colors in the command line report.
    }
};
// java -jar /usr/local/lib/node_modules/protractor/selenium/selenium-server-standalone-2.42.2.jar -Dwebdriver.chrome.driver=/usr/local/lib/node_modules/protractor/selenium/chromedriver
