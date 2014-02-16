/**
 * A view for a simple filter with true/false that the user selects in the search page
 */
define(['backbone','underscore'], function(Backbone, _) {		
	var SimpleFilterView = Backbone.View.extend({	
		events: function(){
	        var events = {};
	        events['click #' + this.options.name + 'CBTrue'] = "include";
	        events['click #' + this.options.name + 'CBFalse'] = "exclude";
	        return events;
	    },
		
		include: function(e) {	    	
	    	var $excludeCB = $('#' + this.options.name+'CBFalse');
	    	this.applyCheckBoxes($(e.currentTarget),$excludeCB);
		},
		
		exclude: function(e) {
			var $excludeCB = $('#' + this.options.name+'CBTrue');
	    	this.applyCheckBoxes($(e.currentTarget),$excludeCB);
		},
		
		applyCheckBoxes: function($clickedCB, $otherCB) {			
			var parameter = ($clickedCB.attr('id') == this.options.name + 'CBTrue') ? true : false;
	    	if($clickedCB.attr('checked')) {
		    	if($otherCB.attr('checked')) {	    		
		    		$otherCB.attr('checked', false);
		    		this.modifySearchModel(false,{'name':this.options.name});		    		
		    	} 		    	
		    	this.modifySearchModel(true,{'name':this.options.name,'parameters':[parameter]});				
	    	} else if(!$otherCB.attr('checked')) {
	    		this.modifySearchModel(false,{'name':this.options.name});	    		
	    	}
		},
		
		modifySearchModel: function(add,filter) {
			if(add) {
				this.options.searchModel.addFilter(filter);
			} else {
				this.options.searchModel.removeFilter(filter);
			}			
		},		
		
		render: function(){							
			var compiledTemplate = _.template('<div class="filterDescription"><%=description%></div> <input id="<%=name%>CBTrue" type="checkbox"> Include <input id="<%=name%>CBFalse" type="checkbox"> Exclude <br/>',
					{name:this.options.name,description:this.options.description});			
    		this.$el.html(compiledTemplate);   
		}		
	});
	
	return SimpleFilterView;	
});
