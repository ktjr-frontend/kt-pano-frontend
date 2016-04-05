var exec = require('child_process').exec
var path = require('path')
var file = require('fs')

var commomProject = path.normalize(__dirname + '/../kt-frontend-common/app')
var commonSoftLink = './app/common'
var isSoftLinkExist = file.existsSync(commonSoftLink)
var isCommonProjectExist = file.existsSync(commomProject)
var cmdStr = 'ln -svf ' + commomProject + ' ' + commonSoftLink

if (isSoftLinkExist) {
    cmdStr = 'rm ' + commonSoftLink + ' && ' + cmdStr
}

if (!isCommonProjectExist) {
    cmdStr = 'git clone git@github.ktjr.com:Kaitong/kt-frontend-common.git ../kt-frontend-common && ' + cmdStr
}

exec(cmdStr, function(err, stdout, stderr) {
    if (err) {
        console.log('安装通用模块错误 :' + stderr)
    } else {
        console.log(stdout)
    }
});
