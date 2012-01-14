/**
 * @name: db.js
 * @author: maple
 * @overview: 数据库操作
 */
var lconfig = require('./config.js'),
	mongo = require("mongoskin");

//数据库连接设置
var dbUrl = lconfig.dbConfig["host"] + ":" +
			lconfig.dbConfig["ports"] + "/" +
			lconfig.dbConfig["db"];

//设置数据库
var db = mongo.db(dbUrl);

//数据库类
var db_class = function() {};

db_class.prototype.db_get_collection = function(collections) {		//获取集合函数
	var collections = collections.split('.');
	var db_pointer = db;					//存储集合指针
	collections.forEach(function(collection) {
		db_pointer = db_pointer.collection(collection);
	});
	return db_pointer;
};

exports.oop = db_class;

