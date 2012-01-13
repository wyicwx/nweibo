/**
 * @name: user.js
 * @author: maple
 * @overview: 用户操作库
 */
var person = require('./person.js');

var user = function() {};				
user.prototype = new person.oop();		//user类继承person类
user.prototype.construction = user;		//修正原型construction属性

user.prototype.set = function(variable,value) {
	this["_user_" + variable] = value;
};
user.prototype.get = function(variable) {
	return this["_user_" + variable];
};
user.prototype.register = function() {
	
};
