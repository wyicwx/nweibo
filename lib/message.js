var db = require('./c_db.js'),
	wid = require('./function/id.js').uid;


function message(req) {
	this.set("req",req);
	this.set("body",req.body);
	this.set("params",req.params);
	this.set("session",req.session);
	this.set("errorMessage",null);
};
message.prototype = new db.oop();
message.prototype.construction = message;

/*
 * @name: set
 * @param: variable(String),value(String)
 * @overview: 设置变量
 */
message.prototype.set = function(variable,value) {
	this["_message_" + variable] = value;
};


/*
 * @name: get
 * @param: variable(String)
 * @overview: 获取变量值
 */
message.prototype.get = function(variable) {
	return this["_message_" + variable];
};

/*
 * @name: getCollection_inbox
 * @param: null
 * @overview: 获取收件箱集合
 */
message.prototype._getCollection_inbox = function() {
	return this.db_get_collection("user.inbox");
};

/*
 * @name: getCollection_outbox
 * @param: null
 * @overview: 获取发件箱集合
 */
message.prototype._getCollection_outbox = function() {
	return this.db_get_collection("user.outbox");
};

/*
 * @name: getNewweibo
 * @param: null
 * @overview: 设置并返回一个微博消息对象
 */
message.prototype.getNewweibo = function() {
	var obj = new Object();
	var body = this.get("body");
	var session = this.get("session");
	obj.nickname = session.nickname;
	obj.uid = session.uid;
	obj.wid = wid();
	obj.content = body.content;
	obj.forwardId = body.forwarId||-1;
	obj.type = body.type;
	obj.publishdate = new Date();
	return obj;
};

/*
 * @name: dataCheck
 * @param: obj(Object)
 * @overview: 检查是否每个属性都有值
 */
message.prototype.dataCheck = function(obj) {
	for(var i in obj) {
		if(typeof obj[i] === "undefined") {
			return i;								//当有值是错误时，返回该属性名称
		}
	}
	return true;
};

/*
 * @name: getInbox
 * @param: uid(Number),next(Function)
 * @overview: 获取收件箱信息
 */
message.prototype.getInbox = function(uid,next) {
	var inbox = this._getCollection_inbox();
	this.db_findOne.call(inbox,{uid:uid},next);
};

exports.message = message;