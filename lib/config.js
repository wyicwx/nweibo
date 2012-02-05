/**
 * @name: lib_config.js
 * @author: maple
 * @overview:定义语义化宏和配置
 */
/*
 * 存储数据库连接配置
 */
var dbConfig = {
	"username" : "",
	"password" : "",
	"host": "localhost",
	"ports": "27017",
	"db": "test"
}

/**
  *	存储微博类型的语义化宏
  */
var weiboType = {
	"WEIBO_TYPE_NORMAL": "weibo",		//普通状态微博
	"WEIBO_TYPE_IMAGE": "imgweibo",		//图片微博
	"WEIBO_TYPE_MUSIC": "musicweibo",		//音乐微博
	"WEIBO_TYPE_VIDEO": "videoweibo",		//视频微博
	"WEIBO_TYPE_FORWARD": "traweibo"		//转发微博
};

/**
 * 存储微博活跃更新时间和过期时间
 */
var DAY = 24*60*60*1000;		//1天(毫秒)
var dataType = {
	"LOGIN_TYPE_UPDATE":3*DAY,		//3天(毫秒)
	"LOGIN_TYPE_EXPIRE":10*DAY		//10天(毫秒)
}



exports.weiboType = weiboType;
exports.dataType = dataType;
exports.dbConfig = dbConfig;