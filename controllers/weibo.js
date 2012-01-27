var lib = require('../lib/lib.js');
	ejs = require('ejs');
	views = lib.lib_views;

/*
 * 微博提交
 */
exports.add = function(req,res) {
	if(req.method == "GET") throw new Error('404');
	var speaker = new lib.lib_speakers(req);
	speaker.publishWeibo(function(bl,data) {
		if(bl === false) {
			return res.end(speaker.get("errorMessage"));
		}
		return res.end(views.weibo(data));
		//return res.end('<div>success</div>');
	})
};

/*
 * @name:关注
 * @overview: POST提交uid参数
 */
exports.follow = function(req,res) {
	if(req.method == "GET") throw new Error('404');
	var follower = new lib.lib_follower(req);
	follower.follow(function(bl,data) {
		if(!bl) return res.end(follower.get('errorMessage'));
		res.end('success');
	})
};
