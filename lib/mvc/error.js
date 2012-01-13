exports.errorCode = {
	'404':function(res) {
		if(res) {
			return res.render('error/404',{layout:false});
		}
	},
	'500':function(res) {
		if(res) {
			return res.render('error/500',{layout:false});
		}
	}
}
