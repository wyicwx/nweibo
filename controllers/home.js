var lib = require('../lib/lib.js');

exports.index = function(req,res) {
	var user = lib.lib_user(req);
	if(!user.checkLogin()) {
		return res.redirect('/');
	};
	var viewVar = {
		username:user.get('username'),
		nickname:user.get('nickname'),
		uid:user.get('uid')
	};
	return res.template({
				layout:true,
				bodyCss:['/css/home/home-global.css','/css/home/tpl.css'],
				bodyJs:['/js/m.1.2.js','/js/home/weiboOperate.js'],
				variable:viewVar
			});
};
