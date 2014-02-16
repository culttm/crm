/**
 * The view that is responsible for displaying a user's data 
 */
define(['jquery','jquery-ui','backbone','underscore','models/UserListModel','text!templates/UserInformationTemplate.html', 
        'text!templates/userInfoTemplates/PersonalInformationTemplate.html', 'text!templates/userInfoTemplates/EmailingTemplate.html',
        'text!templates/userInfoTemplates/TrainingDataTemplate.html','text!templates/userInfoTemplates/ContractDataTemplate.html', 'utils/PopUps'],
		function($, jqueryui, Backbone, _, UserListModel, UserTableTemplate, PersonalInformationTemplate, EmailingTemplate, 
				TrainingDataTemplate, ContractDataTemplate, PopUps) {
	
	var UserView = Backbone.View.extend({
		
		render: function() {			
			var userVariable = {'user' : this.model};
			console.log(this.model)
			var compiledPersonalInformationTemplate = _.template(PersonalInformationTemplate,userVariable);
			var compiledUserEmailingTemplate = _.template(EmailingTemplate,userVariable);
			var compiledContractDataTemplate = _.template(ContractDataTemplate,userVariable);
			var compiledTrainingDataTemplate = _.template(TrainingDataTemplate,userVariable);
						
			var parentTemplateVariables = {
					'user' : this.model, 
					'personalInformationTemplate' : compiledPersonalInformationTemplate,
					'emailingTemplate' : compiledUserEmailingTemplate,
					'contractDataTemplate' : compiledContractDataTemplate,
					'trainingDataTemplate' : compiledTrainingDataTemplate
					};			
			
			var compiledParentTemplate = _.template(UserTableTemplate,parentTemplateVariables);						
			this.$el.html(compiledParentTemplate);
			
			// activate the jquery ui tabs plugin
			$(function() {				
		        $("#tabs").tabs();
		    });
		},
		
		loadCreationHistoryOverlay: function(e){
			var index = $(e.target).closest('tr').prevAll().length,
				creationHistoryInformation = this.model.attributes.trainingData.trainingSessions[index].creationHistoryAsHTML;

			PopUps.showTrainingsDialog('Creation History', creationHistoryInformation);
			return false;
		},
		
		loadInstructionsOverlay: function(e){
			var index = $(e.target).closest('tr').prevAll().length,
				instructionsInformation = this.model.attributes.trainingData.trainingSessions[index].instructionsAsHTML;

			PopUps.showTrainingsDialog('Instructions Information', instructionsInformation);
			return false;

		},
		
		loadExerciseOverlay: function(e){
			e.stopPropagation();
			var index = $(e.target).closest('tr').prevAll().length,
				exerciseInformation = this.model.attributes.trainingData.trainingSessions[index].exercisesWithFeedback,
				output = '<table id="exerciseInfoTable">';

				$.each(exerciseInformation, function(key,value){
					output += '<tr><td>' + key + '</td><td>' + value + '</td></tr>';
				})
				output += '</table>';
				
				PopUps.showTrainingsDialog('Exercises Information', output);
				return false;
		},
		
		events: {
	        'click .history' : 'loadCreationHistoryOverlay',
	        'click .instructions' : 'loadInstructionsOverlay',
	        'click .exercise' : 'loadExerciseOverlay'
    	},
				
	});
	
	return UserView;	
});