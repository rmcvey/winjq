;(function($){
	$.fn.content = function(dir, option, fn_success, fn_error){
		var incoming = $(this),
			direction = dir || 'enterContent',
			params = option || null,
			success_fn = fn_success || $.fn.noop,
			error_fn = fn_error || $.fn.noop;
		
		WinJS.UI.Animation[dir](incoming, offset).done(
			function completed(){
				success_fn.apply(incoming, [incoming])
			},
			function error(){
				error_fn.apply(incoming, [incoming])
			}
		);
		return this;
	}
	$.fn.enterContent(options, fn_success, fn_error){
		if(this._util.is.callable(options)){
			fn_success = options;
			fn_error = fn_success;
			options = null;
		} else if(!options){
			options = null;
		}
		return $(this).content('enterContent', options, fn_success, fn_error);
	}
	$.fn.exitContent(options, fn_success, fn_errors){
		if(this._util.is.callable(options)){
			fn_success = options;
			fn_error = fn_success;
			options = null;
		} else if(!options){
			options = null;
		}
		return $(this).content('exitContent', options, fn_success, fn_error);
	}
})(window.$);
