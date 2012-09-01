;(function($){
	$.require('session.js', function script_loaded(e){
		var authResponse, authToken;
		// code taken from http://worldwidecode.wordpress.com/
		function launchFacebookWebAuth(params) 
		{
			var facebookURL = "https://www.facebook.com/dialog/oauth?client_id=";
			facebookURL += params.client_id + "&redirect_uri=" + encodeURIComponent(params.callback_url) + "&scope="+params.scope.join(',')+"&display="+params.display+"&response_type="+params.response_type;

			try 
			{
				var startURI = new Windows.Foundation.Uri(facebookURL);
				var endURI = new Windows.Foundation.Uri(params.callbackURL);

				Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
					Windows.Security.Authentication.Web.WebAuthenticationOptions.default,
					startURI, 
					endURI).then(callbackFacebookWebAuth, callbackFacebookWebAuthError);
			} 
			catch (err) {	/*Error launching WebAuth"*/	return;	}
		}

		function callbackFacebookWebAuth(result) 
		{
			var FacebookReturnedToken = result.responseData;
			$.facebook.token = FacebookReturnedToken;
			$.facebook.response = result.responseData;
			$.facebook.response_status = result.responseStatus;
			if(result.responseStatus == 2)
			{
				$.facebook.response += "Error returned: "+ result.responseErrorDetail +"\r\n";
			}
			return $.facebook.response;
		}

		function callbackFacebookWebAuthError(err) 
		{
			var error = "Error returned by WebAuth broker. Error Number: " + err.number + " Error Message: " + err.message + "\r\n";
		}
		$.extend({
			facebook: (function(){
				var defaults = {
						client_id: '',
						scope: ['read_stream'],
						display: 'popup',
						response_type: 'token',
						callback_url: 'https://www.facebook.com/connect/login_success.html'
					};
				
				return {
					authorize: function(options){
						var params = $.merge(defaults, options);
						launchFacebookWebAuth.apply(this, [params])
						return this.response_code == 2;
					},
					token: '',
					response: '',
					response_code: ''
				};
			})();
		});
	}, function session_load_error(e){
			throw "Unable to add facebook plugin because session failed to load"
	});
})(window.$);