/**
 * The view that displays statistics about our user base 
 */
define(['jquery','jquery-ui','backbone','underscore', 'text!templates/StatisticsTemplate.html','utils/Utils'],
		function($, jqueryui, Backbone, _, StatisticsTemplate, Utils) {
	
	var StatisticsView = Backbone.View.extend({
		userWithMostTrainings : {},
		render: function() {
			this.renderForDate(new Date(0));
		},
		
		renderForDate: function(date) {			
			var model = this.model;
			var filterArrayOfDatedObjects = this.filterArrayOfDatedObjects;
			
			// calculate payment total
			var filteredPayments = filterArrayOfDatedObjects(date, model.payments);
			var total = 0;
			$.each(filteredPayments, function(index,data){
				total += data.amount;
			});
			
			//calculate user with most trainings
			var filteredTrainings = filterArrayOfDatedObjects(date, model.trainings);
			this.userWithMostTrainings = this.calculateUserWithMostTrainings(filteredTrainings);
			
			var templateVariables = {
					'paymentTotal' : total,
					'contracts' : filterArrayOfDatedObjects(date, model.contracts).length,
					'trainings' : filteredTrainings.length,
					'userWithMostTrainings' : this.userWithMostTrainings,
					'registrations' : filterArrayOfDatedObjects(date, model.registrations).length,
					'giftCards' : this.getGiftCardsAsOccurenceObject(date, model.giftCards),
					'contracts' : this.getGiftCardsAsOccurenceObject(date, model.contracts)
 			};
			
			var compiledTemplate = _.template(StatisticsTemplate,templateVariables);						
			this.$el.html(compiledTemplate);			
		},
	
		events: {
			'keyup #specifyTimeTextfield' : 'filterStatisticsByTime',
			'click #userWithMostTrainings' : 'showUserCard'	
		},

		showUserCard: function(){
			var userId = this.userWithMostTrainings.user.get('id');
        	window.location = '#user/' + userId; 
		},

		getGiftCardsAsOccurenceObject: function(date, giftCardArray){
			var datedGiftCards = this.filterArrayOfDatedObjects(date, giftCardArray),
				giftCardsObject = {};

				$.each(datedGiftCards, function(index, giftCard){
					if(giftCardsObject[giftCard.name] === undefined) {
						giftCardsObject[giftCard.name] = 0;
					}
					giftCardsObject[giftCard.name]++;
					
				});
				return giftCardsObject;
		},
		
		// returns an array of objects (that have a 'date' field) that have happened at a time equal or after than 'date'
		filterArrayOfDatedObjects: function(date, array) {
			var result = [];
			$.each(array, function(index, data) {				
				if(data.date >= date) {
					result.push(data);
				}			
			});
			return result;
		},
		
		calculateUserWithMostTrainings: function(trainingArray) {
			//first make an array with users and the # of their trainings
			var usersWithTrainings = {};
			$.each(trainingArray, function(index,data){				
				var userName = data.user;
				if(usersWithTrainings[userName] === undefined) {
					usersWithTrainings[userName] = 0;					
				}
				usersWithTrainings[userName]++;				
			});
			
			var userWithMostTrainings = {user:{},trainings:0};			
			
			// then iterate and determine the winner's id
			$.each(usersWithTrainings, function(index,data){
				if(data > userWithMostTrainings.trainings) {
					userWithMostTrainings.user = index;
					userWithMostTrainings.trainings = data;
				}				
			});
						
			//get the winner's id from the model
			$.each(this.model.allUsersModel.allUsers, function(index,data){
				if(data.id == userWithMostTrainings.user) {
					userWithMostTrainings.user = data;
					return(false);
				}
			});
						
			return userWithMostTrainings;
		},
		
		filterStatisticsByTime: function(e) {
			Utils.checkKeyPress(e);
			
			var input = $(e.currentTarget).val().trim();
			$('#timSpecifiedNanErrorMessage').css('display','none');
			
			// show warning if NaN
			var intRegex = /^\d+$/;
			if(!intRegex.test(input) && input.length != 0) {
				$('#timSpecifiedNanErrorMessage').css('display','block');
				return;
			}			
			
			if(intRegex.test(input)) {
				var inputedDate = new Date();
				inputedDate.setDate(inputedDate.getDate()-input);
				this.renderForDate(inputedDate);					        	
			} else if(input.length == 0) {				
				this.render();
			}
			$('#specifyTimeTextfield').focus();
        	$('#specifyTimeTextfield').val(input);			
		}				
	});
	
	return StatisticsView;	
});