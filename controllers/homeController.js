var lib = require('../lib/lib.js'),
	views = lib.lib_views;

exports.indexAction = function(req,res) {
	var user = lib.lib_user(req);
	if(!user.checkLogin()) {
		return res.redirect('/');
	};
	var viewVar = user.get("session");
	user.pullWeibo(function(bl,data) {		//data为获取到的收件箱集合中自己的文档
		if(bl === true) {
			var inboxBody = new String();
			if(data.length < 1) {
				inboxBody = "目前没有新微博，快去关注别人吧！";
			} else {
				for(var i = 0; i < data.length;i++) {
					inboxBody+=views.weibo(data[i]);
				}
			}
			return res.template({
				layout:true,
				bodyCss:['/css/home/home-global.css','/css/home/tpl.css'],
				bodyJs:['/js/m.1.2.js','/js/home/weiboOperate.js','/js/jquery-1.7.1.min.js'],
				variable:viewVar,
				inboxBody:inboxBody
			});
		}
		return res.end(user.get("errorMessage"));
	});

};
