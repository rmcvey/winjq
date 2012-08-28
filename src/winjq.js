(function enhance(){
	String.prototype.supplant = function(o){
		o = o || {}
		return this.replace(/{([^{}]*)}/g,
	        function (bracketed, clean) {
	            var object_value = o[clean];
	            return ['string', 'number'].indexOf((typeof object_value)) > -1 ? object_value : bracketed;
	        }
	    );
	}
})();

if(typeof window['toStaticHTML'] === 'undefined'){
	window.toStaticHTML = function(val){return val;}
	window.WinJS = {}
	var handler = function(){

	}
	WinJS.xhr = function(options){
		var client = new XMLHttpRequest();
		var callbacks = {};
		var _done = function(){
			if(typeof callbacks['complete'] === 'undefined'){
				for(var x = 0; x < arguments.length; x++){
					switch(arguments[x].name)
					{
						case 'complete':
							callbacks['complete'] = arguments[x];
							break;
						case 'error':
							callbacks['error'] = arguments[x];
							break;
						case 'progress':
							callbacks['progress'] = arguments[x];
							break;
						default:break;
					}
				}
			}
			
			if(this.readyState == 4){
				if(this.status == 200) {
					try{
						callbacks.complete.apply(this, [this.responseText, this])
					} catch(e) {
						callbacks.error.apply(this, [e, this]);
					}
				} else {
					callbacks.error.apply(this, ['error', this])
				}
			}
		}
		client.onreadystatechange = _done;
		client.open(options.type, options.url );
		client.send(options.data || null);
		return {
			done: _done
		}
	}
}

