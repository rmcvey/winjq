/**

Basic usage

$.facebook.token = MY_FB_TOKEN;
$.facebook.authorize({
	scope: ['read_stream', 'email']
}, function(response){
	console.log("Successfully logged in");
});

console.log($.facebook.user_data);

*/
;(function($){
	var authResponse, authToken;
	// code taken from http://worldwidecode.wordpress.com/
	function callbackFacebookWebAuth(result) 
	{
		var FacebookReturnedToken = result.responseData;
		$.facebook.token = FacebookReturnedToken;
		(function parse_token(token_url) {
		    var matches = token_url.match(/access_token=(.*)&/);
		    if (matches) {
		        $.facebook.token = matches[1];
		    } else {
		        return false;
		    }
		})($.facebook.token);
		$.facebook.response = result.responseData;
		$.facebook.response_status = result.responseStatus;
		if (result.responseStatus == 2) {
		    $.facebook.response += "Error returned: " + result.responseErrorDetail + "\r\n";
		}
		else {
		    var get_user_data = function () {
		        var access_url = 'https://graph.facebook.com/me?access_token=' + $.facebook.token;
		        $.getJSON(access_url, function (response) {
		            response.image = 'https://graph.facebook.com/me/picture?type=large&access_token=' + $.facebook.token;
		            $.facebook.user_data = response;
		            $.facebook.success.apply(this, [response]);
		            $.session('user_info', $.facebook.user_data);
		        });
		        return $.facebook.user_data;
		    }
		    get_user_data();
		}
		return $.facebook.response;
	}

	function callbackFacebookWebAuthError(err) 
	{
		var error = "Error returned by WebAuth broker. Error Number: " + err.number + " Error Message: " + err.message + "\r\n";
	}

	function launchFacebookWebAuth(params, success) {
	    var facebookURL = "https://www.facebook.com/dialog/oauth?client_id=";
	    facebookURL += params.client_id + "&redirect_uri=" + encodeURIComponent(params.callback_url) + "&scope=" + params.scope.join(',') + "&display=" + params.display + "&response_type=" + params.response_type;

	    try {
	        var startURI = new Windows.Foundation.Uri(facebookURL);
	        var endURI = new Windows.Foundation.Uri(params.callback_url);
	        console.log(params.callback_url);

	        Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
				Windows.Security.Authentication.Web.WebAuthenticationOptions.default,
				startURI,
				endURI).then(callbackFacebookWebAuth, callbackFacebookWebAuthError);
	    }
	    catch (err) { console.log(err); return; }
	}
	$.extend({
		facebook: (function(){
			var defaults = {
				client_id: '',
				scope: ['read_stream'],
				display: 'popup',
				response_type: 'token',
				callback_url: 'https://www.facebook.com/connect/login_success.html'
			},
                	graph_base = 'https://graph.facebook.com';
				
			return {
				authorize: function(options, success_cb){
				    for (var attr in options) {
				        if (options.hasOwnProperty(attr)) {
				            defaults[attr] = options[attr];
				        }
				    }
				    this.success = success_cb || function () { };
					launchFacebookWebAuth(defaults, success_cb)
					$.session('auth', { token: this.token, response: this.response });
					if (this.response_code != 2) {
					    return true;
					}
					return false;
				},
				token: '',
				response: '',
				response_code: '',
                		user_data: false
			};
		})()
	});
})(window.$);

*/
