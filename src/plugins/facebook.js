;(function($){
	$.require('session.js', function script_loaded(e){
		var authResponse, authToken;
		// code taken from http://worldwidecode.wordpress.com/
		function launchFacebookWebAuth(params) 
		{
			var facebookURL = "https://www.facebook.com/dialog/oauth?client_id=";
			var clientID = "";
			var callbackURL = "https://www.facebook.com/connect/login_success.html";
			facebookURL += clientID + "&redirect_uri=" + encodeURIComponent(callbackURL) + "&scope=read_stream&display=popup&response_type=token";

			try 
			{
				var startURI = new Windows.Foundation.Uri(facebookURL);
				var endURI = new Windows.Foundation.Uri(callbackURL);

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
			authToken = FacebookReturnedToken;
			authResponse = "Status returned by WebAuth broker: " + result.responseStatus + "\r\n";
			if(result.responseStatus == 2)
			{
				response += "Error returned: "+ result.responseErrorDetail +"\r\n";
			}
			return response;
		}

		function callbackFacebookWebAuthError(err) 
		{
			var error = "Error returned by WebAuth broker. Error Number: " + err.number + " Error Message: " + err.message + "\r\n";
		}
		$.extend({
			facebook: (function(options){
				var defaults = {
						clientID: '',
						scope: ['read_stream'],
						display: 'popup',
						response_type: 'token'
					},
					params = $.merge(defaults, options);
				
				
				return {
					auth: function(){
						launchFacebookWebAuth.apply(this, [params])
					},
					token: authToken,
					response: authResponse
				};
			})()
		});
	}, function session_load_error(e){
			throw "Unable to add facebook plugin because session failed to load"
	});
})(window.$);