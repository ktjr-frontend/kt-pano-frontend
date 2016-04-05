# kt-lode-frontend

> 小贷资产管理交易平台 - 前端项目

## 预装环境
1. [nodejs](https://nodejs.org/en/)(^4.1.0)
2. npm(^2.14.0)
3. bower(^1.7.0) 安装：npm install -g bower
4. 全局grunt-cli  安装：npm install -g grunt-cli
5. graphicsmagick(or imagemagick) 安装：brew install graphicsmagick(or sudo yum install imagemagick)

## 项目初始化
	npm run init // 下载kt-frontend-common并组装，下载node_modules, bower_components
	
## 开发
	grunt live // 本地开发模式
## 本地构建
	grunt build(or grunt)
## 本地打包预发预览
	grunt server // 构建后并启动本地服务
## 部署
1. 测试环境：
	`mina deploy stage=development [br={:branch}] [cmbr={:common_branch}]`
	
	> 可选参数： br => 部署的项目分支，cmbr => 部署的kt-frontend-common项目分支，默认都为test分支
2. 线上环境：
	
	`mina deploy stage=production02 （02机器）/
	mina deploy stage=production03 （03机器）`

## 环境搭建问题汇总：

1. 依赖kt-frontend-common项目，clone到本地后软链到app/common
1. gm & convert命令 需要提前安装graphicsmagick 或者 imagemagick  (mac :brew install or centos: sudo yum install imagemagick)
1. node_modules问题
	1. phantomjs安装下载超时，手动浏览器下载后，复制到错误提示所在的目录
    
    
