define(['jquery','backbone','underscore','models/UserListModel','text!templates/UserListTemplate.html','utils/Utils'], 
		function($, Backbone, _, UserListModel, UserListTemplate, Utils) {	
	var UserListView = Backbone.View.extend({				
		
		render: function() {			
			if(this.model.isLastSearch) {
				this.renderTable(this.model.lastSearch);				
				$('#lastSearchCB').prop('checked',true);
				this.model.isLastSearch = false;
			} else {
				this.renderTable(this.model.allUsers);
				$('#allUsersCB').prop('checked',true);
			}
		},	
		
		renderTable: function(usersToShow) {
			var templateVariables = {'users' : usersToShow,'userListLength' : usersToShow.length};			
			var compiledTemplate = _.template(UserListTemplate,templateVariables);			
        	this.$el.html(compiledTemplate);
		},
		
		events: {
            'click tr' : 'showDetailedUserView',
            'keyup #userSearchTextfield' : 'filterUserList',
            'click .userListCB' : 'changeUserList' 
        },        
        
        changeUserList: function(e) {        	
        	if($(e.target).attr('id') == 'allUsersCB') {        		
        		this.renderTable(this.model.allUsers);
        		$('#allUsersCB').prop('checked', true);
        	} else {
        		this.renderTable(this.model.lastSearch);
        		$('#lastSearchCB').prop('checked', true);            	
        	}        	        	
        },
                
        filterUserList: function(e) {
            Utils.checkKeyPress(e);
        	
        	var lookThroughAllUsers;
        	if($('#allUsersCB').attr('checked')) {
        		lookThroughAllUsers = true;
        	} else {
        		lookThroughAllUsers = false;
        	}
        	
        	var originalInput = $(e.currentTarget).val();        	
        	var input = originalInput.toUpperCase();        	
        	var usersToShow = [];        	
        	var modelToSearchInside;
        	
        	if(lookThroughAllUsers) {
        		modelToSearchInside = this.model.allUsers;
        	} else {
        		modelToSearchInside = this.model.lastSearch;
        	}
        	$(modelToSearchInside).each(function() {        		
        		var $user = $(this)[0];        		        		
        		var textToMatchAgainst = $user.get('id') + ' ' + $user.get('email') + ' ' + $user.get('name');        		
        		if(textToMatchAgainst.toUpperCase().indexOf(input) != -1) {
        			usersToShow.push($user);
        		}
        	});
        	this.renderTable(usersToShow);
        	
        	if(lookThroughAllUsers) {
        		$('#allUsersCB').prop('checked', true);
        	} else {
        		$('#lastSearchCB').prop('checked', true);     
        	}        	
        	$('#userSearchTextfield').focus();
        	$('#userSearchTextfield').val(originalInput);
        },        
		
        showDetailedUserView: function(e) {
        	var userId = $(e.currentTarget).find('td:first-child').html();       	
        	window.location = '#user/' + userId;       	
        }
	});
	
	return UserListView;	
});