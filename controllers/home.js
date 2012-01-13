exports.index = function(req,res) {
	return res.template({
				layout:true,
				bodyCss:['/css/home/home-global.css','/css/home/tpl.css'],
				bodyJs:['/js/m.1.2.js']
			});
};
