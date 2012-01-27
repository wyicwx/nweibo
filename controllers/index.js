var lib = require('../lib/lib.js');

/*
 * 个人主页
 */
exports.index = function(req,res) {
	var user = lib.lib_user(req);
	if(user.checkLogin()) {
		return res.redirect('/home/index');
	}
	return res.template({layout:false});
};

/*
 * 注册页面
 */
exports.signup = function(req,res) {
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
		return res.template({layout:false});
	}
};

/*
 * 登录页面（提交地址）
 */
exports.login = function(req,res) {
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
exports.logout = function(req,res) {
	var user = lib.lib_user(req);
	if(user.checkLogin()) {
		user.destroySession();
	}
	return res.redirect('/');
};
