/**
* JX 1.0.1
* @Author: Teddy Moussignac
* @website: http://www.teddyproductions.com
* (c) Copyright 2013, All Rights Reserved.
**/

(function(){

	/**
	* Init jx & Resolve Conflit
	**/
	var jx = window.jx || {
		
		VERSION : '1.0.1',
		
		BROWSER : function(){
			var b,v,a = navigator.userAgent;
			if(a.match(/Safari|iPhone|iPad|iPod/i) !== null) b = 'webkit safari';
			if(a.match(/Chrome/i) !== null) b = 'webkit chrome';
			if(a.match(/Firefox/i) !== null) b = 'moz firefox';
			if(a.match(/MSIE/i) !== null){
				v = a.match(/msie[\s][a-zA-Z0-9]/i)[0].split(' ')[1];
				if( v == 9 ) b = 'msie ie9'; 
				else if( v == 8 ) b = 'msie ie8'; 
				else if( v < 8 ) b = 'not-supported';
				else b = 'msie';
			}
			if(a.match(/Opera/i) !== null) b = 'o opera';
			return b;
		}(),
		
		BROWSERID : function(){
			var b, a = navigator.userAgent;
			if(a.match(/moz/i) !== null) b = 'moz';
			if(a.match(/webkit/i) !== null) b = 'webkit';
			if(a.match(/msie/i) !== null) b = 'ms';
			if(a.match(/opera/i) !== null) b = 'o';
			return b;
		}(),
				
		OS : function(){
			var o,a = navigator.userAgent;
			if(a.match(/Linux/i) !== null) o = 'linux';
			if(a.match(/Macintosh|mac/i) !== null) o = 'mac';
			if(a.match(/Windows/i) !== null) o = 'windows';
			return o;
		}(),
		
		hasTouch : function(){
			return ('ongesturestart' in window) || ('onmsgesturechange' in window);
		}(),
		
		DEVICE : function(){
			var d,a = navigator.userAgent;
			if( a.match(/Mobile/i) !== null ){
				d = 'mobile';
				if(a.match(/Android/i) !== null) d += ' android';
				if(a.match(/iPad/i) !== null) d += ' ipad';
				if((a.match(/iPhone/i) !== null) || (a.match(/iPod/i) !== null)) d += ' iphone';
			}else{
				d = 'desktop';
			}
			return d;
		}(),
				
		orientation : function(){
			var w,h,s,d,m,b = document.body;
			s = function(){
				switch (window.orientation){
		    		case 0: 
		    		case 180: 
		    			b.removeClass('landscape').addClass('portrait');
		    			m = 'portrait';
		    			break;
		    		default:
		    			b.removeClass('portrait').addClass('landscape');
		    			m = 'landscape';
		    			break;
				}
			}();
			d = function(){
				w = b.offsetWidth;
				h = b.offsetHeight;
				if( w > h ){
					b.removeClass('portrait').addClass('landscape');
					m = 'landscape';
				}else{
					b.removeClass('landscape').addClass('portrait');
					m = 'portrait';
				}
			}();
			return m;
		},
										
		/**
		* jx.request({url : 'db/system/panel.data', async : false });
		* jx.request({url : 'db/system/panel.data', cacheTime : 24, method : post, params : 'x=y&z=w', callback : function(d){....} }); //control cache lifetime 
		* jx.request({url : 'db/system/panel.data', cache : false, callback : function(){...} }); //for security and force no cache
		**/
		request : function(){
			
			var a = arguments[0] || {}, 
				t = this;
				method = (a.method || 'get').encode(),
				callback = a.callback || null,
				params =  a.params || '',
				cache = a.cache !== undefined ? a.cache : true,
				cacheTime = a.cacheTime || 0,
				url = a.url + ( cache !== true ? ( (a.url.match(/\?/) !== null ? '&' : '?') + 't=' + Math.round((new Date()).getTime() / 1000) ) : '' );
			
			if( (a.params !== undefined) && (method === 'get') ){
				url = a.url + params + ( cache !== true ? ( ( a.url.match(/\?/) !== null ? '&' : '?' ) + 't=' + Math.round((new Date()).getTime() / 1000) ) : '' );
			}	
			
			if(a.async === false){
				
				if( a.window === true ) window.open( url )
				else location.href = url;
				return false;
			
			}else{
			
				var xhr = new XMLHttpRequest();
				xhr.open(method, url, true);
				
				var close = function(){
					xhr.setRequestHeader("Connection", "close");
				}
				
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				
				if( cache === false ) xhr.setRequestHeader("Cache-Control", "no-store");
				else if( typeof cacheTime === 'number' ) xhr.setRequestHeader("Cache-Control", "max-age="+ cacheTime * 60 * 60 +"");
				else xhr.setRequestHeader("Cache-Control", "no-cache");
				
				xhr.send(params);
				xhr.onreadystatechange = (function(xhrx){	
					return function(){
						if( xhrx.readyState < 4 ) return; //break
						if( xhrx.status == 200 || xhrx.status == 0 ) if( a.callback !== undefined ) a.callback(xhrx.responseText);
					}	
				})(xhr);
				
				xhr.on = jx.ui.fn.on;
				xhr.off = jx.ui.fn.off;
				
				return xhr;
			}
		},
		
		/**
		* jx.include({ url : 'resources/ad/ad.css' });
		* jx.include({ url : 'resources/ad/ad.js', exe : function(){ .. } });
		* jx.include('src/js/jx.ui.ScrollView.js');
		* jx.include('src/css/jx.ui.ScrollView.css');
		**/
		include : function(){
			var e,a = arguments[0] || {};
			if( typeof a === 'string' ){
				if( a.match(/\.css/i) !== null ){
					if( jx.$('head').find('link[href="' + a + '"]').length <= 0 ){
						jx.el( 'link', { rel : 'stylesheet',  href : a } ).appendTo(jx.$('head'));
					}
				}else{
					if( jx.$('head').find('script[src="' + a + '"]').length <= 0 ){
						jx.el('script', { type : 'text/javascript', src : a } ).appendTo(jx.$('head'));
					}
				}
				return;
			}
			
			e = jx.el( ( a.url.match(/\.css/i) !== null || (a.type === 'text/css') ) ? 'link' : 'script' );
			
			if(( a.url.match(/\.css/i) !== null ) || ( a.type === 'text/css' )){
				if( jx.$('head').find('link[href="' + a.url + '"]').length <= 0 ){
					e.rel = 'stylesheet';
					e.href = a.url;
				}
			}else{
				if( jx.$('head').find('script[src="' + a.url + '"]').length <= 0 ){
					e.type = 'text/javascript';
					e.src = a.url;
				}
				else a.exe();
			}
			
			jx.$('head').appendChild(e);
			
			e.on('load', function(){
				if(( a.exe !== undefined ) && ( a.exe != null )) a.exe();
			});
		},
				
		/**
		* Run module
		* jx.exe('email');//uncache
		* jx.exe('email', true);//cache
		**/
		exe : function(){
			var a = arguments || {},
				p = (a[0]).match(/jx\./) !== null ?  ((a[0]).replace('jx.','').replace(/\./,'/')) : '';
				
			if( typeof a[1] !== undefined ){
				if ( a[1] === true ) jx.include('src/js/' + p + '.js');
				else jx.include('src/js/' + p + '.js?time=' + Math.round((new Date()).getTime() / 1000));
			}
			else jx.include('src/js/' + p + '.js?time=' + Math.round((new Date()).getTime() / 1000));
		},
		
		/**
		* jx.out('Hello World');
		* jx.out(jx.el('div').txt('Hello World!'));
		* jx.out({ confirm : true, message : 'Go to NYPost.com', exe : function(){ console.log('There you go...') } });
		**/
		out : function(){
			var p,b,s,m,f,c,k,w,a = arguments[0]; w = window; d = jx.$('body');
			p = jx.el('div', { clss : 'out' }).appendTo(d);
			p.dismiss = function(){
				p.fadeTo(0);
				setTimeout(function(){
					p.remove();
					delete p;
				}, 400);
			}
			b = jx.el('div', { clss : 'dialogue'  });
			s = function(){
				b.css({ top : Math.round(( d.offsetHeight / 2 ) - ( b.offsetHeight/ 2 )) + 'px' });
			}
			if( typeof a === 'object'){
				if( a.confirm === true ){
					m = jx.el('p').html(arguments[0].message);
					f = function(e){
						if(e.stopPropagation) e.stopPropagation();
						else e.cancelBubble = true;
						a.exe();
						p.dismiss();
					}
					c = jx.el('a', { clss : 'jx-btn', href : '#' });
					c.txt('YES');
					c.on('click',f);
					if(jx.hasTouch) c.on('tap',f);
					b.append(m);
					b.append(c);
				}
				else b.append(a);
			}else{
				m = jx.el('p').html(a);
				b.appendChild(m);	
			}
			setTimeout(function(){ 
				p.empty().appendChild(b);
				k = jx.el('a', { clss : 'jx-btn'+(typeof a === 'string' ? '' : ' close') , href : '#' });
				if( a.confirm === true ) k.txt('NO');
				else{
					if(typeof a === 'object') k.addClass('close').txt('CLOSE');
					else{
						if(a.toString().match(/</) !== null) k.addClass('close').txt('CLOSE');
						else k.removeClass('close').txt('OK');	
					}
				}
				k.appendTo(b).init(function(e){
					if(e.stopPropagation) e.stopPropagation();
					else e.cancelBubble = true;
					p.dismiss();
				});
			}, 0);
			setTimeout(function(){
				s();
				b.addClass('init');
				p.css({'z-index':10000}).fadeTo(1);
				w.on('orientationchange', s);
				w.on('resize', s);
			}, 100);
		},
				
		/**
		* m = jx.jsDom({ 'dom' : [ { 'el' : 'span', attributes : { id : 'clickie', clss : 'btn' }, styles : { color : '#ccc' } } ] })
		* m.appendTo(body);
		**/
		jsDom : function(){
			var x,t,p,j = arguments[0];
			p = jx.el('div', { clss : 'dom-wrap' });
			for( var i = 0; i <= j.dom.length-1; i++ ){
				t = j.dom[i];
				x = jx.el(t.el + '', (t.attributes || {}));
				if( typeof t.styles !== 'undefined' ) x.css(t.styles);						
				x.addClass('dom-item');
				x.appendTo(p);
			}
			return p;
		},
		
		/** 
		* jx.$('#head')
		**/
		$ : function(q, cc){
			var f,o,c,t = q, 
				c = cc || document, 
				o = {};
				
			f = function(){
				if(/#*|\.*|#*.\.*|\s|\[*\]|\:|\::|\=|\>|/gmi.test(t)){
					if(c.querySelectorAll(t).length === 1) return c.querySelector(t);
					return c.querySelectorAll(t);
				}else{
					if(c.getElementsByTagName(t).length > 1) return c.getElementsByTagName(t);	
					return c.getElementsByTagName(t);
				}
			}
			o = f();
			return o;
		},
				
		log : function(){
			var w,l,c,b,a = arguments[0] || {}; w = {}; 
			l = jx.el('li', { clss : 'mr_l fx'});
			c = jx.el('a', { clss : 'mr_l_c fx'});
			b = jx.el('div', { clss : 'mr_l_body fx'}).html(a.toString());
			if( jx.$('#mr_l_w').length <= 0 ) w = jx.el('ul', { id : 'mr_l_w', clss : 'fx'}).appendTo('body'); 
			else w = jx.$('#mr_l_w');
			setTimeout(function(){
				l.appendTo(w);
				c.appendTo(l);
				b.appendTo(l);
			}, 0);
			setTimeout(function(){
				l.addClass('active');
			},100);
			c.init(function(e){
				if(e.stopPropagation) e.stopPropagation();
				else e.cancelBubble = true;
				l.moveTo(0,'100%').fadeTo(0);
				setTimeout(function(){
					l.removeClass('active').remove();
					if(w.childNodes.length <= 0 )  w.remove();
				}, 100);
			});
		},
		
		clearLog : function(){
			try{
				var w = jx.$('#mr_l_w');
				w.moveTo(0,'100%').fadeTo(0).removeClass('active');
				setTimeout(function(){
					w.remove();
				}, 400);
			}catch(e){}
		},
		
		ready : function(fn){
			if( window.addEventListener ) window.addEventListener("load", fn, false);
			else window.attachEvent("onload", fn);
		},
		
		navigateTo : function(p){
			jx.util.network.history.add(p)
		},
		
		error : function( e ) {
			throw new Error( e );
		}
						
	}
	/**
	**/
	
	/**
	* jx.util
	**/
	jx.util = {
		/**
		* Collection Object
		* Note: Objects are stored in memory
		**/
		Collection : function(){
			
			var c = new Array();
			
			c.add = function(o){
				try{
					var s = true;
					if(o.uid !== undefined){
						c.each(function(i){
							if(i.uid === o.uid) s = false 
						})
					}
					o.cid = 'c' + parseInt(c.length + 1);
					if(s) c.push(o);
					else throw('Error');
					return c;	
				}catch(e){
					console.log('The object is already in the system.');
					console.log(o);
				};
			}
			
			c.set = function(k,v){
				this.add({ key :  k, value : v })
				return c;
			}
			
			c.get = function(k){
				var o;
				c.each(function(i){
					if( i.key === k ) {
						if(typeof i.value === 'string') o = i.value.isJSON() ? i.value.parseJSON() : i.value;
						else o = i.value;
					}
				});
				return o;
			}
			
			c.remove = function(k){
				c.each(function(i){
					if( i.key === k ) c.splice(c.indexOf(c[i]),1)
				})
				return c;
			}
	
			// db.select('last')
			// db.select('*',{ first : 'teddsy', cid : 2 })
			// returns array
			c.select = function(q,w){
				var n = c;
				if(c.length < 1) throw('Collection is empty');
				if(q === '*'){ 
					if( w === undefined ) return n;
					else{
						var r = new Array();
						for( var i = 0 ; i < n.length ; i++ ){
							for( var k in w ){
								if( (n[i][k]) === (w[k]) ) r.push(n[i]);
								break;
							}
						}
						return r;	
					}
				}
				else{
					if( w === undefined ) {
						var r = new Array();
						n.each(function(i){
							r.push(i[q]);	 
						 });
						 return r;
					}else{
						var r = new Array();
						for( var i = 0 ; i < n.length ; i++ ){
							for( var k in w ){
								if( (n[i][k]) === (w[k]) ) r.push(n[i][q]);
								break;
							}
						}
						return r;	
					}
				}
			}
			
			// db.update({ age : 22 })
			// db.update({ first : 21 },{cid : 4})
			c.update = function(q,w){
				var r,t = c;
				if(c.length < 1) throw('Collection is empty');
				if( w === undefined ){
					r = new Array();
					for( var i = 0 ; i < t.length ; i++ ){
						for( var y in q ){ 
							t[i][y] = q[y];
						}
						r.push(t[i]);
					}
					c = r;
					return r;
				}else{
					r = new Array();
					for( var i = 0 ; i < t.length ; i++ ){
						for( var y in w ){ 
						if( (t[i][y]) === (w[y]) ){
							for( var x in q ){
								t[i][x] = q[x];
							}
						};
						}
						r.push(t[i]);
					}
					c = r;
					return r;
				}	
			}
			
			// db.del('last')
			// db.del('*',{ first : 'teddsy', cid : 2 })
			c.del = function(q,w){
				var r,t = c;
				if(c.length < 1) throw('Collection is empty');
				if(q === '*'){
					if( w !== undefined ){
						for( var i = 1 ; i < t.length ; i++ ){
							for( var y in w ){ 
								if( (t[i][y]) === (w[y]) ) t.splice(t.indexOf(t[i]),1);
							}
						}
					}else{
 						c.splice(0,c.length);
					}
					return c;
				}
				else{
					if( w === undefined ){
						r = new Array();
						for( var i = 0 ; i < t.length ; i++ ){
							delete (t[i][q]);
							r.push(t[i]);
						}
						c = r;
						return c;
					
					}else{
						r = new Array();
						for( var i = 0 ; i < t.length ; i++ ){
							for( var y in w ){ 
								if( (t[i][y]) === (w[y]) ){
									delete (t[i][q]);
								};
							}
							r.push(t[i]);
						}
						c = r;
						return c;
					}
				}
			}
			// db.reset[]
			c.reset = function(){
				return this.del('*');
			}	
			return c;	
		},
		
		/**
		* jx.util.Event
		**/
		event : {
		
			version: 1.0,
			
			fireEvent : function(el,e,d){
				var ce = document.createEventObject (window.event);
                ce.event = e;  // left button is down
                ce.data = d;
                el.fireEvent ("onresize", ce);
			},
			
			/**
			* jx.util.event.trigger('bufferFinished');	
			* jx.util.event.trigger('bufferFinished','#head-1,#input-1');	
			* jx.util.event.trigger('bufferFinished', el,Event);	
			**/
			trigger : function(n,o,eventData){
				 
				if(document.createEvent){
				
					var e = document.createEvent('Event');		
					e.initEvent(n,true,true);
					if(eventData !== undefined){
						for( var i in eventData ) e[i] = eventData[i];
					}
					if(o !== undefined){
						if( typeof o === 'string' ) {
							var x = jx.$(o);
							if ( ( x instanceof NodeList ) || ( x instanceof StaticNodeList )  ){
								x.each(function(i){
									i.dispatchEvent(e);
								});
							}else x.dispatchEvent(e);
						}
						else if ( ( o instanceof NodeList ) || ( o instanceof StaticNodeList ) ){
							o.each(function(i){
								i.dispatchEvent(e);
							});
						}
						else o.dispatchEvent(e);
					}else{
						jx.$('body *').each(function(i){
							i.dispatchEvent(e);
						});
					}
					return e;
				}
				else{
					if(o !== undefined){
						if( typeof o === 'string' ){
							var x = jx.$(o);
							if ( ( x instanceof NodeList ) || ( x instanceof StaticNodeList )  ){
								x.each(function(i){
									jx.util.event.fireEvent(i,n,eventData)
								});
							}
							else jx.util.event.fireEvent(x,n,eventData)
						}
						else if ( ( o instanceof NodeList ) || ( o instanceof StaticNodeList ) ){
							o.each(function(i){
								jx.util.event.fireEvent(i,n,eventData)
							});
						}
						else jx.util.event.fireEvent(o,n,eventData)
					}else{
						jx.$('body *').each(function(i){
							jx.util.event.fireEvent(i,n,eventData)
						});
					}
				}
			}
		},
			
		/**
		* In Helper file
		* new jx.util.Module('module-id', fn(){ ... });
		**/
		Module : function(n,o){
			o();
			setTimeout(function(){
				jx.$('head script').each(function(i){
					if( i.attr('src').indexOf('/' + n + '.js') > -1 ) i.remove();
				});
			}, 0);
		},
		
		/**
		* new jx.util.network.Url('https://localhost:8888/#!/blogs/html/head?page=2&p=true&sex=false')
		* u.getParams() u.getPath()
		**/
		network : {
		
			info : location,
			
			online : function(){
				return navigator.onLine;
			},
			
			// var u = new jx.util.network.Url(location.href)
			Url : function(s){
				var a,u = new String(s) || this.toString();
				u.secure = u.match(/https:/) !== null;
				u.local = u.match(/localhost:/) !== null;
				u.hasParams = u.match(/\?/) !== null ||  u.match(/\#!/) !== null;
				u.getProtocol = function(){
					if(u.secure) return 'https'
					else return 'http'
				}
				u.params = function(){
					var p = '';
					if(this.hasParams) { 
						p =  u.split('?')[1];
					}
					return p;
				}
				u.getParams = function(){
					var s = {};
					if(this.hasParams && u.match(/\?/) !== null) { 
						a = u.split('?')[1].split('&')
						a.each(function(i){
							var x = i.split('=');
							s[x[0]] = x[1]
						})
					}			
					return s;
				}
				u.path = function(){
					if(u.match(/\#!/) !== null ){
						a = u.split('#!')[1].split('?')[0];
					}
					return a;
				}
				u.getPath = function(){
					if(u.match(/\#!/) !== null ) {
						if(u.match(/\?/)) a =  u.split('?')[0].split('#!')[1].split('/');
						else a =  u.split('#!')[1].split('/');
						a.each(function(i){
							if(i.length <= 0) a.splice(a.indexOf(i),1)
						})
					}
					return a;
				}
				return u;	
			},
			
			/**
			* router
			* jx.util.network.route(path,action,exe)
			* path = jx.util.network.Url(location.href).getPath() ( Array )
			* action = action name ( String )
			* exe = callback ( Function )
			**/
			router : {
				
				// jx.util.network.router.add('/blogs/htm/heading/4','Contact', function(){jx.log('hey')})
				add : function(){
					jx.ROUTES.add({ uid : arguments[0], title : arguments[1], exe : arguments[2] });
					return jx.ROUTES;
				},
				// jx.util.network.router.exe()
				exe : function(){
					if((jx.ROUTES === undefined) || ( jx.ROUTES.length === 0 )) return;
				 	var r,p = new jx.util.network.Url(location.href).path();
					jx.ROUTES.each(function(i){
						for( var x in i ){
							if( i.uid === p){
								r = i;
								if(typeof r.exe === 'function') r.exe();
								break;
							}
						}
					});
					return r;
				}
			},
			
			/**
			* history 
			**/
			history : {
			
				// x.on('click', jx.util.network.history.add({},'about','/blogs/htm/heading/1?p=3'))
				// o = state object, t = state title, p = path
				add : function(p){
					if(window.history.pushState) window.history.pushState({},'','#!' + p)
					else window.location = '#!' + p;
					jx.util.network.router.exe()
					return window.history;
				},
				// jx.util.network.history.replace({},'about','/blogs/htm/heading/1?p=3')
				replace : function() {
					if(window.history.replaceState) window.history.replaceState({},'','#!' + p)
					else window.location = '#!' + p;
					jx.util.network.router.exe()
					return window.history;
				}
			}
		},
		
		fn : {
			
			trim : function(s){
				var t = s || this;
				return t.toString().replace(/^[ \t]+|[ \t]+$/, '');
			},
					
			encode : function(s){
				var t = s || this;
				return t.toString()
				.replace(/^[ \t]+|[ \t]+$/, '')
				.replace(/[\\]/g, '\\\\')
			    .replace(/[\"]/g, '\\\"')
			    .replace(/[\']/g, "\\\'")
			    .replace(/[\/]/g, '\\/')
			    .replace(/\s{2,}/,' ')
			},
			
			decode : function(s){
				var t = s || this;	
				return t.toString()
			    .replace(/\\{2,}/g,'\\')
			    .replace(/[\\]/g,'')
			},
			
			// Logic from http://json.org/json2.js
			isJSON : function(s){
				var t = s || this;
				return /^[\],:{}\s]*$/.test( 
					t.replace(/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, "@" )
					.replace(/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, "]")
					.replace(/(?:^|:|,)(?:\s*\[)+/g, "")
				)
			},
			
			encodeJSON : function(s){
				var t = s || this;
				return this.replace(/[\\]/g, '\\\\')
			    .replace(/[\"]/g, '\\\"')
			    .replace(/[\/]/g, '\\/')
			    .replace(/[\b]/g, '\\b')
			    .replace(/[\f]/g, '\\f')
			    .replace(/[\n]/g, '\\n')
			    .replace(/[\r]/g, '\\r')
			    .replace(/[\t]/g, '\\t');
			},
			
			parseJSON : function(s){
				var t = s || this;
				if( window.JSON && window.JSON.parse ) return window.JSON.parse( t );
				else{
					if(t.isJSON) return ( new Function( "return " + t ) )();
				}
				return t
			},
			
			toTitleCase : function(s){
				var t = s || this,
					s = new Array();
				t.split(' ').each(function(i){
					var x = i.split('');
					if(x[0] !== undefined ) x[0] = x[0].toUpperCase();
					s.push(x.join(''));
				});
				return s.join(' ');
			},
			
			isInt : function(s){
				var t = s || this;
				return t % 1 === 0;
			},
			
			isEmail : function(s){
				var t = s || this;
				return /(.*)@(.*)\.[a-z]{2,3}/.test(t);
			},
	
			isUSPhoneNumber : function(s){
				var t = s || this;
				var n = t.replace(/[^0-9]/gi, '');
				if( (n.length === 10 ) && ( typeof s % 1 === 0 ) ) return true;
				else return false;
			},
			
			leadZero : function(){
				 var z,s,n = String(this); z = '0'; s = 2;
				 while(n.length < s) n = z + n;
				 return n;
			},
			
			reverse : function(s){
				var t = s || this;
				if( this instanceof String ) return Array.prototype.reverse.apply(t.split('')).join('');
				else{
					var r = new Array();
					for( var i = t.length-1 ; i >= 0 ; i--) r.push(t[i]);
					return r;
				}
			},
			
			contains : function(x){
				if(typeof this === 'string'){
					if( this.indexOf(txt) > -1 ) return true;
					else return false;
				}else{
					for (var i = 0, u = this.length; i < u; i++){
						if ( this[i] === x ) return true;
					}
					return false;
				}
			},
				
			each : function(){
				var s, e, f,a = arguments; 
				f = typeof a[0] === 'function' ? a[0] : null;
				if( ( typeof a[1] === 'number' ) && ( typeof a[2] === 'undefined' )  ) e = a[1];
				if( ( typeof a[1] === 'number' ) && ( typeof a[2] === 'number' )  ){
					s = a[1];
					e = a[2] + a[1];
				}
				for( var i = ( s > 0 ? s : 0 ) ; i <  (e > 0 ? e : this.length) ; i++ ) f(this[i]);
			},
				
			first : function(){
				return this[0];	
			},
				
			last : function(){
				return this[this.length-1];
			},
			
			empty : function(){
				try{
				if( this instanceof Array ) this.splice(0,this.length);
				else{
					if( this.innerHTML !== undefined ) this.innerHTML = '';
					else if( this.innerText !== undefined ) this.innerText = '';
					else if( this.textContent !== undefined ) this.textContent = '';
					else if( this.value !== undefined ) this.value = '';
				}
				return this;
				}catch(e){}
			},
				
			isEmpty : function(){
				if(this.encode().length > 0 ) return false;
				if(this.childNodes) if(this.childNodes.length > 0) return false;
				if((this.innerText !== undefined) || (this.textContent !== undefined)) if(this.html().replace(/\s\n/, '') !== '' ) return false; 
				if(this.value !== undefined) if(this.value.replace(/\s\n/, '') !== '' ) return false; 
				return true;
			},
			
			getCSSInt : function(s){
				var x = s || this;
				if( x instanceof String ){
					if(x.match(/px/i) !== null ) return (x.match(/\./gi) !== null) ? parseFloat(x.toLowerCase().replace('px','')) : parseInt(x.toLowerCase().replace('px',''));
					if(x.match(/\%/i) !== null ) return (x.match(/\./gi) !== null) ? parseFloat(x.toLowerCase().replace('%','')) : parseInt(x.toLowerCase().replace('%',''));
					if(x.match(/em/i) !== null ) return (x.match(/\./gi) !== null) ? parseFloat(x.toLowerCase().replace('em','')) : parseInt(x.toLowerCase().replace('em',''));
					return x;
				}
				else return x;
			},
			
			getCSSUnit : function(s){
				var x = s || this;
				if( x instanceof String ){
					if(x.match(/px/i) !== null) return x.match(/px/i)[0];
					if(x.match(/\%/i) !== null) return x.match(/\%/i)[0];
					if(x.match(/em/i) !== null) return x.match(/em/i)[0];
					else return undefined;
				}
				else return undefined;
			},
			
			/**
			* var ll = jx.util.fn.getLatLon()
			* ll.latitude, ll.longitude
			**/		
			getLatLon : function(){
				var c = {};
				if(navigator.geolocation) 
				navigator.geolocation.getCurrentPosition(
				    function(p){
				    	c.latitude = p.coords.latitude; 
				        c.longitude = p.coords.longitude;
				    }
				);
				return c;
			},

			
			/**
			* jx.$('#head').save()
			* jx.el('div').save('counter')
			* jx.el('div',{ id : 'counter' }).save()
			**/
			save : function(){
				var sid = arguments[0] || this.getAttribute('id');
				if(arguments[1] === undefined) jx.SYS.set(( sid || 'jx-var-' + (jx.SYS.length + 1) ),this);
				else jx.SYS.set(arguments[0],arguments[1]);
				return this;
			},
			
			transformable : function(o){
				var e = jx.el('span'),r, l = {
		            'WebkitTransform':'-webkit-transform',
		            'MozTransform':'-moz-transform',
		            'MSTransform':'-ms-transform',
		            'OTransform':'-o-transform',
		            'Transform':'transform'
	            }
	            e.appendTo('body');
	            for ( var t in l ){
	            	if( window.getComputedStyle(e)[t] ){
	            		if(o == '3d') e.style[t] = "translate3D(0,0,0)";
	            		else e.style[t] = "translate(0,0)";
	            		r = e.style[t];
	            	}
	            }
	            setTimeout(function(){
		            e.remove();
	            }, 100)
	            if( ( r === undefined ) || ( r.isEmpty() ) ) return false;
		        else return true;
			},
			
			/**
			**/
			getComputedStyle : function(el, o){
				this.el = el;
				this.getPropertyValue = function(prop) {
					var re = /(\-([a-z]){1})/g;
					if (prop == 'float') prop = 'styleFloat';
				    if (re.test(prop)){
						prop = prop.replace(re, function(){
				        	return arguments[2].toUpperCase();
				        });
				    }
				    return el.currentStyle[prop] ? el.currentStyle[prop] : null;
				}
				return this;
			}
			
		}
	}
	/**
	**/
		
	/**
	* jx.ui Object
	**/
	jx.ui = {
		
		/**
		* Subper View Object
		* jx.ui.El('div', { clss : 'out' }).appendTo('body');
		**/
		El : function(){
			var a = arguments;
			var el = {};
			var node = new String();
			var attributes = {}; 
			
			for( var i = 0 ; i < a.length ; i++ ){
				if(typeof a[i] === 'string') node = a[i];
				if(typeof a[i] === 'object') attributes = a[i];
				if(typeof a[i] === 'function'){
					var callback = a[i];
					el.on('load', callback);
				}
			}
				
			el = document.createElement(node);
			if( attributes !== undefined ){ 
				for(var i in attributes) {
					if( i === 'clss' ) el.setAttribute('class', attributes[i]);
					else el.setAttribute(i, attributes[i]);
				}
			}
			return el;		
		},
							
		/**
		* new jx.ui.Image({ src : 'http://www.tokeofthetown.com/2012/05/25/ob2.jpeg', width : '200px', height : '200px', parent : document.body, id : 'imagex', alt : 'hello' });
		**/
		Image : function(){
			var w,h,i,s,p,m,a = arguments[0] || {};
			w = a.width || 'auto';
			h = a.height || 'auto';
			s = a.src || null;
			p = jx.el('div', { clss : 'jx-img ' + (a.clss || ''), 'data-loaded' : false });
			if( typeof a.parent !== 'undefined' ) p.appendTo(a.parent);
			// create Image object
			var i = jx.el('img');
			i.setAttribute('alt', (a.alt || ''));
			// set id
			if( typeof a.id !== 'undefined' ) i.setAttribute( 'id', a.id );
			// load image
			if( s === null ){ throw "Can't load image. Attribute 'src' is missing."; return }
			setTimeout(function(){
				if( p.css({ width : w, height : h }).getAttribute('data-loaded') == 'false' ){
					i.css({ width : w, height : h }).src = s;
					p.wait();
					i.onload = function(){
						p.empty();
						i.appendTo(p);
						setTimeout(function(){
							//set as loaded
							p.setAttribute('data-loaded', true);
							//Map
							if( (typeof a.map !== 'undefined') && ( a.map !== '' ) ){
								m = jx.jsDom(a.map);
								m.addClass('map-w');
								p.appendChild(m);	
							}
						}, 0);
					}
					i.onerror = function(){
						p.empty();
						p.addClass('error');
					}
				}
			}, 0);
			return p;	
		},
		
		/**
		* var img = $.El('img',{ src : 'db/json/89/welcome.jpg', width : '200px' })
		* jx.$('body').tap(function(event){ .....
		* new jx.ui.Popup({ content : img }, e)
		* new jx.ui.Popup({ content : 'This is nice'}, e)
		* on touch devices must use .tap() to initiate.
		**/
		Popup : function(){
		
			var l, 
			a = arguments[0] || {},
			c = a.content || null,
			e = arguments[1] || null,
			p = jx.$('body'),
			w = jx.el('div', { clss : 'jx-popup' });
			
			show = function(w,x,y,p){
				
				w.css({ opacity : 0, position : 'absolute', 'z-index' : 10000 });
				setTimeout(function(){
					w.style.top = y + 'px';
					w.style.left = x - w.offsetWidth/2 + 'px';
				}, 0)
				if( x  > ( p.offsetWidth / 1.2 ) ){
					setTimeout(function(){
						w.style.left = 'auto';
						w.style.right = p.offsetWidth - x + 'px';
						w.style.top = y - w.offsetHeight/2 + 'px';
						w.addClass('rt');
					}, 0)
				}
				if( x  < ( p.offsetWidth / 4 ) ){
					setTimeout(function(){
						w.style.right = 'auto';
						w.style.left =  x + 'px';
						w.style.top = y - w.offsetHeight/2 + 'px';
						w.addClass('lt');
					}, 0)
				}
				if( y  < ( p.offsetHeight / 4 ) ){
					setTimeout(function(){
						w.style.top = y + 'px';
						w.addClass('tp');
					}, 0)
				}
				if( y  > ( p.offsetHeight / 1.5 ) ){
					setTimeout(function(){
						w.style.top = 'auto';
						w.style.bottom = p.offsetHeight - y + 'px';
						w.addClass('bt');
					}, 0)
				}
			}
			
			if( c !== null ){ 
				w.append(c);
				setTimeout(function(){ w.appendTo(p) }, 0);
				if( ( 'ontouchstart' in document ) && ( e !== null ) ) show( w,e.touches[0].pageX,e.touches[0].pageY,p );
				else show( w,e.clientX,e.clientY,p );
				w.init(function(e){
					if(e.stopPropagation) e.stopPropagation();
					else e.cancelBubble = true;
				})
			}
			
			setTimeout(function(){
				if( typeof a.id !== 'undefined' ) w.id = a.id;
				if( typeof a.clss !== 'undefined' ) w.addClass(a.clss);
				if( a.fullscreen === true ) w.css({ left : 0, right : 0, top : 0, bottom : 0 });
				w.fadeTo(1)
			}, 100);
			
			p.init(function(e){
				if(e.stopPropagation) e.stopPropagation();
				else e.cancelBubble = true;
				if(jx.$('.jx-popup').length !== 0){
					var px = jx.$('.jx-popup');
					px.empty().remove();
				}
			})
			
			return w
		},		
		
		/**
		* Added DOM Elements Methods
		**/
		fn : {
		
			html : function(){
				var a = arguments[0] || null, b = arguments[1] || null;
				if( a !== null ){
					if( ( b !== null ) && ( b === true )) this.innerHTML += a;
					else this.innerHTML = a;	
					return this;
				}
				else if( ( b !== null ) && ( b == true )){
					this.innerHtml += a;
					return this;
				}
				else return this.innerHTML;
			},
			
			txt : function(){
				var a = arguments[0] || null, b = arguments[1] || null;
				if( a !== null ){
					 if( ( b !== null ) && ( b === true )) this.innerHTML += a;
					 else{
						if(this.innerText !== undefined) this.innerText = a;
						else this.textContent = a;
					 }
					 return this;
				}
				else{
					if(this.innerText !== undefined ) this.innerText;
					else return this.textContent;
				}
			},
			
			appendTo : function(p){
				try{
					if(typeof p === 'object') p.appendChild(this);
					else jx.$(p).appendChild(this);
				}
				catch(e){}
				finally{
					return this;
				}
			},
			
			prependTo : function(p){
				try{
					if(typeof p === 'object') p.insertBefore(this, p.childNodes[0]);
					else jx.$(p).insertBefore(this, jx.$(p).childNodes[0]);
				}catch(e){}
				finally{
					return this;
				}
			},
			
			append : function(o){
				try{
					if( typeof o === 'string' ){
						if(this.innerText !== undefined) this.innerText += o;
						else this.textContent += o;
					}
					else this.appendChild(o);
				}catch(e){}
				finally{
					return this;
				}
			},
			
			prepend : function(o){
				try{
				if( typeof o === 'string' ){
					if(this.innerText !== undefined) this.innerText = o + this.innerText;
					else this.textContent = o + this.textContent;
				}
				else this.insertBefore(o, this.firstChild);
				}catch(e){}
				finally{
					return this;
				}
			},
			
			before : function(e){
				try{
				this.parentNode.insertBefore(e, this);
				}catch(e){}
				finally{
					return this;
				}
			},
			
			after : function(e){
				try{
				this.parentNode.insertBefore(e, this.nextSibling);
				}catch(e){}
				finally{
					return this;
				}
			},
			
			wrap : function(n,a){
				try{
				var e,t = this;
				e = jx.el(n, a);
				this.parentNode.insertBefore(e, this);
				setTimeout(function(){ t.appendTo(e); }, 0);
				}catch(e){}
				finally{
					return this;
				}
			},
	
			grandParent : function(){
				return this.parentNode.parentNode;
			},
			
			parent : function(){
				return this.parentNode;	
			},
			
			siblings : function(){
				return this.parentNode.childNodes;
			},
			
			previous : function(){
				return this.previousSibling !== undefined ? this.previousSibling : this;
			},
			
			next : function(){
				return this.nextSibling !== undefined ? this.nextSibling : this;
			},
			
			clone : function(){
				return this.cloneNode( arguments[0] === false ? false : true );
			},
			
			remove : function(){
				try{ this.parentNode.removeChild(this) }
				catch(e){}
			},
			
			find : function(q){
				return jx.$(q, this);
			},
			
			on : function(event, fn, bub){
				if( window.addEventListener  ) this.addEventListener( event, fn, bub !== undefined ? bub : false );
				else{
					this.attachEvent( 'on'+event, fn);
					// Handle custom events for IE8
					if( ( jx.BROWSER.match(/ie8/i) !== null ) && (event !== 'resize') ){
						this.attachEvent('onresize',function(e){
							if(e.event === event) fn(e.data);
						})
					}
				}
				return this;
			},
			
			off : function(event, fn, bub){
				if( window.removeEventListener  ) this.removeEventListener( event, fn, bub !== undefined ? bub : false );
				else{
					this.detachEvent( 'on'+event, fn);
				}
				return this;
			},
			
			/**
			* jx.el('div').trigger('click')
			**/
			trigger : function(evetName,eventData){
				jx.util.event.trigger(evetName, this,eventData);
				return this;
			},
			
			/**
			* One event for touch device and mobile device
			* jx.$('#button').init(function(e){...})
			**/
			init : function(fn){
				if(jx.hasTouch) this.on('tap',fn);
				else this.on('click', fn) 
			},
			
			hover : function(){
				var fns = arguments;
				this.on('mouseover', fns[0]);
				if( fns[1] !== undefined ){
					this.on('mouseout', fns[1]);
				}
				return this;
			},
			
			toggle : function(f1,f2){
				var t;
				if( this instanceof Element ) t = this;
				else t = jx.$('body');
				var x = function(){
					if( t.attr('data-jx-toggle') !== 'false' ){
						f1();
						t.attr('data-jx-toggle', 'false');
					}else{
						f2();
						t.attr('data-jx-toggle', 'true');
					}
				}();
			},
			
			hide : function(){
				this.fadeOut(1);
				return this;
			},
			
			show : function(){
				this.fadeIn(1);
				return this;
			},
			
			attr : function(){
				if( typeof arguments[1] !== 'undefined' ){
					this.setAttribute(arguments[0],arguments[1]);	
					return this;
				}
				else return this.getAttribute(arguments[0]);
			},
			
			addClass : function(a){
				var c = this.getAttribute('class') !== null ? this.getAttribute('class') : '';
				if( c.indexOf(a) <= -1 ){
					c += ' ' + a;
					this.setAttribute('class', c.encode());
				}
				return this;
			},
			
			removeClass : function(a){
				var c = this.getAttribute('class') !== null ? this.getAttribute('class') : '';
				if( c.indexOf(a) > -1 ){
					c = c.replace(a, '');
					this.setAttribute('class', c.encode());
				}
				return this;
			},
			
			replaceClass : function(a,b){
				var c = this.getAttribute('class') !== null ? this.getAttribute('class') : '';
				if( c.indexOf(a) > -1 ) this.removeClass(a).addClass(b);
				else this.addClass(b);
			},
			
			toggleClass : function(a){
				var c = this.getAttribute('class') !== null ? this.getAttribute('class') : '';
				if( c.indexOf(a) > -1 ) this.removeClass(a);
				else this.addClass(a);
				return this;
			},
			
			position : function(o){
				var t = o || this, cl = 0, ct = 0;
				if(t.css('position')){
					cl = t.css('left');
					ct = t.css('top');
				}
				return { left : cl, top : ct }
			},
			
			offset : function(o){
				var t = o || this, cl = 0, ct = 0;
				if (t.offsetParent){
					do{
						cl += t.offsetLeft;
						ct += t.offsetTop;
					}
					while (t = t.offsetParent);
				}
				return { left : cl, top : ct }
			},
			
			transformPosition : function(o){
				var t = o || this, cl = 0, ct = 0, transOffset = {};
				if( window.WebKitCSSMatrix === undefined ) return;
				transOffset = new WebKitCSSMatrix(window.getComputedStyle(t).webkitTransform);
				cl = t.offsetLeft + transOffset.m41 - (t.css('margin-left').getCSSInt() + t.css('margin-right').getCSSInt());
				ct = t.offsetTop + transOffset.m42 - (t.css('margin-top').getCSSInt() + t.css('margin-bottom').getCSSInt());			
				return { left : cl, top : ct }		
			},
			
			setCss : function(){
				var c,a = arguments[0]; c = new String();
				if(typeof a === 'object'){
					for( var i in a){
						c += i + ':' + a[i] + '; ';
					}
					this.style.cssText += c;
					return this;
				}
			},
			
			getCss : function(a){
				if(typeof a === 'string'){
					try{
						return getComputedStyle(this,null).getPropertyValue(a);
					}catch(e){
					}
				}
			},
			
			css : function(){
				if( typeof arguments[0] === 'string' ){ 
					return getComputedStyle(this,null).getPropertyValue(arguments[0]);
				}
				else {
					this.setCss(arguments[0]);	
					return this;
				}
			},
			
			/**
			* jx.el('h1').fx({ top : '300px', opacity : 1 }, 300)
			* 'fx' is fallback for 'cfx' for non HTML5/CSS3 browsers ( ex : ie8/ie9 )
			**/
			fx : function(o,s,e){
				
				var t = this;
				
				/* Aniamte Object starts. Inspired by the JS "Animate" Class by Dustin Diaz. */
				var Animate = function(el,prop,c,n,uu,s){
					this.el = el;
					this.prop = prop;
					this.from = c;
					this.to = n;
					this.time = s;
					this.unit = uu;
					this.animDiff = this.to - this.from;
				}
				
				Animate.prototype.css = function(val){
					switch(this.prop){
				  		case 'opacity' :
				    		this.el.style.opacity = val;
				    		this.el.style.filter = 'alpha(opacity=' + val * 100 + ')';
				    		break;
				    	default : 
				    		this.el.style[this.prop] = val + this.unit;
				    		break;
				    }
				}
				
				Animate.prototype.exe = function(){
					var that = this;
					this.now = new Date();
					this.diff = this.now - this.startTime;
					if (this.diff > this.time){
				    	this.css(this.to);
				    	t.trigger('transitionend');
				    	clearInterval(this.timer);
				    	return;
				    }
				    this.percentage = (Math.floor((this.diff / this.time) * 100) / 100);
				    this.val = (this.animDiff * this.percentage) + this.from;
				    this.css(this.val);
				};
				
				Animate.prototype.start = function(){
				  	var that = this;
				  	this.startTime = new Date();
				  	this.timer = setInterval(function(){
				    	that.exe.call(that);
				    }, 4);
				};
				/** Aniamte ends **/
				
				/* Get Props */	
				for( var i in o ){
					var s = s || 400;
					var uu = (o[i]).toString().getCSSUnit();
					var n = (i === 'opacity') ? (parseFloat(o[i])) : ((o[i]).toString().getCSSInt());
					var c = (i === 'opacity') ? (parseFloat(t.css(i))) : ((t.css(i)).toString().getCSSInt());
					if(( i === 'opacity') && (!t.css(i))) c = 1;
					if(typeof n === 'number') new Animate(t,i,c,n,uu,s).start()
					else{
						var x = {};
						x[i] = n;
						t.css(x)
					}				
				}
				return t;
			},
			
			/**
			* jx.el('h1').cfx({ top : '300px', opacity : 1 }, 300, 'ease-in-out', 'top left')
			**/
			cfx : function(o,s,e,l){
				
				var a,t = this; 
				// if IE9-- NO Hardware Accl.
				if(( !jx.hasTransform ) || ( jx.BROWSER.match(/ie8|ie9/i) !== null )){
					t.fx(o,s,e);
					return;
				}
				
				a = {};
				a['transform'] = 'translateZ(0)';
				a['-' + jx.BROWSERID +'-transform'] = 'translateZ(0)';
				a['-' + jx.BROWSERID +'-transition-duration'] = (s || 400)+'ms';
				a['-' + jx.BROWSERID +'-transition-timing-function'] = e;
				a['-' + jx.BROWSERID +'-transform-origin'] = (l || 'top left');
				t.css(a);
				
				var s1 = setTimeout(function(){
					t.css(o);
				}, 0);
				
				var s3 = setTimeout(function(){
					t.trigger('transitionend');
					clearTimeout(s1);
					setTimeout(function(){
						clearTimeout(s3);
					}, 0)
				}, (s || 400));
				
				return t;
			},
						
			/** 
			* el.fadeTo(.5,400,'ease-in-out',fn)
			**/
			fadeTo : function(v,s,e,f){
				var d,t = this,o = {};
				o['opacity'] = v;
				t.cfx(o,(s || 400),(e || 'easein'));
				if(f) t.on('transitionend',f);
				return this;
			},
			
			/**
			* el.fadeOut(300,fn)
			**/
			fadeOut : function(s,f){
				var t = this, s = s || 300, o = t.css('opacity');
				if( o === 0 ) return t;
				t.fadeTo(0,s);
				t.attr('data-display', t.css('display'));
				t.attr('data-opacity', t.css('opacity'));
				setTimeout(function(){
					t.css({ 'display' : 'none' });
				}, s+s/2)
				if(f) t.on('transitionend',f);
				return t;
			},
			
			/**
			* el.fadeIn(300,fn)
			**/
			fadeIn : function(s,f){
				var t = this, 
					s = s || 300, 
					dd = t.attr('data-display'), 
					oo = t.attr('data-opacity'),
					d = t.css('display'), 
					o = t.css('opacity'),
					v;
						
				if( ( o === 1 ) && ( t.css('display') !== 'none' ) ) return t;
				
				t.css({ opacity : ( o || 0 ), display : ( dd || 'block' ) });
				if(!oo) v = 1;
				else if( oo === o ) v = 1;
				else v = oo;
				
				setTimeout(function(){
					t.fadeTo(v,s);
				}, 0)
				
				if(f) t.on('transitionend',f);
				return t;
			},
			
			/**
			* el.fadeToggle(300)
			**/
			fadeToggle : function(s){
				var t = this;
				if( t.css('opacity') !== 0 ) t.toggle(function(){ t.fadeOut(s) },function(){ t.fadeIn(s) })
				else t.toggle(function(){ t.fadeIn(s) },function(){ t.fadeOut(s) })
				return t;
			},
			
			/**
			* el.moveTo('300px','100px',0,400,'ease-in-out',fn)
			**/
			moveTo : function(x,y,z,s,e,f){
				var o = {},d,t = this, s = s || 400;
				if( !jx.hasTransform ){
					o['margin-left'] = x;
					o['margin-top'] = y;
				}
				if( jx.hasTransform ){
					if( jx.hasTransform3D ){
						o['-' + jx.BROWSERID +'-transform'] = 'translate3d('+ (x || 0) +', '+ (y || 0) +', '+ (z || 0) +')';
						o['transform'] = 'translate3d('+ (x || 0) +', '+ (y || 0) +', '+ (z || 0) +')';
					}else{
						o['-' + jx.BROWSERID +'-transform'] = 'translateX('+ (x || 0) +') translateY('+ (y || 0) +') translateZ('+ (z || 0) +')';
						o['transform'] = 'translateX('+ (x || 0) +') translateY('+ (y || 0) +') translateZ('+ (z || 0) +')';
					}
				}
				t.cfx(o,s,(e || 'easein'));
				if(f) t.on('transitionend',f);
				return t;
			},
			
			/**
			* el.rotateTo('180deg',400,'ease-in-out','center center',fn);
			**/
			rotateTo : function(d,s,e,l,f){
				var d,t = this, o = {};
				o['transform'] = 'translateZ(0) rotate('+ (d || '0deg') +')';
				if( jx.BROWSER.match(/ie8|ie9/i) !== null ) o['-ms-transform'] = 'rotate('+ (d || '0deg') +')';
				else o['-' + jx.BROWSERID +'-transform'] = 'translateZ(0) rotate('+ (d || '0deg') +')';
				t.cfx(o,(s || 400),(e || 'easein'),l);
				if(f) t.on('transitionend',f);
				return t;
			},
			
			/**
			* el.scaleTo(.5,400,'ease-in-out','top left',fn)
			**/
			scaleTo : function(d,s,e,l,f){
				var d,t = this,o = {};
				o['transform'] = 'translateZ(0) scale('+ (d || 1) +')';
				if( jx.BROWSER.match(/ie8|ie9/i) !== null ) o['-ms-transform'] = 'scale('+ (d || 1) +')';
				else o['-' + jx.BROWSERID +'-transform'] = 'translateZ(0) scale('+ (d || 1) +')';
				t.cfx(o,(s || 400),(e || 'easein'),l);
				if(f) t.on('transitionend',f);
				return t;
			},
			
			/**
			* el.skewTo('180deg','20deg',400,'ease-in-out','top left',fn)
			**/
			skewTo : function(x,y,s,e,l,f){
				var d,t = this, o = {};
				o['transform'] = 'translateZ(0) skew('+ (x || 0) + ',' + (y || 0) + ')';
				if( jx.BROWSER.match(/ie8|ie9/i) !== null ) o['-ms-transform'] = 'skew('+ (x || 0) + ', ' + (y || 0) + ')';
				else o['-' + jx.BROWSERID +'-transform'] = 'translateZ(0) skew('+ (x || 0) + ', ' + (x || 0) + ')';
				t.cfx(o,(s || 400),(e ||'easein'),l);
				if(f) t.on('transitionend',f);
				return t;
			},
			
			/**
			* el.drag();
			* el.drag({ x : false })
			* el.drag({ y : false })
			**/
			drag : function(){
			
				var c = {},a,t = t || this; a = arguments[0] || {};
				
				t.addClass('jx-drag')
				if(jx.BROWSERID === 'msie') t.onselectstart = function(){ return false }
				else t.onmousedown = function(){ return false }
				
				// set window profile on drag
				t.lockwindow = function(e){
					if ( e.preventDefault ) e.preventDefault();
					else e.returnValue = false;
				}
				
				// get current position function
				t.currPos = function(){
					if( ( a.transform !== false ) && ( t.transformPosition() ) ){
						cx = t.transformPosition().left;
						cy = t.transformPosition().top;
					}else{
						cx = t.offsetLeft;
						cy = t.offsetTop;
					}
					return { left : cx, top : cy }
				}
				
				// Initialize drag function
				t.draginit = function(e){
        			
					t.bit = 0;
					t.init = true;
					t.cx = (e.pageX || e.clientX);
					t.cy = (e.pageY || e.clientY);
					
					if( ( a.transform !== false ) && (t.transformPosition()) ){
						t.offL = t.transformPosition().left;
						t.offT = t.transformPosition().top;
					}else{
						t.offL = t.offsetLeft;
						t.offT = t.offsetTop;
					}
					
					if(jx.hasTouch) window.on('touchstart',t.lockwindow)
					
					var c = {}
					if( jx.BROWSER.match(/ie8|ie9/i) === null ) c['-' + jx.BROWSERID +'-transition-duration'] = '0ms';
					t.css(c);
				}
				
				// On drag function
				t.dragstart = function(e){
					
					// event coordonates
					_x = (e.pageX || e.clientX);
					_y = (e.pageY || e.clientY);
						
					if( ( t.init === true ) || ( e.wheelDelta !== undefined ) ){
					
						t.lockwindow(e)
						
						t.xaxis = t.offL + _x - t.cx;
						t.yaxis = t.offT + _y - t.cy; 	
							
						// detect direction
						t.direction = t.direction || 'null';
						t.ccT = t.currPos().top;
						t.ccL = t.currPos().left;
						setTimeout(function(){
							if( t.ccT > t.currPos().top ) t.direction = 'up';
							if( t.ccT < t.currPos().top ) t.direction = 'down';
							if( t.ccL > t.currPos().left ) t.direction = 'left';
							if( t.ccL < t.currPos().left ) t.direction = 'right';
							t.trigger('drag', { dragX : t.currPos().left, dragY : t.currPos().top, direction : t.direction  });
						}, 0)
							
						t.replaceClass('dragged','dragging');
							
						try{
							var o = {};
							if( ( a.transform !== false ) && ( window.WebKitCSSMatrix !== undefined ) ){
								if( jx.hasTransform3D ){
								
									if(a.x === false){
										o['-' + jx.BROWSERID +'-transform'] = 'translate3d(0,'+ t.yaxis +'px, 0)';
										o['transform'] = 'translate3d(0,'+ t.yaxis +'px, 0)';
									}
									else if(a.y === false){
										o['-' + jx.BROWSERID +'-transform'] = 'translate3d('+ t.xaxis +'px, 0, 0)';
										o['transform'] = 'translate3d('+ t.xaxis +'px,0, 0)';
									}
									else {
										o['-' + jx.BROWSERID +'-transform'] = 'translate3d('+ t.xaxis +'px, '+ t.yaxis +'px, 0)';
										o['transform'] = 'translate3d('+ t.xaxis +'px, '+ t.yaxis +'px, 0)';	
									}	
								}else{
									
									if(a.x === false){
										o['-' + jx.BROWSERID +'-transform'] = 'translateX(0) translateY('+ t.yaxis +'px) translateZ(0)';
										o['transform'] = 'translateX(0) translateY('+ t.yaxis +'px) translateZ(0)';
									}
									else if(a.y === false) {
										o['-' + jx.BROWSERID +'-transform'] = 'translateX('+ t.xaxis +'px) translateY(0) translateZ(0)';
										o['transform'] = 'translateX('+ t.xaxis +'px) translateY(0) translateZ(0)';
									}
									else {
										o['-' + jx.BROWSERID +'-transform'] = 'translate3d('+ t.xaxis +'px, '+ t.yaxis +'px, 0)';
										o['transform'] = 'translate3d('+ t.xaxis +'px, '+ t.yaxis +'px, 0)';	
									}
								}	
							}else{
								if(jx.hasTransform) o['-' + jx.BROWSERID +'-transform'] = 'translateZ(0)';
								if(a.x !== false) t.style.marginLeft = t.xaxis + 'px';
								if(a.y !== false ) t.style.marginTop = t.yaxis + 'px';
							}
							t.css(o);	
							
						}catch(e){}
						t.ecx = _x;
						t.ecy = _y;
						t.bit++
					}
				}
				
				// drag end function
				t.dragend = function(){
					t.init = false;
					if(jx.hasTouch) window.off('touchstart',t.lockwindow)
					if(t.bit > 0){
						t.trigger('dragend',{ direction : t.direction });
						t.replaceClass('dragging','dragged');
					}else{
						t.trigger('movecancel')
					}
					if(jx.BROWSERID === 'msie') t.onselectstart = null;
					else t.onmousedown = null;
				}
				
				t.on('mousedown', t.draginit);
				window.on('mousemove',t.dragstart);
				window.on('mouseup', t.dragend);
				
				if(jx.hasTouch) t.on('touchstart', t.draginit);
				if(jx.hasTouch) t.on('touchmove',t.dragstart);
				if(jx.hasTouch) t.on('touchend', t.dragend);
				
				return t;
			},
			/**
			**/
			
			/**
			* el.scroll()
			* el.scroll({ snap : true, pager : true, label : true, id : 'scroll-x' })
			* el.scroll({ snap : false, vertical : true })
			**/
			scroll : function(a,o){
				
				var a = a || {};
					sc = o || this,
					view = jx.el('div',{ clss : 'jx-scroll' }),
					set = 0,
					index = 0;
				
				/* scroll methods */
				sc.setPager = function(){
					var pager = jx.el('ul',{ clss : 'jx-scroll-pager' });
					if(a.vertical === true ) set = Math.ceil(sc.height()/view.height())
					else set = Math.ceil(sc.width()/view.width());
					for(var i = 0; i < set ; i++){
						var x = i;
						var p = jx.el('li',{ clss : 'jx-scroll-pager-btn', 'data-index' : i }).on('click',function(e){
							var ii = jx.BROWSERID === 'moz' ? e.target.getAttribute('data-index') : e.srcElement.getAttribute('data-index');
							index = ii;
							if(a.vertical === true )sc.scrollTo(view.height()*ii);
							else  sc.scrollTo(view.width()*ii);
						}).appendTo(pager);
						if( a.label === true ) p.txt(i+1);
					}
					pager.appendTo(view);
					return sc;
				}
				
				/* scroll to function */
				sc.scrollTo = function(x,y){
					var x = x || 0, y = y || 0;
					sc.moveTo('-' + x + 'px','-' + y + 'px',0,200,'ease-out');
				}
				
				/* init */
				sc.before(view).appendTo(view);
				if( a.id !== undefined ) view.id = a.id;
				if( a.pager === true ) sc.setPager();
				if( a.vertical === true ) view.addClass('vertical');
				else view.addClass('horizontal');
				
				/* set scroll */
				if( a.snap === true ){
					if( a.vertical === true ){
						sc.drag({ x : false });
						sc.on('movedown', function(){
							if(index >= 1) index--;
							else index = 0;
							sc.scrollTo(0,view.height()*index);
						})
						.on('moveup', function(){
							set = Math.ceil(sc.height()/view.height());
							if(index+1 < set) index++;
							else index = set-1;
							sc.scrollTo(0,view.height()*index);
						})
					}else{
						sc.drag({ y : false });
						sc.on('moveright', function(){
							if(index >= 1) index--;
							else index = 0;
							sc.scrollTo(view.width()*index,0);
						})
						.on('moveleft', function(){
							set = Math.ceil(sc.width()/view.width());
							if(index+1 < set) index++;
							else index = set-1;
							sc.scrollTo(view.width()*index,0);
						})
					}
				}else{
					
					//If touch
					if(jx.hasTouch){
						view.addClass('touch-scroll');
						if(a.vertical === true ) view.css({ 'overflow-y' : 'scroll' });
						else view.css({ 'overflow-x' : 'scroll' });
						
					}else{
						
						//If scrollbar
						if( a.scrollbar === true ){
							
							var bb = jx.el('div', { clss : 'jx-scroll-bar fx' });
							var b = jx.el('div', { clss : 'jx-scroll-handle' });
							var o = {};
							b.appendTo(bb);
							bb.appendTo(view);
							
							setTimeout(function(){
								
								// detect ratio
								sc.ratio = function(){
									return (view.offsetHeight/sc.offsetHeight)*100;
								}
								// scroll function
								sc.dragTo = function(x,y){
									if(jx.hasTransform) o['-' + jx.BROWSERID +'-transform'] = 'translateZ(0)';
									o['margin-top'] = '-' +(y/(view.offsetHeight/sc.offsetHeight)) + 'px';
									o['margin-left'] = '-' +(x/(view.offsetWidth/sc.offsetWidth)) + 'px';
									sc.css(o);
								}
								sc.wheelTo = function(d){
									b.css({ 'margin-top' : (b.offsetTop ) + 'px' });
									if(jx.hasTransform) o['-' + jx.BROWSERID +'-transform'] = 'translateZ(0)';
									o['margin-top'] = sc.offsetTop + d*30 + 'px';
									sc.css(o);
								}
								
								// scrollbar show/hide
								if( sc.ratio() >= 99 ) bb.addClass('hide');
								else bb.removeClass('hide');
								// mousewheel control
								//sc.on('mousewheel',function(e){
								//	if ( e.preventDefault ) e.preventDefault();
								//	else e.returnValue = false;
								//	var d = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
								//	sc.wheelTo(d);
								//})
								//sc.on('DOMMouseScroll',function(e){
								//	e.preventDefault();
								//	var d = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
								//	sc.wheelTo(d);
								//})
								
								b.css({ height : (bb.offsetHeight * ((view.offsetHeight/sc.offsetHeight)*100))/100 + 'px' });
								b.drag({ x : false, transform : false });
								b.on('drag', function(e){
									if(e.direction == 'down'){
										if(b.offsetTop >= (bb.offsetHeight-b.offsetHeight)){
											sc.css({ 'margin-top' : ( view.offsetHeight - sc.offsetHeight ) + 'px' });
											b.css({ 'margin-top' : (bb.offsetHeight-b.offsetHeight) + 'px' });
										}else{
											sc.dragTo(0,e.dragY)
										}
									}
									if(e.direction == 'up'){
										if(b.offsetTop <= 0){
											sc.css({ 'margin-top' : 0 });
											b.css({ 'margin-top' : 0 + 'px' });
										}else{
											sc.dragTo(0,e.dragY)
										}
									}
								})
							}, 100)
						
						}
					}
				}
				return sc;
			},
			/**
			**/
			
			/**
			* el.wait()
			* el.wait({ x : '50%', y : '50%', z : 100 })
			**/
			wait : function(){
				var x,y,z,e,p,a = arguments[0] || {};
				p = this.addClass('waiting');
				if(this.find('.waiter').length !== 0 ) return;
				e = jx.el('div', { clss : 'waiter' }).appendTo(p);
				x = (a.x || ( p.width()/2 - e.width()/2)) + 'px';
				y = (a.y || ( p.height()/2 - e.height()/2)) + 'px';
				z = (a.z || 1000);
				setTimeout(function(){
					e.addClass('active'); 
					e.css({ top : y, left : x, 'z-index' : z });
				}, 0);
				return this;
			},
	
			clearWait : function(){
				var t = this.removeClass('waiting').find('.waiter');
				t.replaceClass('active','dismiss');
				setTimeout(function(){
					t.removeClass('dismiss').remove();
				}, 400);
				return this;
			},
			
			width : function(){
				return this.offsetWidth
			},
			
			height : function(){
				return this.offsetHeight
			}

		}

	}
	/**
	**/
	
	/**
	* Extend Method
	* FOR CLASSES:
	* var UX = function(n){ .... this.name = n  ... }
	* jx.extend(jx.ui.Form, UX)
	* addProperty(k,v), removeProperty(k)
	* var a = new UX()
	* FOR OBJECTS :
	* var FX = jx.extend(jx.util.Network)
	* FX.x = xxx
	* addProperty(k,v), removeProperty(k)
	**/
	jx.extend = function(o,x){	
	
		if( o instanceof Function ){
			var object = x;
			object.addProperty = function(k,v){
				object.prototype[k] = v;
			}
			object.removeProperty = function(k){
				delete object.prototype[k];
			}
			object.prototype = new o();
			object.prototype.uber = new o();
			object.prototype.constructor = object;
			return object;
		}
		else{
			var object = object || {};
			for( var x in o ){
				if (typeof o[x] === 'object') {
					object[x] = (o[x].constructor === Array) ? [] : {}; 
					extend(o[x]);
				} else {
					if( object.hasOwnProperty(x) === false ) object[x] = o[x];
				}
			}
			object.addProperty = function(k,v){
				object[k] = v;
			}
			object.removeProperty = function(k){
				delete object[k]
			}
			object.uber = o;
			return object;	
		}	
	}
	/**
	**/
			
	/**
	* Extending DOM Objects with jx methods
	**/
	var _extendDom = function(){	
		var domObjects = window.StaticNodeList === undefined ? [Element,HTMLCollection,NodeList] : [Element,HTMLCollection,NodeList,StaticNodeList];
		for( var i = 0 ; i < domObjects.length ; i++ ){
			for( var f in jx.ui.fn ){
				domObjects[i].prototype[f] = jx.ui.fn[f]
			}	
			var utilFns = [
			'contains',
			'each',
			'empty',
			'first',
			'isEmpty',
			'last',
			'reverse',
			'save'
			]
			for( var u = 0 ; u < utilFns.length ; u++ ){
				var f  = utilFns[u];
				domObjects[i].prototype[f] = jx.util.fn[f]
			}	
			domObjects[i].prototype.constructor = domObjects[i];
		}
	}()
	/**
	**/
	
	/**
	* Add "tap" event to Element on touch devices
	**/
	Element.prototype.tap = function(){
		
		if( !jx.hasTouch ) return;
		
		var st, 
		et = 0, 
		t = this, 
		e = null;
		
		var start = function(evt){
			st = new Date().getTime();
			t = (evt.target);
			e = evt;
		}
		var stop = function(){
			et = new Date().getTime() - st;
			if( et < 200 ) t.trigger('tap',e);		
		}
		
		t.addEventListener('touchstart', start);
		t.addEventListener('touchend', stop);
		
	}()
	/**
	**/
	
	/**
	* Add "taphold" event to Element on touch devices
	**/
	Element.prototype.taphold = function(){
		
		var t = this, 
		b = 0,
		c = 0,
		f = null;
		
		var start = function(evt){
			c = 1;
			t = (evt.target);
			f = setInterval(function(){ 
				b++;
				if( ( c === 1 ) && ( b === 2 ) ){
					t.trigger('taphold',evt);
					setTimeout(function(){
						clearInterval(f);
						b = 0;
					}, 0);
				}
			}, 1000);	
		}
		
		var stop = function(){
			clearInterval(f);
			c = 0;
			b = 0;
		}
		
		var cancel = function(){
			if( c === 1 ) stop();
		}
		
		if(jx.hasTouch){
			t.addEventListener('touchstart', start);
			t.addEventListener('touchmove', cancel);
			t.addEventListener('touchend', stop);
		}
		else{
			if( window.addEventListener ){
				t.addEventListener('mousedown', start);
				t.addEventListener('mousemove', cancel);
				t.addEventListener('mouseup', stop);
			}else{
				t.attachEvent('mousedown', start);
				t.attachEvent('mousemove', cancel);
				t.attachEvent('mouseup', stop);
			}
		}
			
	}()
	/**
	**/
	
	/**
	* Extending Array Object with jx methods
	**/
	var _extendArray = function(){
		var arrayFns = [
		'contains',
		'each',
		'empty',
		'first',
		'isEmpty',
		'last',
		'reverse',
		'save'
		]
		for( var i = 0 ; i < arrayFns.length ; i++ ){
			var f  = arrayFns[i];
			Array.prototype[f] = jx.util.fn[f];
		}
		Array.prototype.constructor = Array;
	}()
	/**
	**/
	
	/**
	* Extending String Object with jx methods
	**/
	var _extendString = function(){
		var stringFns = [
		'contains',
		'decode',
		'encode',
		'encodeJSON',
		'first',
		'getCSSInt',
		'getCSSUnit',
		'isEmail',
		'isEmpty',
		'isJSON',
		'isUSPhoneNumber',
		'last',
		'parseJSON',
		'reverse',
		'toTitleCase',
		'trim'
		]
		for( var i = 0 ; i < stringFns.length ; i++ ){
			var f  = stringFns[i];
			String.prototype[f] = jx.util.fn[f];
		}
		// Re-set Object's Constructor to Own Constructor;
		String.prototype.constructor = String;
		/**
		* Extending Number Object with jx methods
		**/
		Number.prototype.leadZero = jx.util.fn.leadZero;	
		Number.prototype.isInt = jx.util.fn.isInt;	
		// Re-set Object's Constructor to Own Constructor;
		Number.prototype.constructor = Number;	
	}()
		
	/**
	* initialize
	**/		
	var _initialize = function(){
		var r,i,w = window;
		i = function(){	
			/**
			* User Agent Detection
			**/
			document.body.className = jx.BROWSER + ' ' + jx.OS + ' ' + jx.DEVICE;
			jx.orientation();
			
			/**
			* URL Path detection
			**/
			w.on('popstate',jx.util.network.router.exe);
			
			/* ADDED SUPPORT FOR OLDER BROWSERS */
			/* StaticNodeList Support */
			StaticNodeList = NodeList;
			
			/* ... */
			if(window.getComputedStyle === undefined ) window.getComputedStyle = jx.util.fn.getComputedStyle;

			/* utility Methods castings */
			jx.hasTransform = function(){
				return jx.util.fn.transformable();
			}()
			jx.hasTransform3D = function(){
				return jx.util.fn.transformable('3d');
			}()
		}
		r = function(){
			jx.orientation();
		}
		if( w.addEventListener ){
			w.addEventListener("load", i, false);
			w.addEventListener("orientationchange", r, false);
			w.addEventListener("resize", r, false);
		}
		else{
			w.attachEvent("onload", i);
			w.attachEvent("orientationchange", r);
			w.attachEvent("onresize", r);
		}
	}()
	
	/**
	* Helper Objects
	**/
	jx.ROUTES = jx.ROUTES || new jx.util.Collection();
	jx.SYS = jx.SYS || new jx.util.Collection();
	/**
	* Helper Methods
	**/
	jx.el = jx.ui.El;
	jx.route = jx.util.network.router.add;
	
	/**
	* Attach jx object to window object.
	**/
	window.on = jx.ui.fn.on;
	window.off = jx.ui.fn.off;
	window.jx = window._ = jx;

}).call(this)
/**
**/