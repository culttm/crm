/**
 * Represents our user. Holds id/email/name and can be used to fetch() the whole user from the backend 
 */
define(['backbone','config'], function(Backbone,config) {		
	var UserModel = Backbone.Model.extend({
		urlRoot : config.rootUrl + '/users'		    	
	});
		
	return UserModel ;	
});
