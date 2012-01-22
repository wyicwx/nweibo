/**
 * @author maple
 */
var person = require('./c_person.js'),
	message = require('./message.js');

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
	var inbox = this._getCollection_inbox();
	var outbox = this._getCollection_outbox();
	var that = this;
	this.db_update.call(inbox,{uid:this.get("session").uid},{$push:{box:obj}},function(err) { if(err)throw err});
	this.db_update.call(outbox,{uid:this.get("session").uid},{$push:{box:obj}},function(err) { if(err)throw err});
	this.set("logMessage",obj);
	this.pushWeibo(function(bl) {
		if(bl === true) return next(true);
		that.set("errorMessage","ERROR_SPEAKERS_PUBLISHWEIBO_PUSHWEIBO");
		next(false);
	})
};

/*
 * @name: pushWeibo
 * @param: next(Function)
 * @overveiw: 微博推函数
 */
speakers.prototype.pushWeibo = function(next) {
	var user = this._getCollection();
	var inbox = this._getCollection_inbox();
	var that = this;
	var logMessage = this.get('logMessage');
	this.db_findOne.call(user,{uid:this.get("session").uid,username:this.get("session").username},function(err,data) {
		if(err) throw err;
		for(var i in data.concern) {
			that.db_update.call(inbox,{uid:data.concern[i].uid},{$push:{box:logMessage}},function(err) {if(err) throw err});
		}
		next(true);
	})
};

exports.speakers = speakers;
