var lib = require('../lib/lib.js');

exports.index = function(req,res) {
	var user = lib.lib_user();
	if(!user.checkLogin(req)) {
		return res.redirect('/');
	};
	return res.template({
				layout:true,
				bodyCss:['/css/home/home-global.css','/css/home/tpl.css'],
				bodyJs:['/js/m.1.2.js']
			});
};
