;(function($){
	$.fn.pageAnimate = function(dir, options, fn_success, fn_error){
		var element = $(this).get(0),
			$this = this,
			success = function(elem){
				var context = $this[0];
				return fn_success.apply(context, [context]);
			},
			error = function(elem){
				var context = $this[0];
				return fn_error.apply(context, [context]);
			},
			params = options || null,
			direction = dir || 'enterPage';
		
		WinJS.UI.Animation[direction](element, params).done(
			success, error
		);
		return this;
	};
	$.fn.enterPage = function(options, fn_success, fn_error){
		if(this._util.is.callable(options)){
			fn_success = options;
			fn_error = fn_success;
			options = null;
		} else if(!options){
			options = null;
		}
		return $(this).pageAnimate('enterPage', options, fn_success, fn_error);
	};
	$.fn.exitPage = function(options, fn_success, fn_error){
		if(this._util.is.callable(options)){
			fn_success = options;
			fn_error = fn_success;
			options = null;
		} else if(!options){
			options = null;
		}
		return $(this).pageAnimate('exitPage', options, fn_success, fn_error);
	};
})(window.$);