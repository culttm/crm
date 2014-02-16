/**
 * This router is basically the controller of our app. All major user actions are handled here. 
 */
define(['jquery','backbone','views/UserListView','views/UserView','views/SearchView','views/StatisticsView', 'models/UserModel','utils/PopUps'], 
		function($, Backbone, UserListView, UserView, SearchView, StatisticsView, UserModel, PopUps){
  
	var Router = Backbone.Router.extend({		
		routes: {		
			'list' : 'userListPage',
			'search' : 'searchPage',
			'user/:id' : 'detailedUserPage',				
			'statistics' : 'askConfirmationAndOpenStatisticsPage',
	
			// default route
			'*any': 'userListPage'			
		},
		
		initialize : function(globalUserModel,statisticsModel,container,menu) {
			this.container = $(container);
			this.globalUserModel = globalUserModel;
			this.statisticsModel = statisticsModel;			
			this.menu = menu;
			Backbone.history.start();
		},
	
		userListPage : function() {
			console.log('Router: User List');
			// if this is the first call, initialize the model
			if(this.globalUserModel.allUsers.length == 0) {				
				PopUps.showLoadingIcon();
				this.globalUserModel.fetch({
					async: false,
					success : function(serverResponse) {					
						PopUps.hideLoadingIcon();						
					},
					error: function(data, response){
						PopUps.hideLoadingIcon();
						PopUps.showErrorDialog();
					}
				});
			} 	
			this.menu.setActiveMenuUserList();	
			var userList = new UserListView({el:container,model:this.globalUserModel});
			userList.render();
		},
		
		detailedUserPage: function(id) {
			console.log('Router: Detailed User for id: ' + id);			
			$(container).html('');
			PopUps.showLoadingIcon(container);
			var userModel = new UserModel({id:id});
			var userView = new UserView({el:container,model:userModel});
			var menu = this.menu;
			userModel.fetch({
				success : function(serverResponse) {
					menu.setAllInactive();
					userView.render();
					PopUps.hideLoadingIcon()					
				},
				error: function(model, xhr, options){
					PopUps.hideLoadingIcon();
					PopUps.showErrorDialog();
				
				}
			});			 
		},
		
		searchPage: function() {
			console.log('Router: Search Page');
			$(container).html('');
			this.menu.setActiveMenuSearch();			
			var searchView = new SearchView({globalModel:this.globalUserModel});
			searchView.render();
			$(container).html(searchView.$el);
		},		
		
		askConfirmationAndOpenStatisticsPage: function() {
			console.log('Router: Statistics Page');
			$(container).html('');
			this.menu.setActiveMenuStatistics();
			// if this is the first call, initialize the model
			if(!this.statisticsModel.isInitialized) {				
				PopUps.showOpenStatisticsConfirmationDialog(this);				
			} else {			
				this.openStatisticsPage();
			}
		},
		
		openStatisticsPage: function() {
			var statisticsView = new StatisticsView({el:container, model:this.statisticsModel});
			statisticsView.render();
		}
		
	});
	      
	return Router;
});