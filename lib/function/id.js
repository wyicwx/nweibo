var stringBuffer = require('./stringBuffer.js');

var id = exports;

id.uid = function() {
	var stringbuffer = stringBuffer.stringBuffer();
	for(var i=0;i<4;i++) {
		stringbuffer.append(parseInt(Math.random()*9));
	}
	var date = new Date();
	stringbuffer.append(date.getFullYear().toString().substring(2,4));
	stringbuffer.append(date.getMonth().toString().substring(1,2));
	var dateVar = date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds()+date.getMilliseconds();
	stringbuffer.append(dateVar);
	return parseInt(stringbuffer.join(""));
};

id.wid = function() {
	var stringbuffer = stringBuffer.stringBuffer();
	var date = new Date();
	stringbuffer.append(date.getFullYear().toString().substring(2,4));
	stringbuffer.append(date.getMonth()+1);
	stringbuffer.append(date.getDate());
	stringbuffer.append(date.getHours());
	stringbuffer.append(date.getMinutes());
	stringbuffer.append(date.getSeconds());
	stringbuffer.append(date.getMilliseconds());
	for(var i=0;i<4;i++) {
		stringbuffer.append(parseInt(Math.random()*15).toString(16));
	}
	return parseInt(parseInt(stringbuffer.join("")));
};

