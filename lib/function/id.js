var stringBuffer = require('./stringBuffer.js').stringBuffer();

var uid = function() {
	for(var i=0;i<4;i++) {
		stringBuffer.append(parseInt(Math.random()*10));
	}
	return stringBuffer.join("");
}

exports.uid = uid;