var person = require('./c_person.js'),
	message = require('./message.js');

function follower(req) {
	this.set("req",req);
	this.set("body",req.body);
	this.set("params",req.params);
	this.set("session",req.session);
	this.set("errorMessage",null);
};
follower.prototype = new person.oop();
follower.prototype.construction = follower;

/*
 * @name: set
 * @param: variable(String),value(String)
 * @overview: 设置变量
 */
follower.prototype.set = function(variable,value) {
	this["_follower_" + variable] = value;
};


/*
 * @name: get
 * @param: variable(String)
 * @overview: 获取变量值
 */
follower.prototype.get = function(variable) {
	return this["_follower_" + variable];
};

/*
 * @name: concern
 * @param: uid(Number)
 * @overview: 关注函数
 */
follower.prototype.concern = function(uid) {
	
};

/*
 * @name: login
 * @param: null
 * @overview: 作为粉丝登录
 */
follower.prototype.login = function() {
	
};



exports.follower = follower;
