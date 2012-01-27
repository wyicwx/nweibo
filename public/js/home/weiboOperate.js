/**
 * @author maple
 */
m.domready(function() {
(function(w) {
	var publish = m.$('.ui-wTextarea-btn a');
	publish.addListener('click',function() {
		m.ajax({
			type:'POST',
			url:'/weibo/add',
			data:{
				content:m.$('.ui-wTextarea-area')[0].value,
				type:"weibo"
			},
			success:function(data) {
				var tar = new RegExp(/\<([a-zA-Z]+)([\s]||\>)/);
				tar = data.match(tar);
				if(!tar) return false;
				var d = document.createElement(tar[1]);
				var classname = data.match(/\<[^\>]+class=['"](.+)['"][^\>]*\>/)[1];
				d.className = classname;
				d.innerHTML = data.match(/\<[^\>]+\>((.||\n)+)\<\/[a-zA-z\s]+\>/)[1];
				var child =	m.$('#weibo-feed')[0];
				child.insertBefore(d,child.childNodes[0]);
			}
		})
	})
})(window);
})