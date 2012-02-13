/**
 * @name: user.js
 * @author: maple
 * @overview: 用户操作库
 */

var person = require('./c_person.js'),
	follower = require('./follower.js').follower,
	Crypto = require('ezcrypto').Crypto,
	Message = require('./message.js').message,
	uid = require('./function/id.js').uid;
/*
 * @name: user
 * @param: req(Object)
 * @overview: user构造函数
 */
var user = function(req) {
	this.set("req",req);
	this.set("body",req.body);
	this.set("params",req.params);
	this.set("session",req.session);
	this.set("errorMessage",null);
};

user.prototype = new person.oop();		//user类继承person类
user.prototype.construction = user;		//修正原型construction属性

/*
 * @name: set
 * @param: variable(String),value(String)
 * @overview: 设置变量
 */
user.prototype.set = function(variable,value) {
	this["_user_" + variable] = value; 
};


/*
 * @name: get
 * @param: variable(String)
 * @overview: 获取变量值
 */
user.prototype.get = function(variable) {
	return this["_user_" + variable];
};



/*
 * @name: register
 * @param: null
 * @overview: 注册函数
 */
user.prototype.register = function(next) {
	var that = this;
	if(!this.newuserCheck()) return next(false);
	if(!this.passwordRepeatCheck()) return next(false);
	this.usernameCheck(function(back,data) {			//防止用户名重复检测
		if(!!back) return next(false);
		that.uidCheck(function(back) {					//防止uid重复检测
			that.setImageAvatar();
			that.userSave(function(back,data) {			//保存到数据库
				//that.db_getDB.createCollection("inbox." + that.get("userobj").uid,{capped:true,size:100000,max:450},function(err,data) {if(err) throw err})		//创建固定集合
				if(!back) return next(false,data);
				return next(true,data);
			})
		});
	});
};

/*
 * @name: userSave
 * @param: next(Function)
 * @overview: 存入新用户数据存入数据库
 */
user.prototype.userSave = function(next) {
	var collection = this._getCollection();
	var outbox = this._getCollection_outbox(this.get("session").uid);
	var user = this.get("userobj");
	this.db_insert.call(collection,user,function(err,data) {
		if(err) throw err;
		return next(true,data);
	});
};

/*
 * @name: postCheck
 * @param: null
 * @overview: 注册新用户表单提交检查
 */
user.prototype.newuserCheck = function() {
	var user = this.person_get_newuser(this.get("body"));
	if(typeof user === "object") {
		user.password = this.passwordSecurity(user.password);
		this.set("userobj",user);
		return true;
	} else {
		this.set("errorMessage","ERROR_USER_NEWUSERCHECK_" + user.toUpperCase());
		return false;							//表单某项没有输入
	};
};

/*
 * @name: setImageAvatar
 * @param: null
 * @overview: 设置头像图片url
 */
user.prototype.setImageAvatar = function() {
	var userobj = this.get("userobj");
	userobj.avatarImage = 'http://www.gravatar.com/avatar/'+Crypto.MD5(userobj.email)+".png?s=50";
	this.set("userobj",userobj);
};

/*
 * @name: usernameCheck
 * @param: next(Function)
 * @overview: 检测用户名是否存在
 */
user.prototype.usernameCheck = function(next) {
	var collection = this._getCollection();
	var that = this;
	this.db_findOne.call(collection,{username:this.get("userobj").username},function(err,data) {
		if(err) throw err;
		if(!data) {														//返回true为存在
			that.set("errorMessage","ERROR_USER_USERNAMECHECK");
			return next(false,data);
		}
		if(next) return next(true,data);
	});
};

/*
 * @name: uidCheck
 * @param: next(Function)
 * @overview: 检测uid是否冲突
 */
user.prototype.uidCheck = function(next) {
	var collection = this._getCollection();
	var that = this;
	var callback = function(err,date) {
		if(err) throw err;
		if(date) {
			var obj = that.get("userobj");
			obj.uid = uid();
			that.set("userobj",obj);
			return that.db_findOne.call(collection,{uid:that.get("userobj").uid},callback); 
		}
		next(true);
	}
	var that = this;
	this.db_findOne.call(collection,{uid:this.get("userobj").uid},callback);
};

/*
 * @name: userpasswordCheck
 * @param: null
 * @overview: 用户密码核对
 */
user.prototype.userpasswordCheck = function(next) {
	var that = this;
	this.usernameCheck(function(back,data) {
		if(!back) {
			that.set("errorMessage","ERROR_USER_USERPASSWORDCHECK_USERNOTEXIST");
			return next(false,data);
		}
		if(data.password !== that.get("loginobj").password) {
			that.set("errorMessage","ERROR_USER_USERPASSWORDCHECK");
			return next(false,data);
		}
		that.set("userobj",data);
		return next(true,data);
	});
}
/*
 * @name: passwordRepeatCheck
 * @param: null
 * @overview: 检查密码重复是否相同
 */
user.prototype.passwordRepeatCheck = function() {
	var body = this.get("body");
	if(body.password !== body.repassword) {
		this.set("errorMessage","ERROR_USER_PASSWORDREPEATCHECK");
		return false;
	}
	return true;
};

/*
 * @name: setSession
 * @param: info(Object)
 * @overview: 设置session
 */
user.prototype.setSession = function(info) {
	var session = this.get("session");
	info = info||this.get("userobj");
	session.username = info.username;
	session.nickname = info.nickname;
	session.uid = info.uid;
	session.email = info.email;
	session.lastupdate = info.lastupdate;
	session.lastlogin = info.lastlogin;
	session.concernNum = info.concernNum;
	session.followerNum = info.followerNum;
	session.avatarImage = info.avatarImage;
	session.authentication = info.authentication;
	return true;
};

