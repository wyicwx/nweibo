/**
 * @author maple
 */
;(function() {
	var tag = ("addr,article,aside,audio,canvas,datalist,details,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,time,video").split(",");
	for(var i in tag) {
		document.createElement(tag[i]);
	}
})();
