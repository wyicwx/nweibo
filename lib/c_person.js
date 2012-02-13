/**
 * @name: person
 * @author: maple
 */
var db = require('./c_db.js');
var uid = require('./function/id.js').uid;

var person = function() {};
person.prototype = new db.oop();
person.prototype.construction = person;

/*
 * @name: getCollection
 * @param: null
 * @overview: 获取对应用户集合
 */
person.prototype._getCollection = function() {
	return this.db_get_collection("user");
};

/*
 * @name: getCollection_inbox
 * @param: uid(Number)
 * @overview: 获取收件箱集合
 */
person.prototype._getCollection_inbox = function(uid) {
	uid = uid||this.get("session").uid;
	return this.db_get_collection("inbox." + uid);
};

/*
 * @name: _getCollection_feeds
 * @param: null
 * @overview: 获取feed集合
 */
person.prototype._getCollection_feeds = function() {
	return this.db_get_collection("feeds");
};

/*
 * @name: getCollection_outbox
 * @param: uid(Number)
 * @overview: 获取发件箱集合
 */
person.prototype._getCollection_outbox = function(uid) {
	uid = uid||this.get("session").uid;
	return this.db_get_collection("outbox." + uid);
};

/*
 * @name: _getCollection_concern
 * @param: uid(Number)
 * @overview: 获取关注集合
 */
person.prototype._getCollection_concern = function(uid) {
	uid = uid||this.get("session").uid;
	return this.db_get_collection("concern." + uid);
};

/*
 * @name: _getCollection_follower
 * @param: uid(Number)
 * @overview: 获取粉丝集合
 */
person.prototype._getCollection_follower = function(uid) {
	uid = uid||this.get("session").uid;
	return this.db_get_collection("follower." + uid);
};

/*
 * @name: person_get_newuser
 * @param: userinfo(obj)
 * @overview: 设置并返回新用户文档对象，保证文档结构正确
 */
person.prototype.person_get_newuser = function(userinfo) {
	var obj = new Object();
	obj.nickname = userinfo.nickname;
	obj.username = userinfo.username;
	obj.password = userinfo.password;
	obj.email = userinfo.email;
	obj.lastupdate = new Date();
	obj.lastlogin = obj.lastupdate;
	obj.uid = uid();
	obj.concern = new Array();
	obj.concernNum = 0;
	obj.followerNum = 0;
	obj.follower = new Array();
	obj.avatarImage = "";
	obj.authentication = false;
	obj.signupDate = new Date();
	var check = this.person_data_check(obj);
	if(check === true) {						//返回全等于true
		return obj;
	} else {
		return check;							//返回未赋值属性信息
	}
};

/*
 * @name: person_get_newlogin
 * @param: logininfo(Object)
 * @overview: 设置并返回登录对象
 */
person.prototype.person_get_newlogin = function(logininfo) {
	var obj = new Object();
	obj.username = logininfo.username;
	obj.password = logininfo.password;
	var check = this.person_data_check(obj);
	if(check === true) {						//返回全等于true
		return obj;
	} else {
		return check;							//返回未赋值属性信息
	}
};

/*
 * @name: person_data_check
 * @param: obj(Object)
 * @overview: 检查是否每个属性都有值
 */
person.prototype.person_data_check = function(obj) {
	for(var i in obj) {
		if(typeof obj[i] === "undefined") {
			return i;								//当有值是错误时，返回该属性名称
		}
	}
	return true;
};

/*
 * @name: person_get_newinbox
 * @param: uid(String))
 * @overview: 设者并返回一个新的微博收发文档对象
 */
person.prototype.person_get_newbox = function(uid) {
	var obj = new Object();
	obj.uid = uid;
	obj.box = new Array();
	return obj;
};

/*
 * @name: person_get_userinfo
 * @param: next(Function)
 * @overview: 获取用户信息
 */
person.prototype.person_get_userinfo = function(uid,next) {
	var user = this._getCollection();
	this.db_findOne.call(user,{uid:uid},function(err,data) {
		if(err) throw err;
		if(!data) return next(false);
		return next(true,data);
	});
};
exports.oop = person;