define([ 'jquery', 'backbone', 'underscore'], function($, Backbone, underscore) {	
	
	return {
		showLoadingIcon : function(parent) {
			$(parent).append('<div class="overlay"><img src="imgs/loading.gif"/></div>');
		},
		
		hideLoadingIcon : function(parent) {			
			$('.overlay').remove();
		}
	};
});