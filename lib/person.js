/**
 * @name: person
 * @author: maple
 */
var db = require('./db.js');
var uid = require('./function/id.js').uid;

var person = function() {};
person.prototype = new db.oop();
person.prototype.construction = person;

//设置并返回新用户文档对象，保证文档结构正确
person.prototype.person_get_newuser = function(userinfo) {
	var obj = new Object();
	obj.nickname = userinfo.nickname;
	obj.username = userinfo.username;
	obj.password = userinfo.password;
	obj.email = userinfo.email;
	obj.lastupdate = new Date();
	obj.lastlogin = obj.lastupdate;
	obj.uid = uid();
	var check = this.person_data_check(obj);
	if(check === true) {						//返回全等于true
		return obj;
	} else {
		return check;							//返回未赋值属性信息
	}
};

//设置并返回登录对象
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

//检查是否每个属性都有值
person.prototype.person_data_check = function(obj) {
	for(var i in obj) {
		if(typeof obj[i] === "undefined") {
			return i;								//当有值是错误时，返回该属性名称
		}
	}
	return true;
};

exports.oop = person;