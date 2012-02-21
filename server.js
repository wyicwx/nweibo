var	config = require('./config.js'),
	//routing加载
	routing = require('routing'),
	//websocket.io加载
	io = require('socket.io');

//初始化routing
routing.init();

//http server对象
var app = routing.app;
//websocket.listen(app);

routing.listen(config.port);

console.log('Server start http://localhost:' + config.port);
