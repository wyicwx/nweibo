var config = exports;
//定义默认主页
config.web_default = 'index'; 		

//定义默认controller
config.controller_default = 'index';
//是否开启报错
config.debug = 1;

//root目录路径
config.rootPath = __dirname + '/../..';

//存储controller对象文件夹前缀
config.folderPrefix = '__dir__';

//设置session的secret
config.session_secret = 'maple';
