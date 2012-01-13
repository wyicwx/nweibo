var	config = require('./config.js'),
	//mvc 库加载
	mvc = require('./lib/mvc/mvc.js'),
	//http server对象
	app = mvc.app;

app.listen(config.port);

console.log('Server start http://localhost:' + config.port);