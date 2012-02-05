var fs = require('fs'),
	ejs = require('ejs'),
	views = exports,
	type = new Object();
	
	
function setTime(time) {
	var date = new Date();
	var second = (date-time)/1000;
	if((second/86400)>1) {			//超过一天
		var hours = time.getHours();
		if(hours < 10) hours = "0" + hours;
		var minutes = time.getMinutes();
		if(minutes < 10) minutes = "0" + minutes;
		return (time.getMonth()+1) + "月" + time.getDate() + "日 " + hours + ":" + minutes;
	} else if((second/3600)>1) {		//超过一小时
		var hours = time.getHours();
		if(hours < 10) hours = "0" + hours;
		var minutes = time.getMinutes();
		if(minutes < 10) minutes = "0" + minutes;
		return "今天 " + hours + ":" + minutes;
	} else if((second/60)>1) {			//超过一分钟
		var minute = Math.floor(second/60);
		return minute+"分钟前";
	} else {
		return Math.floor(second)+"秒前";
	}
}

type.weibo = fs.readFileSync(__dirname + '/../views/weibo/weibo.html').toString();
type.index_weibo = fs.readFileSync(__dirname + '/../views/weibo/index_weibo.html').toString();


views.weibo = function(obj) {
	obj.dateFormat = setTime(obj.publishdate);
	return ejs.render(type['weibo'],obj);
}


views.index_weibo = function(obj) {
	obj.dateFormat = setTime(obj.publishdate);
	return ejs.render(type['index_weibo'],obj);
}
