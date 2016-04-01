# kt-lode-frontend
小贷资产管理交易平台 - 前端项目
## 环境搭建问题汇总：
1. nodejs >4.1.0
2. npm >2.14.0
3. bower >1.7.0 
4. 依赖kt-frontend-common项目，clone到本地后软链到app/common
1. phantomjs安装下载超时，手动浏览器下载后，复制到错误提示所在的目录
2. gm & convert命令 需要提前安装graphicsmagick 或者 imagemagick  (mac :brew install or centos: sudo yum install imagemagick)
3. node_modules问题
    1. grunt-contrib-imagemin 它依赖的需要imagemin使用4.0.0,否则contents错误
    
