/**
 * @name: user.js
 * @author: maple
 * @overview: 用户操作库
 */

var person = require('./c_person.js'),
	follower = require('./follower.js').follower,
	Crypto = require("ezcrypto").Crypto;
/*
 * @name: user
 * @param: req(Object)
 * @overview: user构造函数
 */
var user = function(req) {
	this.set("req",req);
	this.set("body",req.body);
	this.set("params",req.params);
	this.set("session",req.session);
	this.set("errorMessage",null);
};

user.prototype = new person.oop();		//user类继承person类
user.prototype.construction = user;		//修正原型construction属性

/*
 * @name: set
 * @param: variable(String),value(String)
 * @overview: 设置变量
 */
user.prototype.set = function(variable,value) {
	this["_user_" + variable] = value; 
};


/*
 * @name: get
 * @param: variable(String)
 * @overview: 获取变量值
 */
user.prototype.get = function(variable) {
	return this["_user_" + variable];
};



/*
 * @name: register
 * @param: null
 * @overview: 注册函数
 */
user.prototype.register = function(next) {
	var that = this;
	if(!this.newuserCheck()) return next(false);
	if(!this.passwordRepeatCheck()) return next(false);
	this.usernameCheck(function(back,data) {
		if(!!back) return next(false);
		that.userSave(function(back,data) {
			if(!back) return next(false,data);
			return next(true,data);
		})
	});


};

/*
 * @name: userSave
 * @param: next(Function)
 * @overview: 存入新用户数据存入数据库
 */
user.prototype.userSave = function(next) {
	var collection = this._getCollection();
	var inbox = this._getCollection_inbox();
	var outbox = this._getCollection_outbox();
	var user = this.get("userobj");
	var that = this;
	var box = this.person_get_newbox(user.uid);
	this.db_insert.call(collection,user,function(err,data) {
		if(err) throw err;
		that.db_upsert.call(outbox,box,box,function(err,d) {
			if(err) throw err;
			that.db_upsert.call(inbox,box,box,function(err,d) {
				if(err) throw err;
				return next(true,data);
			});
		});
	});
};

/*
 * @name: postCheck
 * @param: null
 * @overview: 注册新用户表单提交检查
 */
user.prototype.newuserCheck = function() {
	var user = this.person_get_newuser(this.get("body"));
	if(typeof user === "object") {
		user.password = this.passwordSecurity(user.password);
		this.set("userobj",user);
		return true;
	} else {
		this.set("errorMessage","ERROR_USER_NEWUSERCHECK_" + user.toUpperCase());
		return false;							//表单某项没有输入
	};
};

/*
 * @name: usernameCheck
 * @param: next(Function)
 * @overview: 检测用户名是否存在
 */
user.prototype.usernameCheck = function(next) {
	var collection = this._getCollection();
	var that = this;
	this.db_findOne.call(collection,{username:this.get("userobj").username},function(err,data) {
		if(err) throw err;
		if(!data) {														//返回true为存在
			that.set("errorMessage","ERROR_USER_USERNAMECHECK");
			return next(false,data);
		}
		if(next) return next(true,data);
	});
};

/*
 * @name: userpasswordCheck
 * @param: null
 * @overview: 用户密码核对
 */
user.prototype.userpasswordCheck = function(next) {
	var that = this;
	this.usernameCheck(function(back,data) {
		if(!back) {
			that.set("errorMessage","ERROR_USER_USERPASSWORDCHECK_USERNOTEXIST");
			return next(false,data);
		}
		if(data.password !== that.get("loginobj").password) {
			that.set("errorMessage","ERROR_USER_USERPASSWORDCHECK");
			return next(false,data);
		}
		that.set("userobj",data);
		return next(true,data);
	});
}
/*
 * @name: passwordRepeatCheck
 * @param: null
 * @overview: 检查密码重复是否相同
 */
user.prototype.passwordRepeatCheck = function() {
	var body = this.get("body");
	if(body.password !== body.repassword) {
		this.set("errorMessage","ERROR_USER_PASSWORDREPEATCHECK");
		return false;
	}
	return true;
};

/*
 * @name: setSession
 * @param: info(Object)
 * @overview: 设置session
 */
user.prototype.setSession = function(info) {
	var session = this.get("session");
	info = info||this.get("userobj");
	session.username = info.username;
	session.nickname = info.nickname;
	session.uid = info.uid;
	return true;
};

/*
 * @name: destroySession
 * @param: req(Object)
 * @overview: 清除session
 */
user.prototype.destroySession = function() {
	var session = this.get("session");
	session.destroy(function(err,data) {
		if(err) throw err;
		return true;
	});
};

/*
 * @name: passwordSecurity
 * @param: password(String)
 * @overview: 密码加密
 */
user.prototype.passwordSecurity = function(password) {		//用户密码加密函数
	password = Crypto.MD5(password);
	return password;
};

/*
 * @name: loginCheck
 * @param: null
 * @overview: 登录提交表单检测
 */
user.prototype.loginCheck = function() {
	var login = this.person_get_newlogin(this.get("body"));
	if(typeof login === "object") {
		login.password = this.passwordSecurity(login.password);
		this.set("loginobj",login);
		this.set("userobj",login);
		return true;
	} else {
		this.set("errorMessage","ERROR_USER_LOGINCHECK_" + login.toUpperCase());
		return false;							//表单某项没有输入
	};
};

/*
 * @name: updateInfo
 * @param: 
 * @overview: 更新用户信息
 */
user.prototype.updateInfo = function() {
	var collotion = this._getCollection();
	this.db_update.call(collotion,
		{username:this.get("session").username,uid:this.get("session").uid},
		{$set:{lastlogin:new Date()}},function() {}
	);
};

/*
 * @name: checkLogin
 * @param: null
 * @overview: 检测是否登录
 */
user.prototype.checkLogin = function() {
	var session = this.get("session");
	if(!session["username"]) {
		this.set("errorMessage","ERROR_USER_CHECKLOGIN");
		return false;
	}
	this.set("username",session.username);
	this.set("uid",session.uid);
	this.set("nickname",session.nickname);
	return true;
};

/*
 * @name: login
 * @param: null
 * @overview: 登录函数
 */
user.prototype.login = function(next) {
	var that = this;
	if(!this.loginCheck()) return next(false);			//登录提交表单检测
	this.userpasswordCheck(function(back,data) {
		if(!back) return next(false,data);
		that.setSession();
		that.updateInfo();
		var followerObj = new follower(that.get("req"));
		followerObj.login();							//粉丝上线
		return next(true,data);
	}) 
};

exports.user = function(a) {
	return new user(a);
};
