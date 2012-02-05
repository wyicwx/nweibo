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
	var user = this._getCollection();
	var session = this.get("session");
	var that = this;
	var uid = +this.get("body").uid;
	this.person_get_userinfo(uid,function(back,data) {		//查询该uid是否存在
		if(!back) {
			that.set("errorMessage","ERROR_FOLLOWER_FOLLOW_USERNOTEXIST");
			return next(false);
		};
		//检测关注提交id，是否已经关注
		that.followCheck(uid,function(back,data) {
			if(!back) return next(false);
			//增加自己关注列表计数器
			that.db_update.call(user,{uid:session.uid},{$inc:{concernNum:1},$push:{concern:uid}},function(err,data) {
				if(err) throw err;
				session.concernNum++;
				that.set("session",session);
			});
			//增加别人粉丝列表计数器
			that.db_update.call(user,{uid:uid},{$inc:{followerNum:1},$push:{follower:session.uid}},function(err,data) {if(err) throw err});
			next(true);
		});
	});
};

/*
 * @name: followCheck
 * @param: uid(Number),next(Function)
 * @overview: 关注检测
 */
follower.prototype.followCheck = function(uid,next) {
	var body = this.get("body");
	var session = this.get("session");
	uid = uid||body.uid;
	if(uid == session.uid) {
		this.set("errorMessage","ERROR_FOLLOWER_FOLLOWCHECK_NOTFOLLOWSELF");
		return next(false);
	};
	var that = this;
	var user = this._getCollection();
	this.db_findOne.call(user,{concern:{$in:[uid]}},function(err,data) {			//查询是否已经关注
		if(err) throw err;
		if(!data) return next(true);
		that.set("errorMessage","ERROR_FOLLOWER_FOLLOWERCHECK_FOLLOWED");
		return next(false);
	});
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
