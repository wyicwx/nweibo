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
 * @param: null
 * @overview: 获取收件箱集合
 */
person.prototype._getCollection_inbox = function() {
	return this.db_get_collection("user.inbox");
};

/*
 * @name: getCollection_outbox
 * @param: null
 * @overview: 获取发件箱集合
 */
person.prototype._getCollection_outbox = function() {
	return this.db_get_collection("user.outbox");
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
}

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
}
exports.oop = person;