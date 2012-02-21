$(document).ready(function() {

	$('.j-toolbar-label').click(function() {
		$('.j-toolbar-input').focus();
	})
	$('.j-toolbar-input').focus(function() {
		$('.j-toolbar-label').addClass('fn-disp-hide');
	});
	$('.j-toolbar-input').blur(function() {
		if(!$(this).val()) {
			$('.j-toolbar-label').removeClass('fn-disp-hide').addClass('fn-disp-show');
		}
	});
})