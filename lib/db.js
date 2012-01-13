/**
 * @name: db.js
 * @author: maple
 * @overview: 数据库操作
 */
var lconfig = require('./lib_config.js'),
	mongo = require("mongoskin");

//数据库连接设置
var dbUrl = lconfig.dbConfig["host"] + ":" + 
			lconfig.dbConfig["ports"] + "/" + 
			lconfig.dbConfig["db"];

//设置数据库
var db = mongo.db(dbUrl);

//数据库类
var db_class = function() {};
db_class.prototype.db_get_collection = function(collection) {
	var collection = collection('.');
	
}

db_class.prototype.constructor = db_class;

exports.oop = new Function();//TODO 被继承的数据库类

