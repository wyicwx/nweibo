var lib = require('../lib/lib.js'),
	views = lib.lib_views;
/*
 * 个人主页
 */
exports.indexAction = function(req,res) {
	var user = lib.lib_user(req);
	if(user.checkLogin()) {
		return res.redirect('/home/index');
	}
	user.getTopuser(10,function(back,data) {
		if(!back) data = [];
		user.getIndexAuthenticationPeople(function(back,auth) {
			if(!back) auth = [];
			user.getIndexweibo(function(back,weibo) {
				var weiboBody = "";
				if(!weibo) {
					weiboBody = "当前没有发生的事情";
				} else {
					for(var i = 0; i < weibo.length;i++) {
						weiboBody += views.index_weibo(weibo[i]);
					}
				}
				return res.template({
					layout:true,
					bodyCss:['/css/index/index-global.css','/css/index/tpl.css'],
					bodyJs:['/js/jquery-1.7.1.min.js','/js/index.js'],
					top:data,
					weiboBody: weiboBody,
					auth:auth
				});
			})
		})
	})
};

/*
 * 注册页面
 */
exports.signupAction = function(req,res) {
	if(req.method === "POST") {
		var user = lib.lib_user(req);
		user.register(function(back,data) {
			if(!!back) {
				user.setSession();
				return res.redirect('/home/index');
			} else {
				var error = user.get("errorMessage");
				return res.end(error);
				switch(error) {
					case "ERROR_USER_PASSWORDREPEATCHECK":
						return res.template({layout:false,errorMessage:"两次密码输入不同"});
					case "ERROR_USER_NEWUSERCHECK_USERNAME":
						//TODO 用户名没有填写视图;
					case "ERROR_USER_NEWUSERCHECK_PASSWORD":
						//TODO 密码没有填写
					case "ERROR_USER_USERNAMECHECK":
						return res.template({layout:false,errorMessage:"帐号已存在"});
					default:
						return res.end(error);
				}
			}
		})
	} else {
		return res.template({
			layout:true,
			bodyCss:['/css/index/index-global.css','/css/index/tpl.css'],
			bodyJs:['/js/jquery-1.7.1.min.js']
		});
	}
};

/*
 * 登录页面（提交地址）
 */
exports.loginAction = function(req,res) {
	var user = lib.lib_user(req);
	if(user.checkLogin()) {
		return res.redirect('/home/index');
	};
	if(req.method === "POST") {
		user.login(function(back,data) {
			if(!!back) return res.redirect('/home/index');
			switch(user.get("errorMessage")) {
				default: res.end(user.get("errorMessage"))
			}
		});
	} else {
		return res.redirect('/');
	}
};

/*
 * 注销提交
 */
exports.logoutAction = function(req,res) {
	var user = lib.lib_user(req);
	if(user.checkLogin()) {
		user.destroySession();
	}
	return res.redirect('/');
};
