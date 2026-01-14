(function($){
	$(document).ready(function(){
		// nav area
		var nav = $('#nav');
		var content = $('#content');
		
		nav.find('.main-nav-item').click(function(){
			var current = $(this).parent();
			
			$(this).siblings('.sub-nav').slideToggle(function(){
				current.toggleClass('active');
			});
		});
		nav.find('.sub-nav-item').click(function(){
			nav.find('.sub-nav-item').removeClass('active');
			$(this).addClass('active');
			content.children($(this).attr('href')).fadeIn().siblings('.content-section').hide();
		});

		var url = window.location.hash;
		
		if ( url ) {
			$('.sub-nav-item').removeClass('active');

			$(".sub-nav-item[href='" + url + "']").addClass( 'active' )

			$( '.content-section' ).hide();
			$( '.content-section' + url ).show();
		}
	});
})(jQuery);