var lib = require('../lib/lib.js'),
	views = lib.lib_views;

exports.index = function(req,res) {
	var user = lib.lib_user(req);
	if(!user.checkLogin()) {
		return res.redirect('/');
	};
	var viewVar = user.get("session");
	user.getSelfInbox(function(bl,data) {		//data为获取到的收件箱集合中自己的文档
		if(bl === true) {
			var inboxBody = new String();
			if(data.box.length < 1) {
				inboxBody = "目前没有新微博，快去关注别人吧！";
			} else {
				for(var i = data.box.length-1; i > data.box.length-1-15;i--) {
					if(i<0) break;
					inboxBody+=views.weibo(data.box[i]);
				}
			}
			return res.template({
				layout:true,
				bodyCss:['/css/home/home-global.css','/css/home/tpl.css'],
				bodyJs:['/js/m.1.2.js','/js/home/weiboOperate.js'],
				variable:viewVar,
				inboxBody:inboxBody
			});
		}
		return res.end(user.get("errorMessage"));
	});

};
