define([ 'jquery', 'backbone', 'underscore'], function($, Backbone, underscore) {	

	return{
		checkKeyPress: function(e){
			if (e.which==13||e.which==16||e.which==17||e.which==18||(e.which > 34 && e.which < 41)||(e.ctrlKey && e.which==65)) { 
                return;
            }
		}

	};

});