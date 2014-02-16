define([ 'jquery', 'backbone', 'underscore'], function($, Backbone, underscore) {	
	
	return {
		showLoadingIcon : function() {
			$('#application').append('<div class="overlay"><img src="imgs/loading.gif"/></div>');
		},
		
		hideLoadingIcon : function() {			
			$('.overlay').remove();
		},
		
		showOpenStatisticsConfirmationDialog: function(router) {
			console.log(router);
			console.log(router.statisticsModel);
			var $dialogContainer = $('<div>',{
				'id':'dialog',
				'title':'Fetch statistical data',
				'html':'Warning: For this operation the entire user database must be loaded and processed. ' + 
					'This might take up to half an hour. Are you sure you want to proceed?'
			});
			this.showDialog($dialogContainer, false, 550, 200, 'OK I will wait', function() {
	                    $(this).dialog("close");	
	                    router.statisticsModel.fetch();
	                    router.openStatisticsPage();
	                }, 'Cancel', function() {
	                    $(this).dialog("close");
	                    window.history.back();
	                });
		},
		
		showDialog : function($dialogContainer, resize, width, height, firstButtonText, firstButtonFunction, secondButtonText, secondButtonFunction){
			var dialogButtons = {};
			dialogButtons[firstButtonText] = firstButtonFunction;
			dialogButtons[secondButtonText] = secondButtonFunction;	
							  
			$($dialogContainer).dialog({
	            resizable: resize,
	            height: height,
	            width: width,
	            modal: true,
	            buttons: dialogButtons
	        });
		},
		
		showProgressBar: function(userDescriptor, userNumber, totalUsers) {
			var percentage = (userNumber/totalUsers) * 100;			
			if($('#userProgressBarContainer').length == 0) {
				$('#application').append('<div class="overlay"></div><div id="userProgressBarContainer"><div id="progressText"></div><div id="userProgressBar"></div></div>');
			}			
			$('#progressText').html('Reading data from user ' + userDescriptor + '...<br/>' + (userNumber-1) + ' out of ' + totalUsers + ' users read.');
			$(function() {
		        $("#userProgressBar").progressbar({
		            value: percentage
		        });
		    });			
		},
		
		hideProgressBar: function() {
			$('.overlay').remove();
			$('#userProgressBarContainer').remove();			
		},

		showTrainingsDialog: function(title, content){
			$trainingData = $('<div />', {
				id: 'dialog',
				'title': title,
				'html': content
			});
			this.showDialog($trainingData, true, 800, 400, 'Close this window', function() {
                    $(this).dialog("close");
                    $(this).remove();
	        });
		},

		showErrorDialog: function(message){
			if ( message === undefined ) { message = 'Error while communicating with the server'; }
			var $dialogContainer = $('<div>',{
				'id':'errorDialog',
				'title':'Error Message',
				'html': message
			});
			this.showDialog($dialogContainer, false, 550, 200, 'OK', function() {
                $(this).dialog("close");
            });
		}
	};
});