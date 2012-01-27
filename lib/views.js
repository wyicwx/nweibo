var fs = require('fs'),
	ejs = require('ejs'),
	views = exports,
	type = new Object();
	
	
function setTime(time) {
	var date = new Date();
	var second = (date-time)/1000;
	if((second/86400)>1) {
		var day = Math.floor(second/86400);
		return day+"天前";
	} else if((second/3600)>1) {
		var hour = Math.floor(second/3600);
		return hour+"小时前";
	} else if((second/60)>1) {
		var minute = Math.floor(second/60);
		return minute+"分钟前";
	} else {
		return Math.floor(second)+"秒前";
	}
}

type.weibo = fs.readFileSync(__dirname + '/../views/weibo/weibo.html').toString();

views.weibo = function(obj) {
	obj.dateFormat = setTime(obj.publishdate);
	return ejs.render(type['weibo'],obj);
}

