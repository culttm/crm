/**
 * Contains all the statistics for the users 
 */
define(['backbone','jquery','config','models/UserListModel','models/UserModel','utils/PopUps','utils/Utils'], function(Backbone,$,config,UserListModel,UserModel,PopUps,Utils) {		
	var StatisticsModel = Backbone.Model.extend({
		urlRoot : config.rootUrl + '/users',		
		payments: [],		
		contracts: [],		
		giftCards: [],		
		registrations: [],
		trainings: [],
		isInitialized: false,
		
		initialize: function(allUsersModel) {
			this.allUsersModel = allUsersModel;
		},
		
		fetch: function() {
			var allUsersModel = this.allUsersModel;
			var payments = this.payments;
			var contracts = this.contracts;
			var trainings = this.trainings;
			var giftCards = this.giftCards;
			var registrations = this.registrations;
			
			// first get the initial all-users model if its not there already
			var shouldStopStatisticsLoadFlag = false;
			if(allUsersModel.allUsers.length == 0) {				
				PopUps.showLoadingIcon();
				this.allUsersModel.fetch({
					async: false,
					success: function(serverResponse) {					
						// do nothing						
					},
					error: function(){						
						shouldStopStatisticsLoadFlag = true;
					}
				});
			} 	

			PopUps.hideLoadingIcon();
			if(shouldStopStatisticsLoadFlag) {
				return;
			}
						
			// then fetch the users one-by-one and show progress
			var userCount = 1;
			var usersLength = allUsersModel.allUsers.length;									
			$.each(allUsersModel.allUsers, function(index,data){	
				var userId = data.id;
				var singleUserModel = new UserModel({id:userId});
				singleUserModel.fetch({
					async: false,
					success: function(serverResponse) {						
						PopUps.showProgressBar(singleUserModel.get('personalInformation').emailAddress,userCount,usersLength);
						var contractData = singleUserModel.get('contractData');
						// payments
						$.each(contractData.mergedPayments, function(index,data){
							payments.push({'date':new Date(data.date),'amount':data.amount});
						});
						// contracts
						if(!$.isEmptyObject(contractData.currentContract)) {
							var contract = contractData.currentContract;
							contracts.push({'date':new Date(contract.startDate),'planId':contract.planId,'name':contract.planName});
						}
						//trainings
						var trainingData = singleUserModel.get('trainingData');
						if(!$.isEmptyObject(trainingData)) {							
							$.each(trainingData.trainingSessions, function(index,data){
								//push the trainings
								trainings.push({'date':new Date(data.creationDate),'user':userId});
							});
						}						
						//giftCards						
						var giftCard = contractData.signUpGiftCard;
						if(!$.isEmptyObject(giftCard)) {
							giftCards.push({'date':new Date(giftCard.creationDate),'name':giftCard.name});
						}
						//registrations						
						registrations.push({'date':new Date(singleUserModel.get('personalInformation').creationDate)});
					}
				});
								
				userCount++;								
				/*if(userCount == 37) {
					return(false);
				}*/
			});
			PopUps.hideProgressBar();
			this.isInitialized = true;
		}
		
	});
		
	return StatisticsModel ;	
});
