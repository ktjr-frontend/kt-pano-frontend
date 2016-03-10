module.exports = {
    perform: {
        options: {
            assertions: {
                assetsWithQueryString: 10,
                globalVariables: 5,
                biggestLatency: 1400,
                bodyHTMLSize: 500000,
                commentsSize: 10500,
                consoleMessages: 0,
                hiddenContentSize: 65,
                jsErrors: 0,
                jsCount: 2,
                jsSize: 500000,
                cssCount: 2,
                imageSize: 200000,
                webfontSize: 200000,
                medianResponse: 400,
                nodesWithInlineCSS: 20,
                requests: 20,
                timeFrontend: 1000,
                timeToFirstImage: 1100,
                domContentLoaded: 600,
                DOMelementMaxDepth: 15
            },
            indexPath: './phantomas/',
            options: {
                timeout: 300
            },
            url: 'http://localhost:9000'
        }
    }
};
