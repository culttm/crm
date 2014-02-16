/**
 * A simple view with some buttons, the menu that is always in the top of the page
 */
define([ 'jquery', 'backbone', 'underscore', 'text!templates/Menu.html'], function($, Backbone, _, MenuTemplate) {		
	var MenuView = Backbone.View.extend({		
		render: function(){						
			var template = _.template(MenuTemplate,{});			
    		this.$el.html(template);			
    		this.setActiveMenuUserList();
		},
	
		setActiveMenuUserList: function() {
			this.$el.find('a').css('color','#FFF');
			this.$el.find('a:first-child').css('color','#000');			
		},
		
		setActiveMenuSearch: function() {
			this.$el.find('a').css('color','#FFF');
			this.$el.find('a:eq(1)').css('color','#000');
		},
		
		setActiveMenuStatistics: function() {
			this.$el.find('a').css('color','#FFF');
			this.$el.find('a:eq(2)').css('color','#000');
		},
		
		setAllInactive: function() {			
			this.$el.find('a').css('color','#FFF');						
		}			
	});
	
	return MenuView;	
});