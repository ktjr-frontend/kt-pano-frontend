var path = require('path')

module.exports = {
    lint: {
        options: {
            template: path.normalize(__dirname + '/..') + '/pre-commit.template'
        },
        'pre-commit': 'lint'
    }
}
