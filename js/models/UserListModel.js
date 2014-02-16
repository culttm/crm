/**
 * A model that contains a list of users and the last user query that was performed on our app. This is intended as a global, non-changable model,
 * because its so expensive to create (1-10 minutes).
 */
define(['jquery','backbone','config','models/UserModel'], function($, Backbone, config, UserModel) {		
	var UserListModel = Backbone.Model.extend({
		url : config.rootUrl + '/users',		
		allUsers: [],
		lastSearch: [],
		isLastSearch: false,
		
		parse: function(serverData) {
			var allUsers = this.allUsers; 
        	$(serverData).each(function(index, value) {        			
        			allUsers[index] = new UserModel(value);
        		}
        	)
		},
			
		// is usually called from the SearchModel when a search is performed
		setLastSearch: function(serverResponse) {		
			var lastSearch = this.lastSearch;
        	$.each(serverResponse.attributes,function(index,data) {        		
				lastSearch[index] = new UserModel(data);
				//$.extend(true, {}, data); // deep copy, keep for reference
			});        	
        	this.isLastSearch = true;
        }

	});	
		
	return UserListModel;	
});

