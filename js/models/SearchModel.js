/**
 * A model of the search query the user has constructed based on the filters he selected 
 */
define(['backbone','jquery','config'], function(Backbone, $, config) {		
	var SearchModel = Backbone.Model.extend({		
		filters: [],		
		aggregationType: "or",
		
		addFilter: function(filter) {
			this.filters.push(filter);			
			this.trigger('change');
		},

		initialize: function() {		
			this.filters = [];
		},
	
		removeFilter: function(filter) {
			var filters = this.filters;			
			$.each(filters,function(index, data) {					
					if(filters[index].name == filter.name) {						
						filters.splice(index,1);
						return(false);
					}
				}
			);
			this.trigger('change');
		},
		
		setAggregationType: function(type) {
			this.aggregationType = type;
			this.trigger('change');
		},	
		
		querify: function() {
			if(this.filters.length == 0) {
				return '';
			}

			var resultQuery = config.rootUrl + "/users";		

			$.each(this.filters,function(index,filter) {				
					resultQuery += (index == 0) ? '?' : '&';
					resultQuery += filter.name + '=';
					$.each(filter.parameters,function(index,parameter) {						
						if(index!=0) {
							resultQuery += ',';
						}						
						resultQuery += parameter;
					});
				}
			);
			
			resultQuery += '&aggregation=' + this.aggregationType;
			this.urlRoot = resultQuery;
			return resultQuery;
		}		
		
	});
		
	return SearchModel;	
});
