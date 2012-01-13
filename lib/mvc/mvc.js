/*mvc库（严格mvc的目录结构）
 * /controllers：自动设置controllers文件夹下面路由，请求/map/index会转到对应controllers下map.js内的index函数
 * /public:放置静态文件
 * /views:放置视图文件		
 * /views/error:放置错误视图文件
 * 在任何时刻抛出异常throw new Error(x);x为对应http错误代码会自动调用对应error下的视图
 * request.template 显示视图函数
 * request.viewPath 存储请求路径变量
 * url请求中按controller优先查找,若无则视为folder,找到action后,后面的url为参数
 * 例如:	 /index/index/type/1/method/get		找到index的controller下面的index的action,get参数为type=1,method="get";
 * 
 */

var express = require('express'),
	ejs = require('ejs'),
	url = require('url'),
	path = require('path'),
	errorCode = require('./error.js').errorCode,
	controllers = require('./controllers.js').controllers,
	stringBuffer = require('./libString.js').stringBuffer,
	config = require('./config.js');	

var app = express.createServer();
app.use(express.cookieParser());		//启用cookie中间件
app.use(express.bodyParser());			//启用post数据接受中间件
//app.use(express.static(config.rootPath + '/public', {maxAge: 3600000 * 24 * 30}));	//设置静态文件夹,生产模式
app.use(express.static(config.rootPath + '/public', {maxAge: 1}));	//开发模式

app.set('view engine','html');
app.set('view',config.rootPath + '/view');		//设置view文件夹
app.register('html',ejs);			//使用ejs模板引擎

//不用route解析的文件
var publicFile = new RegExp(/\..*$/);

//路由解析设置
app.get('/*',function(req,res) {
	var reqUrl = url.parse(req.url).path;
	if(publicFile.test(reqUrl)) return;	//如果请求为静态文件不使用mvc路由转向
	reqUrl = path.normalize(reqUrl);		//格式化url路径

	var urlPath = stringBuffer(reqUrl.split('/')).remove().getArray();
	
	if(urlPath.length == 0) {		//设置默认路由转向
		return res.redirect('/' + config.controller_default);
	}
	//路由文件查找
	var routeFunction = controllers.findSet({path:urlPath,request:req});
	if(routeFunction) {
		res.template = function(obj) {
			return res.render(req.viewPath.join('/'),obj);
		};
		return routeFunction(req,res);
	} else {
		throw new Error(404);
	}
});

//路由解析设置
app.post('/*',function(req,res) {
	var reqUrl = url.parse(req.url).path;
	if(publicFile.test(reqUrl)) return;	//如果请求为静态文件不使用mvc路由转向
	reqUrl = path.normalize(reqUrl);		//格式化url路径
	var urlPath = stringBuffer(reqUrl.split('/')).remove().getArray();
	
	if(urlPath.length == 0) {		//设置默认路由转向
		return res.redirect('/' + config.controller_default);
	}
	//路由文件查找
	var routeFunction = controllers.findSet({path:urlPath,request:req});
	if(routeFunction) {
		res.template = function(obj) {
			return res.render(req.viewPath.join('/'),obj);
		};
		return routeFunction(req,res);
	} else {
		throw new Error(404);
	}
});

//错误解析设置
if(!config.debug) {
	app.error(function(err, req, res, next) {
		for(var i in errorCode) {
			if(err.message == i) {
				return errorCode[i](res);
			}
		}
		return errorCode['500'](res);
	});
};

exports.app = app;
exports.controllers = controllers;
