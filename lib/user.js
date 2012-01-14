/**
 * @name: user.js
 * @author: maple
 * @overview: 用户操作库
 */

var person = require('./person.js'),
	Crypto = require("ezcrypto").Crypto;

var user = function() {};
user.prototype = new person.oop();		//user类继承person类
user.prototype.construction = user;		//修正原型construction属性

/*
 * @name: getCollection
 * @param: null
 * @overview: 获取对应用户集合
 */
user.prototype.getCollection = function() {
	return this.db_get_collection("user");
};

/*
 * @name: register
 * @param: null
 * @overview: 注册函数
 */
user.prototype.register = function(user,next) {
	var collection = this.getCollection();
	collection.insert(user,next,false,false);
};

/*
 * @name: postCheck
 * @param: req(Object),res(Object)
 * @overview: 注册新用户表单提交检查
 */
user.prototype.newuserCheck = function(req,res) {
	var user = this.person_get_newuser(req.body);
	if(typeof user === "object") {
		user.password = this.passwordSecurity(user.password);
		return user;
	} else {
		res.newuserCheck_error = user;
		return 1;							//表单某项没有输入
	};
};

/*
 * @name: usernameCheck
 * @param: username(String)
 * @overview: 检测用户名是否存在
 */
user.prototype.usernameCheck = function(user,next) {
	var collection = this.getCollection();
	collection.findOne({username:user.username},next);
};

/*
 * @name: setSession
 * @param: req(Object),info(Object)
 * @overview: 设置session
 */
user.prototype.setSession = function(req,info) {
	req.session.username = info.username;
	req.session.nickname = info.nickname;
	req.session.uid = info.uid;
};

/*
 * @name: destroySession
 * @param: req(Object)
 * @overview: 清除session
 */
user.prototype.destroySession = function(req) {
	req.session.destroy();
};

/*
 * @name: passwordSecurity
 * @param: password(String)
 * @overview: 密码加密
 */
user.prototype.passwordSecurity = function(password) {		//用户密码加密函数
	password = Crypto.MD5(password);
	return password;
}

/*
 * @name: loginCheck
 * @param: req(Object),res(Object)
 * @overview: 登录提交表单检测
 */
user.prototype.loginCheck = function(req,res) {
	var login = this.person_get_newlogin(req.body);
	if(typeof login === "object") {
		login.password = this.passwordSecurity(login.password);
		return login;
	} else {
		res.loginCheck_error = login;
		return 1;							//表单某项没有输入
	};
}

/*
 * @name: checkLogin
 * @param: req(Object),res(Object)
 * @overview: 检测是否登录
 */
user.prototype.checkLogin = function(req) {
	if(req.session.username) {
		return true;
	}
	return false;
}

exports.user = function(a) {
	return new user(a);
};
