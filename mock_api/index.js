var common = require('./common')
var account = require('./account')
var stats = require('./stats')
var inst = require('./inst')

exports.mockApi = function(app) {
    common(app)
    account(app)
    stats(app)
    inst(app)
}