/*
 * @name: destroySession
 * @param: req(Object)
 * @overview: 清除session
 */
user.prototype.destroySession = function() {
	var session = this.get("session");
	session.destroy(function(err,data) {
		if(err) throw err;
		return true;
	});
};

/*
 * @name: passwordSecurity
 * @param: password(String)
 * @overview: 密码加密
 */
user.prototype.passwordSecurity = function(password) {		//用户密码加密函数
	password = Crypto.MD5(password);
	return password;
};

/*
 * @name: loginCheck
 * @param: null
 * @overview: 登录提交表单检测
 */
user.prototype.loginCheck = function() {
	var login = this.person_get_newlogin(this.get("body"));
	if(typeof login === "object") {
		login.password = this.passwordSecurity(login.password);
		this.set("loginobj",login);
		this.set("userobj",login);
		return true;
	} else {
		this.set("errorMessage","ERROR_USER_LOGINCHECK_" + login.toUpperCase());
		return false;							//表单某项没有输入
	};
};

/*
 * @name: updateInfo
 * @param: null
 * @overview: 更新用户信息
 */
user.prototype.updateInfo = function() {
	var user = this._getCollection();
	this.db_update.call(user,
		{username:this.get("session").username,uid:this.get("session").uid},
		{$set:{lastlogin:new Date()}},function() {}
	);
};

/*
 * @name: checkLogin
 * @param: null
 * @overview: 检测是否登录
 */
user.prototype.checkLogin = function() {
	var session = this.get("session");
	if(!session["username"]) {
		this.set("errorMessage","ERROR_USER_CHECKLOGIN");
		return false;
	}
	this.set("username",session.username);
	this.set("uid",session.uid);
	this.set("nickname",session.nickname);
	return true;
};

/*
 * @name: login
 * @param: null
 * @overview: 登录函数
 */
user.prototype.login = function(next) {
	var that = this;
	if(!this.loginCheck()) return next(false);			//登录提交表单检测
	this.userpasswordCheck(function(back,data) {
		if(!back) return next(false,data);
		that.setSession();
		that.updateInfo();
		return next(true,data);
	})
};

/*
 * @name: pullWeibo
 * @param: next(Function)
 * @overview: 获取自己的关注的人的微博
 */
user.prototype.pullWeibo = function(next) {
	var that = this;
	this.getConcern(function(back,data) {
		if(!back) return next(false);
		var feeds = that._getCollection_feeds();
		data.push(that.get("session").uid);
		that.db_find.call(feeds,{uid:{$in:data}}).sort({"publishdate":-1}).limit(15).toArray(function(err,data) {
			if(err) throw err;
			if(!data) {
				that.set("errorMessage","ERROR_USER_GETSELFINBOX_NOTEXIST");
				return next(false);
			};
			that.pullWeiboDeal(data,function(back,data) {
				return next(true,data);
			});
		})
	});
};

/*
 * @name: pullWeiboDeal
 * @param: data(Object) next(Function)
 * @overview: 获取微博后数据处理
 */
user.prototype.pullWeiboDeal = function(data,next) {
	var getConcern = new Array();
	for(var i in data) {
		if(data[i].uid in getConcern) continue;
		getConcern.push(data[i].uid);
	};
	var user = this._getCollection();
	this.db_find.call(user,{uid:{$in:getConcern}}).toArray(function(err,d) {
		if(err) throw err;
		for(var i in data) {
			for(var j in d) {
				if(d[j].uid === data[i].uid) {
					data[i].avatarImage = d[j].avatarImage;
					data[i].nickname = d[j].nickname;
					break;
				}
			}
		}
		next(true,data);
	});
};

/*
 * @name: getConcern
 * @param: next(Function)
 * @overview: 获取自己关注的人
 */
user.prototype.getConcern = function(next) {
	var user = this._getCollection();
	var session = this.get("session");
	this.db_findOne.call(user,{uid:session.uid},function(err,data) {
		if(err) throw err;
		next(true,data.concern);
	})
};

/*
 * @name: getTopuser
 * @param: number(Number),next(Function)
 * @overview: 获取粉丝数排行榜
 */
user.prototype.getTopuser = function(number,next) {
	var user = this._getCollection();
	this.db_find.call(user,{},{followerNum:1,nickname:1,uid:1,avatarImage:1}).sort({"followerNum":-1}).limit(number).toArray(function(err,data) {
		if(err) throw err;
		next(true,data);
	})
};

/*
 * @name: getIndexweibo
 * @param: next(Function)
 * @overview: 获取首页微博
 */
user.prototype.getIndexweibo = function(next) {
	var feeds = this._getCollection_feeds();
	var that = this;
	this.db_find.call(feeds,{}).sort({"publishdate":-1}).limit(20).toArray(function(err,data) {
		if(err) throw err;
		that.pullWeiboDeal(data,function(back,data) {
			next(back,data);
		});
	});
}

/*
 * @name: getIndexAuthenticationPeople
 * @param: next(Function)
 * @overview: 获取认证用户
 */
 user.prototype.getIndexAuthenticationPeople = function(next) {
 	var user = this._getCollection();
 	this.db_find.call(user,{authentication:true},{uid:1,avatarImage:1,nickname:1}).sort({"followerNum":1,"signupDate":1}).limit(9).toArray(function(err,data) {
 		if(err) throw err;
 		if(data.length < 1) {
 			next(false);
 		} else {
	 		next(true,data);
	 	}
 	})
 }

/*
 * @name: getIndexFunPeople
 * @param: next(Function)
 * @overview: 
 */
user.prototype.getIndexFunPeople = function(next) {
	
}

exports.user = function(a) {
	return new user(a);
};
