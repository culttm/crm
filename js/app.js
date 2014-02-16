requirejs.config( {	
	paths : {
		'jquery': 'libs/jquery/jquery',
		'jquery-ui': 'libs/jquery/jquery-ui',
		'backbone': 'libs/backbone/backbone',
		'underscore': 'libs/underscore/underscore',
		'text': 'libs/require/text'
	}
});

require(['jquery','underscore','backbone','models/UserListModel','models/StatisticsModel','views/MenuView','router'], 
		function($, _, Backbone, UserListModel, StatisticsModel, MenuView, Router) {
	
	// create the menu that always stays in the top of the page	
	var mainMenu = new MenuView({el:$('#menu')});
	mainMenu.render();
			
	// create instance of global model - this should not change and be initialized only once. 
	var allUsers = new UserListModel();
	// likewise for the statistics:
	var statistics = new StatisticsModel(allUsers);
	 
	// init and start the router!
	var router = new Router(allUsers,statistics,$('container'),mainMenu);	
});




