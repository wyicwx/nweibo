/**
 * @author maple
 */
var person = require('./c_person.js'),
	message = require('./message.js'),
	User = require('./user.js').user;

function speakers(req) {
	this.set("req",req);
	this.set("body",req.body);
	this.set("params",req.params);
	this.set("session",req.session);
	this.set("errorMessage",null);
};
speakers.prototype = new person.oop();
speakers.prototype.constructor = speakers;

/*
 * @name: set
 * @param: variable(String),value(String)
 * @overview: 设置变量
 */
speakers.prototype.set = function(variable,value) {
	this["_speakers_" + variable] = value;
};


/*
 * @name: get
 * @param: variable(String)
 * @overview: 获取变量值
 */
speakers.prototype.get = function(variable) {
	return this["_speakers_" + variable];
};

/*
 * @name: publishWeibo
 * @param: next(Function)
 * @overview: 微博发布函数
 */
speakers.prototype.publishWeibo = function(next) {
	var weibo = new message.message(this.get("req"));
	var obj = weibo.getNewweibo(this.get("body"));
	if(weibo.dataCheck(obj) !== true) {
		this.set("errorMessage","ERROR_FOLLOWER_PUBLISHWEIBO_" + obj.toUpperCase());
		return next(false);
	};
	var outbox = this._getCollection_outbox();
	var that = this;
	this.db_insert.call(outbox,obj,function(err) { if(err)throw err});
	var feeds = this._getCollection_feeds();
	this.db_insert.call(feeds,obj,function(err,data) {if(err) throw err});
	var user = new User(this.get("req"));
	user.pullWeiboDeal([obj],function(back,data) {
		next(true,data[0]);
	})
};

/*
 * @name: pushWeibo
 * @param: next(Function)
 * @overveiw: 微博推函数
 */
speakers.prototype.pushWeibo = function(next) {

};

exports.speakers = speakers;
