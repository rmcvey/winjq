;(function($){
	$.fn.badgeUpdate(options, fn_success, fn_error){
		var incoming = $(this),
			defaults = options || null,
			params = $.merge(defaults, options),
			success = function(elem){
				var context = $this[0];
				return fn_success.apply(context, [context]);
			},
			error = function(elem){
				var context = $this[0];
				return fn_error.apply(context, [context]);
			};
			
		WinJS.UI.Animation.updateBadge(incoming, params).done( success, error );
		return this;
	}
})(window.$);