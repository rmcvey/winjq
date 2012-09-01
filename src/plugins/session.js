;(function($){
	var session_util = (function(storage){
		var _get = function(key){
			return JSON.parse(storage.getItem(key));
		}
		var _set = function(key, val){
			var str = JSON.stringify(val);
			storage.setItem(key, str);
			return
		}
		return {
			get: function(k){
				return _get(k);
			},
			set: function(k,v){
				return _set(k, v);
			}
		}
	})(window.sessionStorage);
	$.extend({
		session: function(key, value){
			if(value !== undefined){
				return session_util.set(key, value);
			} else {
				return session_util.get(key);
			}
			return this;
		}
	});
})(window.$);