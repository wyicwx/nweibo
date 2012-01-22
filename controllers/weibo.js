var lib = require('../lib/lib.js');


exports.add = function(req,res) {
	if(req.method == "GET") throw new Error('404');
	var speaker = new lib.lib_speakers(req);
	speaker.publishWeibo(function(bl) {
		if(bl === false) {
			return res.end(speaker.get("errorMessage"));
		}
		return res.end('<div>success</div>');
	})
	
};
