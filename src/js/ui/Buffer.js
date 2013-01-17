	/**
	* jx JS 1.0.1
	* @Author: Teddy Moussignac
	* @website: http://www.teddyproductions.com
	* (c) Copyright 2012, All Rights Reserved.
	**/
	
	/**
	* properties : id = (string), clss = (string), string = (string), url = (string), fps = (int), timer = (int:millisecs).
	* methods : start,pause,stop,dimiss.
	* ex: var sb = new jx.strBuffer('This is nice....');
	* ex: var sb = new jx.strBuffer({ url : 'src/css/app.css' });
	* ex: var sb = new jx.strBuffer({ url : 'src/css/app.css',timer : 2000 });
	* ex: var sb = new jx.strBuffer({ string : 'src/css/app.css', fps : 2 });
	* ex: var sb = jx.buffer({ string : "Application ready... Je t'aime", stop : done });
	* ex: sb.start(), sb.pause(), sb.stop(), sb.dismiss().
	**/
	jx.ui.Buffer = function(){
		var b,s,u,e,t,i,l,f,cc,q,p,w,x,b = {};
		a = (arguments[0] || {});
		p = (a.parent || document.body);
		f = (a.fps || 20);
		l = (a.timer || null);
		e = (a.stop || null);
		u = (a.url || null);
		s = typeof a === 'string' ? a : a.string;
		w = jx.el('div', { id : (a.id || '' ), clss : 'cw-div ' + (a.clss || '') }).appendTo(p);
		cc = jx.el('pre', { clss : 'cc-div fx trans' }).appendTo(w);
		q = jx.el('span', { clss : 'vq'});
		x = function(o){
			o = o.toString();
			t = o[cc.innerText.length];
			if( w.height() >= p.height() ) w.addclss('mr');
			if(cc.innerText.length >= o.length){ w.stop(); return false; };
			cc.append(t);		
		}
		w.start = function(){
			if( w.find('.vq').length === 0 ) q.appendTo(w);
			w.removeClass('paused').replaceClass('stopped','started');
			i = window.setInterval(function(){
				if(u !== null){
					var req = jx.request({ url : u, callback : function(r){
						x(r);
					}});
				}
				else x(s);
			}, f);
			if(l !== null)setTimeout(b.pause, l);
			return w;
		}
		w.pause = function(){
			i = window.clearInterval(i);
			w.toggleclss('paused');
		}
		w.stop = function(){
			i = window.clearInterval(i);
			w.removeClass('paused').replaceClass('started','stopped');
			setTimeout(function(){
				if( typeof e === 'function' ) e();
			}, 0);
			return w;
		}
		w.dismiss = function(){
			w.removeClass('paused').addclss('dismiss');
			setTimeout(function(){w.remove()}, 400);
			return w;
		}
		return w;
	}
	
