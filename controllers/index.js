var lib = require('../lib/lib.js');

exports.index = function(req,res) {
	var user = lib.lib_user();
	if(user.checkLogin(req)) {
		return res.redirect('/home/index');
	}
	return res.template({layout:false});
};

exports.signup = function(req,res) {
	if(req.method === "POST") {
		if(req.body.password !== req.body.repassword) {
			return res.template({layout:false,errorMessage:"两次密码输入不同"});
		};
		var user = lib.lib_user();
		var info = user.newuserCheck(req,res);
		if(typeof info !== "object") {			//表单没有填写正确
			switch(info) {
				case 1:
					return res.template({layout:false,errorMessage:res.newuserCheck_error});
			}
		};
		user.usernameCheck(info,function(err,data) {		//检测帐号是否存在
			if(err) {
				throw err;
			};
			if(data) {
				return res.template({layout:false,errorMessage:"帐号已存在"});
			}  else {
				user.register(info,function(err,data) {		//注册处理
					if(err) {
						throw err;
					}
					user.setSession(req,info);
					return res.redirect('/home/index');
				})
			}
		});
	} else {
		return res.template({layout:false});
	}
};

exports.login = function(req,res) {
	var user = lib.lib_user();
	if(user.checkLogin(req)) {
		return res.redirect('/home/index');
	};
	if(req.method === "POST") {
		var login = user.loginCheck(req,res);
		if(typeof login !== "object") {
			switch(login) {
				case 1:
					return res.end(res.loginCheck_error);		//TODO
			}
		};
		user.usernameCheck(login,function(err,data) {
			if(err) {
				throw err;
			}
			if(data) {
				if(data.password = login.password) {
					user.setSession(req,data);
					return res.redirect('/home/index');
				} else {
					return res.end("帐号或密码错误");
				}
			} else {
				return res.end("帐号不存在，请注册");
			}
		});
	} else {
		return res.redirect('/');
	}
};

exports.logout = function(req,res) {
	var user = lib.lib_user();
	if(user.checkLogin(req)) {
		user.destroySession(req);
	}
	return res.redirect('/');
};