var $ = (function(){
	var $ = function(selector, context, root){
		return new $.fn.init(selector, context || document, root);
	};

	$.fn = $.prototype = {
		constructor: $,
		init: function(selector, context){
			if ( !selector ) {
				return this;
			}

			if ( selector.nodeType ) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
			}

			if( this._util.is.callable( selector ) ){
				this.readyList.push( selector );
				return this;
			}
			
			if ( selector === "body" && !context && document.body ) {
				this.context = document;
				this[0] = document.body;
				this.selector = selector;
				this.length = 1;
				return this;
			}
			if( selector && typeof selector['toUpperCase'] !== 'undefined' ) {
				this.selector = selector;
				var elems = context.querySelectorAll(selector), i = 0;
				this.length = elems.length;
				for(; i < this.length; i++){
					this[i] = elems[i];
				}
			} else {
				this.length = 0;
				this[0] = undefined;
			}
			return this.prototype;
		},
		readyList: [],
		length: 0,
		domLoaded: false,
		selector: '',
		size: function() {
			return this.length;
		},
		eq: function( i ) {
			i = +i;
			var requested = (i === -1 ?
				this.slice( i ) :
				this.slice( i, i + 1 ));
			return $(requested[0]);
		},
		first: function(){
			return this.eq(0);
		},
		last: function(){
			return this.eq(-1);
		},
		append: function(node){
			if(this._util.is.array( node )){
				for(var x = 0; x < node.length; x++){
					this.append( node[x] )
				}
			} else if( !node.nodeType ){
				var n = $(this[0]),
					html = n.html();
				html = html + node;
				n.html( html );
			} else {
				if(node.nodeType){
					this[0].appendChild(node);
				}
			}
			return this;
		},
		prepend: function(node){
			if(this._util.is.array( node )){
				for(var x = 0; x < node.length; x++){
					this.prepend( node[x] )
				}
			} else if( !node.nodeType ){
				var n = $(this[0]),
					html = n.html();
				html = node + html;
				n.html( html );
			} else if(node.nodeType) {
				this[0].prependChild(node);
			}
			return this;
		},
		addClass: function( klass ){
			this.each(function(){
				var cl = this.getAttribute('class');
				cl += ' '+klass;
				this.setAttribute('class', cl);
			});
			return this;
		},
		removeClass: function( klass ){
			console.log('hello guvna')
			this.each(function(){
				var cl = this.getAttribute('class');
				cl = cl.replace(klass, '');
				this.setAttribute('class', cl);
			});
			return this;
		},
		hasClass: function( klass ){
			for(var j = 0; j < this.length; j++){
				var classes = $(this[j]).attr('class'),
					cl = classes && classes.split(' ') || [],
					reg = new RegExp( klass , 'gi');
		
				for(var i = 0; i < cl.length; i++ ){
					if(reg.test( cl[i] )) {
						return true;
					}
				}
			}
			return false;
		},
		on: function( action, selector, callback){
			this.each(function( index, domNode ){
				this.addEventListener( action, function(e){
					callback.apply(this, [e])
				}, true);
			});
		},
		click: function( callback ){
			this.each(function( index, domNode ){
				this.addEventListener('click', function(e){
					callback.apply(this, [e])
				}, false);
			});
		},
		ready: function(fn){
			if( this._util.is.callable(fn) ){
				this.readyList.push(fn);
			}
			return this;
		},
		supplant: function(obj) {
			var tmp = $(this[0]),
				text = tmp.html(),
				supplanted = text.supplant( obj );

			return tmp.html( supplanted );
		},
		load: function( r_url, callback, onerror ){
			var that = this;
			$.ajax({
				url: r_url,
				success: callback || function(response, text){
					$(that[0]).html(text);
				},
				error: onerror || function(data){
					console.log(data);
				}
			});
		},
		css: function( name, extra) {
			if( typeof name === 'string'){
				name = this._util.camelCase( name );
			}

			if ( name === "cssFloat" ) {
				name = "float";
			}

			if( typeof extra === 'undefined' && !this._util.is.object(name) ){
				return window.getComputedStyle( this[0] ).getPropertyValue( name );
			} else if ( typeof extra === 'undefined' && this._util.is.object(name) ){
				var properties = name;
				for(var i = 0; i < this.length; i++){
					for( var attr in properties ){
						$(this[i]).css(attr, properties[ attr ]);
					}
				}
				return this;
			} else {
				this.each(function(){
					this.style[name] = extra;
				});
				return this;
			}
		},
		hide: function(){
			this.each(function(){
				$(this).css('display', 'none')
			})
			return this;
		},
		show: function(){
			this.each(function(){
				$(this).css('display', 'block')
			})
			return this;
		},
		_util: {
			is: {
				object: function(o){
					return (o !== null && typeof o === "object" && typeof o.splice !== "function");
				},
				array: function(o){
					return typeof o === "object" && typeof o.splice === "function";
				},
				callable: function(o){
					return typeof o !== "undefined" && typeof o === "function";
				}
			},
			camelCase: function( str ){
				var rdashAlpha = /-([a-z]|[0-9])/ig,
					rmsPrefix = /^-ms-/
				return str.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, function( all, letter ) {
					return ( letter + "" ).toUpperCase();
				});
			}
		},
		find: function(selector){
			return $(selector, this[0]);
		},
		merge: function(obj1, obj2){
			var attr;
			for(attr in obj2){
				if(obj2.hasOwnProperty(attr)){
					obj1[attr] = obj2[attr];
				}
			}
			return obj1;
		},
		parent: function(){
			return $(this[0].parentNode);
		},
		parents: function(selector){
			
		},
		require: function(script, callback){
			(function loadscript(d, source, cb){
				var script = d.createElement('script'); script.async = true; script.src = source;
				script.type = 'text/javascript'; script.onload = cb || function(e){};
				(d.getElementsByTagName('head')[0] || d.getElementByTagName('body')[0]).appendChild(script);
			})(document, script, callback);
		},
		text: function(val){
			if( undefined === val ){
				return this[0].textContent || "";
			}
			this[0].textContent = val;
		},
		html: function( val ){
			if( typeof val === 'undefined' ){
				return this[0].innerHTML;
			}
			this[0].innerHTML = toStaticHTML( val );
			return this;
		},
		data: function(key, val){
			this.attr('data', '{'+key+':'+val+'}')
		},
		get: function(index){
			return this.eq( index )[0];
		},
		attr: function(key, val){
			if( !this._util.is.object(key) && typeof val === 'undefined' ){
				var i = 0;
				for( ; i < this.length; i++ ){
					return this[i].getAttribute(key);
				}
			} else {
				if( this._util.is.object(key) === true ) {
					this.each(undefined, function(){
						var attr, options = key;
						for(attr in key){
							this.setAttribute(attr, options[attr]);
						}
					});
					return this;
				} else {
					this.each(undefined, function(){
						this.setAttribute(key, val);
					});
				}
			}
			return this;
		},
		val: function( tval ){
			if( tval !== undefined ){
				this.get(0).value = tval;
				return this;
			} else {
				return this.get(0).value;
			}
		},
		each: function(collection, callback){
			var i = 0;
			if( typeof collection === 'undefined' && this._util.is.callable(callback) ){
				collection = this.slice(0);
			} else if ( typeof callback === 'undefined' && this._util.is.callable(collection) ) {
				callback = collection;
				collection = this;
			}
			
			if( this._util.is.array( collection )){
				for( ; i < collection.length; i++ ){
					callback.apply(collection[i], [ i, collection[i] ]);
				}
			} else {
				for( var attribute in collection ){
					if(collection.hasOwnProperty(attribute)){
						callback.apply(collection[attribute], [ attribute, collection ])
					}
				}
			}
			return this;
		},
		slice: [].slice,
		push: [].push,
		sort: [].sort,
		splice: [].splice,
		noop: function(){},
		ajax: function( options ){
			var win_options = {
				type: options.type || 'GET',
				url: options.url || window.location.href,
				user: options.username || null,
				password: options.password || null,
				headers: options.headers || {},
				data: options.data || null
			}
			var completed = options.success || options.complete || $.fn.noop,
				errored = options.error || $.fn.noop;

			WinJS.xhr( win_options ).done(
				function complete(response){
					options.success.apply(response, [response.responseText, response]);
				},
				function error(response){
					(options.error || function(){}).apply(response);
				}
			)
		}
	}

	$.fn.init.prototype = $.fn;

	$.extend = $.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		if ( typeof target === "boolean" ) {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}

		if ( typeof target !== "object" && !$.fn._util.is.callable(target) ) {
			target = {};
		}

		if ( length === i ) {
			target = this;
			--i;
		}

		for ( ; i < length; i++ ) {
			if ( (options = arguments[ i ]) != null ) {
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					if ( target === copy ) {
						continue;
					}

					if ( deep && copy && ( $.fn._util.is.object(copy) || (copyIsArray = $.fn._util.is.array(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && $.isArray(src) ? src : [];

						} else {
							clone = src && $._util.is.object(src) ? src : {};
						}

						target[ name ] = $.extend( deep, clone, copy );

					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
		return target;
	};

	$.extend({
		each: function( object, callback ){
			return $.fn.each( object, callback );
		},
		ajax: function( options ) {
			return $.fn.ajax( options );
		},
		post: function(r_url, r_data, r_success, r_error){
			var options = {
				method: 'POST',
				url: r_url,
				data: r_data,
				success: r_success || $.fn.noop,
				error: r_error || $.fn.noop
			};
			$.fn.ajax( options );
			return this;
		},
		get: function(r_url, r_success, r_error){
			var options = {
				method: 'GET',
				url: r_url,
				success: r_success,
				error: r_error || $.fn.noop
			};
			$.fn.ajax( options );
			return this;
		},
		getJSON: function( url, callback ){
			$.fn.load( url, function(data, text){
				var response = JSON.parse(text);
				try{
					callback.apply(this, [response])
				} catch (e) {
					return 'error: '+e.message;
				}
			});
			return this;
		},
		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
		},
		merge: function(o1, o2){
			return $.fn.merge(o1, o2);
		},
		require: function(script, callback){
			(function loadscript(d, source, cb){
				var script = d.createElement('script'); script.async = true; script.src = source;
				script.type = 'text/javascript'; script.onload = cb || function(e){};
				(d.getElementsByTagName('head')[0] || d.getElementByTagName('body')[0]).appendChild(script);
			})(document, script, callback);
			return this;
		},
		url: function(){
			var _href = location.href;
			var _path = location.pathname;
			var _qs = location.search.replace(/\?/, '');
			var _hash = location.hash.replace(/\#/, '');

			var _parse = function(string){
				var params = string.split('&');
				var holder = [];

				for(var i = 0; i < params.length; i++){
						var temp 	= params[i].split('=');
						var key 	= temp[0];
						var val 		= temp[1];
						holder[key] = val;
				}
				return holder;
			};

			var _qs_params 	= _parse(_qs);
			var _hash_params = _parse(_hash);

			return {
				href:_href,
				path:_path,
				get:function(name){
					var retval = null;
					if(_qs_params[name] !== undefined){
						retval = _qs_params[name];
					} else if(_hash_params[name] !== undefined) {
						retval = _hash_params[name];
					}
					return retval;
				},
				go:function(loc){
					location.href = loc;
				},
				back:function(item){
					if(item !== undefined){
						item = -1;
					}
					history.go(item);
				}
			};
		},
		fireReady: function(){
			if( $.fn.domLoaded === true ){
				for(var z = 0; z < $.fn.readyList.length; z++){
					var cur = $.fn.readyList.pop();
					cur.call( $ )
				}
			}
		}
	});

	var DOMContentLoaded = function() {
		$.fn.domLoaded = true;
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		$.fireReady();
	};

	document.addEventListener('DOMContentLoaded', DOMContentLoaded, false);

	return $;
})(window);
window.$ = $;