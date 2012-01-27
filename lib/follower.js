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
 * @name: follow
 * @param: next(Function)
 * @overview: 关注函数
 */
follower.prototype.follow = function(next) {
	if(this.followCheck()) return next(false);
	var user = this._getCollection();
	var session = this.get("session");
	var body = this.get("body");
	this.db_update.call(user,{uid:session.uid,username:session.username},{$push:{concern:{uid:body.uid}}},function(err,data) {
		if(err) throw err;
		next(true);
	});
};

/*
 * @name: followCheck
 * @param: uid(Number)
 * @overview: 关注检测
 */
follower.prototype.followCheck = function(uid) {
	var body = this.get("body");
	var session = this.get("session");
	uid = uid||body.uid;
	if(uid == session.uid) {
		this.set("errorMessage","ERROR_FOLLOWER_FOLLOWCHECK_NOTFOLLOWSELF");
		return false;
	};
	var concern = session.concern;
	for(var i in concern) {
		if(concern[i].uid == uid) {
			this.set("errorMessage","ERROR_FOLLOWER_FOLLOWERCHECK_FOLLOWED");
			return false;
		}
	}
	return true;
};

/*
 * @name: comment
 * @param: null
 * @overview: 发布评论函数
 */
follower.prototype.comment = function() {
	
};
/*
 * @name: login
 * @param: null
 * @overview: 作为粉丝登录
 */
follower.prototype.login = function() {
	
};



exports.follower = follower;
