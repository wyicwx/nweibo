$(document).ready(function() {
	$(".j-label").click(function() {
		$(this).hide().siblings().focus();
	});
	$(".j-input").blur(function() {
		if($(this).val() == "") {
			$(this).siblings().show();
		}
	});
	$(".j-input").focus(function() {
		$(this).siblings().hide();
	});
	$(".j-top-row").hover(function() {
		$(this).removeClass("ui-top-main-li").addClass("ui-top-main-li-hover");
	},function() {
		$(this).removeClass("ui-top-main-li-hover").addClass("ui-top-main-li");
	})
	setTimeout(roll,4000);
})

function roll() {
	var div = $(".ui-feed:last");
	var h = +(div.height());
	$(".ui-feed:last").remove();
	div.height(0).css("opacity",0);
	div.insertBefore(".ui-feed:first");
	$(".ui-feed:first").animate({"height":h},2000,function() {
		$(this).animate({"opacity":1},function() {
			setTimeout(roll,4000);
		})
	})
}
