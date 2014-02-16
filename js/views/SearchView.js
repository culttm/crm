/**	
 * The view from where queries to the backend are made 
 */
define(['jquery','jquery-ui','backbone','underscore','views/SimpleFilterView','models/SearchModel','utils/PopUps','text!templates/SearchTemplate.html'],
		function($, jqueryui, Backbone, _, SimpleFilterView, SearchModel, PopUps, SearchTemplate) {
	
	var SearchView = Backbone.View.extend({
		
		events: {
        	'click :radio' : 'changeAggregationType',        	
        	'click #searchButton' : 'doSearch'
    	},  
    	
    	doSearch: function() {    		
    		var globalModel = this.options.globalModel;
    		//console.log(this.options);
    		var view = this;
    		PopUps.showLoadingIcon();
    		this.model.fetch({
    			success : function(serverResponse) {
    				//put the response in the global model lastQuery part
    				globalModel.setLastSearch(serverResponse);
    				PopUps.hideLoadingIcon();
    				view.dispose();
    				window.location = '#list'
				}
    		});    		
    	},

    	dispose: function() {
    		this.unbind('change');
    		this.off();
    		this.remove();
    		this.model.off( null, null, this );
		},

    	changeAggregationType: function(e) {
    		var source = $(e.currentTarget);
    		if(source.attr('id') == 'aggregationRadioAND') {
    			this.model.setAggregationType('and');
    		} else {
    			this.model.setAggregationType('or');
    		}    		
    	},
		
		initialize: function() {    		
			this.model = new SearchModel();			
			this.model.bind('change', this.updateQueryPreview, this);			
		},
		
		updateQueryPreview: function() {			
			var query = this.model.querify();
			$('#queryPreview').text(query);
		},
		
		render: function() {
			$el = this.$el;
			
			// render the parent view
			var compiledTemplate = _.template(SearchTemplate);						
			$el.html(compiledTemplate);			
			// and the children-filters
			var falserUserView = new SimpleFilterView({name:'FalseUserFilter',description:'False Users',searchModel:this.model,el:$el.find('#falseUserFilter')});
			falserUserView.render();			
			var alumniView = new SimpleFilterView({name:'AlumniFilter',description:'Alumnis',searchModel:this.model,el:$el.find("#alumniFilter")});
			alumniView.render();
			var hasUsedGiftCardView = new SimpleFilterView({name:'HasUsedGiftCardFilter',description:'Have Used Gift Card',searchModel:this.model,el:$el.find("#hasUsedGiftCardFilter")});
			alumniView.render();
			var hasAnyContractView = new SimpleFilterView({name:'HasAnyContractFilter',description:'Have Any Contract',searchModel:this.model,el:$el.find("#hasAnyContractFilter")});
			hasAnyContractView.render();
			var freeRiderView = new SimpleFilterView({name:'FreeRiderFilter',description:'Free Riders',searchModel:this.model,el:$el.find("#freeRiderFilter")});
			freeRiderView.render();
			var trueUserView = new SimpleFilterView({name:'TrueUserFilter',description:'True Users',searchModel:this.model,el:$el.find("#trueUserFilter")});
			trueUserView.render();
			var isAllowedToTrainView = new SimpleFilterView({name:'IsAllowedToTrainFilter',description:'Are Allowed To Train',searchModel:this.model,el:$el.find("#isAllowedToTrainFilter")});
			isAllowedToTrainView.render();
		}
				
	});
	
	return SearchView;	
});