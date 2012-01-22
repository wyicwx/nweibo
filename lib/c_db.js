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

/*
 * @name: db_get_collection
 * @param: collections(String)
 * @overview: 获取集合函数
 */
db_class.prototype.db_get_collection = function(collections) {		//获取集合函数
	var db_pointer = db.collection(collections);
	return db_pointer;
};

/*
 * @name: db_insert
 * @param: obj(Object),fn(Function)
 * @overview: 数据库insert操作
 */
db_class.prototype.db_insert = function(obj,fn) {
	this.insert(obj,fn);
};

/*
 * @name: db_update
 * @param: obj(Object),fn(Function),whole(Boolean)
 * @overview: 数据库update操作
 */
db_class.prototype.db_update = function(obj,obj2,fn,whole) {
	whole = whole||false;
	this.update(obj,obj2,{upsert:false,multi:whole},fn);
};

/*
 * @name: db_upsert
 * @param: obj(Object),fn(Function),whole(Boolean)
 * @overview: 数据库upsert操作
 */
db_class.prototype.db_upsert = function(obj,obj2,fn,whole) {
	whole = whole||false;
	this.update(obj,obj2,{upsert:true,multi:whole},fn);
};

/*
 * @name: db_findOne
 * @param: obj(Object),fn(Function)
 * @overview: 数据库findOne操作
 */
db_class.prototype.db_findOne = function(obj,fn) {
	this.findOne(obj,fn);
};

/*
 * @name: db_find
 * @param: obj(Object)
 * @overview: 数据库find操作
 */
db_class.prototype.db_find = function(obj) {
	return this.find(obj);
};

exports.oop = db_class;
