/**
* Marie JS verison 1.0.1
* @Author: Teddy Moussignac
* @website: http://www.teddyproductions.com
* @Copyright 2012, All Rights Reserved.
**/

/**
* Marie.ui.ListView Ojbect
* Required : src/js/Marie.ui.ScrollView.js
* Ex : new Marie.ui.ListView({ label : 'Inserts', id : 'main_list', list : nodeList, exe : function(){ }, cancel : true, native : true });
* Ex : new Marie.ui.ListView({ label : 'Saved', id : 'history_pane', list : saved_cities, parent : $.body, cancel : true, exe : $.app.updateHistory, exe_label : 'Remove', sort : true });
* Ex : new Marie.ui.ListView({ label : 'Wonders', id : 'city_list', list : cities, parent : $.body, cancel : true, exe : confirmAct, exe_label : 'GET', exe_once : false, sort : true, native : false });
* Ex : new Marie.ui.ListView({ event : event, label : 'Top Cities', id : 'city_list', list : cities, parent : $.body, cancel : true });
**/
Marie.ui.ListView = Marie.ui.ListView || function( args ){
	
	var list = new Marie.El('div', { id : (args.id || ''), clss : 'mr_list' + ' ' + (args.class || '')});
	var head = new Marie.El('div', { clss : 'head' }).appendTo( list );
	var body = new Marie.El('div', { clss : 'body' }).appendTo( list );
	var edit_btn = new Marie.El( 'a', { href : '#', clss : 'btnx right edit' }).txt('Edit');
	var cancel_btn = new Marie.El( 'a', { href : '#', clss : 'btnx left cancel' }).txt('Close');
	var ul = new Marie.El( 'ul', { clss : 'list' }).appendTo( body );

	body.setCss({ 'max-height' : screen.height/1.5 + 'px' });
	list.setCss({ 'max-width' : screen.width + 'px' });
	ul.onclick = function(){
		ul.addClass( 'edit' );
		ul.childNodes.each(function(i){
			var edit = new Marie.El( 'a', { href : '#', clss : 'del_init fx' }).appendTo(i);
			var exe_btn = new Marie.El( 'a', { href : '#', clss : 'exe btnx fx' }).txt(args.exe_label || 'Edit');
			var edit_fn = function(){
				var that = this;
				this.toggle(
				function(){
					i.addClass('edit');
					that.addClass('active');
					exe_btn.appendTo(i); 
					setTimeout(function(){ exe_btn.addClass('active') }, 0); 
				},
				function(){
					i.removeClass('edit');
					that.removeClass('active');
					exe_btn.replaceClass('active', 'dismiss'); 
					setTimeout(function(){ exe_btn.remove() }, 300); 
				}
				);
			}
			if( 'ontouchstart' in document.documentElement ) edit.on('touchend', edit_fn);
			else edit.on('click', edit_fn);
			
			var exe_fn = function(e){
				e.stopPropagation();
				e.preventDefault();
				if( typeof args.exe == 'function'){
					var obj = i; 
					args.exe(obj);
					if(args.exe_once === true){
					obj.addClass('dismiss');
					setTimeout(function(){
						obj.remove();
					}, 100);
					}
				}
			}
			if( 'ontouchstart' in document.documentElement ) exe_btn.on('touchend', exe_fn);
			else exe_btn.on('click', exe_fn);
		});
	}
	ul.dismiss = function(){
		ul.removeClass( 'edit' );
		ul.childNodes.each(function(i){
			i.removeClass('edit');
			ul.find( '.del_init, .exe' ).each(function(u){
				u.remove();
			})
		});
	}
	var cancel_init = function(){
		list.addClass( 'dismiss' );
		setTimeout(function(){
			list.remove();
		}, 600);
	}
	var edit_init = function(e){
		e.stopPropagation();
		if( edit_btn.getText().toLowerCase() === 'edit' ){
			ul.init();
			edit_btn.txt( 'done' );	
		}else{
			edit_btn.txt( 'edit' );	
			ul.dismiss();
			for( var i = 0 ; i < ul.childNodes.length ; i++ ){
				ul.childNodes[i].removeClass('delete');
			}
		}
	}
	var delete_init = function(){
		this.addClass('active');
	}
	//head
	if( args.label !== undefined ){
		var label = new Marie.El( 'h3', { clss : 'label' }).txt( args.label ).appendTo( head );
	}
	if( args.exe !== undefined ){
		edit_btn.appendTo( head );
	}
	if( args.cancel === true ){
		cancel_btn.appendTo( head );
	}
	//body
	if(( args.sort !== undefined ) && (args.sort === true)){
		args.list.sort(function(a,b){
			var x,y;
			if( (typeof a !== 'string') && (typeof b !== 'string') ){
					x = a.textContent;
					y = b.textContent;
				}else{
					x = a;
					y = b;
			}
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	}
	args.list.each(function(i){
		var li = new Marie.El( 'li', { clss : 'fx' });
		if( typeof args.list === 'object' ) li.append(i);
		else i.appendTo( li );
		li.appendTo( ul );
	});
	//return
	edit_btn.on( 'click', edit_init );
	cancel_btn.on( 'click', cancel_init );
	//init
	setTimeout(function(){
	
		args.parent.appendChild(list);
		
		setTimeout(function(){
		if( typeof args.id !== undefined ) new Marie.ui.ScrollView({ id : args.id + '-scroll-wrap', parent : body, native : ( args.native === true ? true : false ) });
		}, 0);
		
		setTimeout(function(){ list.addClass('active') }, 0);
		if('ontouchstart' in document.documentElement) document.body.on('touchend', cancel_init, false);
		else document.body.on('click', cancel_init, false);
		
		if('ontouchmouve' in document.documentElement) list.on('touchmove', function(e){ e.stopPropagation() }, false);
		if('ontouchstart' in document.documentElement) list.on('touchend', function(e){ e.stopPropagation() }, false);
		else list.on('click', function(e){ e.stopPropagation() }, false);
		
		//SET X AND Y COORDONATES
		if( typeof args.event !== undefined )
		var event = args.event;
		/** MOBILE **/
		if( ( 'ontouchstart' in document.documentElement ) && ( typeof args.event !== 'undefined' ) ){
		list.setCss({ 
			top : event.touches[0].pageY + 40 + 'px',
			left : event.touches[0].pageX - list.w()/2 + 'px'
		});
		if( event.touches[0].pageX  > ( document.body.offsetWidth / 1.5 ) ){ 
			list.setCss({ 
				left : 'auto',
				right : document.body.offsetWidth - ( event.touches[0].pageX + list.w()/2 ) + 'px'
			});
		}
		if( event.touches[0].pageY  > ( document.body.offsetHeight / 1.5 ) ){
			list.setCss({ 
				top: 'auto',
				bottom : document.body.offsetHeight - ( event.touches[0].pageY - 40 ) + 'px'
			});
			list.addClass('align-bottom');
		}
		} else {
		if( typeof args.event === 'undefined' ) { throw 'Event object missing.'; return }
		list.setCss({ 
			top : args.event.pageY + 20 + 'px',
			left : event.pageX - list.w()/2 + 'px'
		});	
		if( event.pageX  > ( document.body.offsetWidth / 1.5 ) ){
			list.setCss({ 
				left : 'auto',
				right : document.body.offsetWidth - ( event.pageX + list.w()/2 ) + 'px'
			});
		}
		if( event.pageY  > ( document.body.offsetHeight / 1.5 ) ){
			list.setCss({ 
				top: 'auto',
				bottom : document.body.offsetHeight - ( event.pageY - 20 ) + 'px'
			});
			list.addClass('align-bottom');
		}
		}

		
	}, 0);
}
/**
* Marie JS verison 1.0.1
* @Author: Teddy Moussignac
* @website: http://www.teddyproductions.com
* @Copyright 2012, All Rights Reserved.
**/