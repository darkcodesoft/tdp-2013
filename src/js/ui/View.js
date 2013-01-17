	/**
	* jx JS 1.0.1
	* @Author: Teddy Moussignac
	* @website: http://www.teddyproductions.com
	* (c) Copyright 2012, All Rights Reserved.
	**/
	
	/**
	* View
	* var w = new jx.ui.View({ id : 'panelView', clss : '' })
	* var w = new jx.ui.View({ id : 'panelView', clss : '', vertical : true, pager : true, menu : false, label : true, time : 700, ease : 'ease-in-out' });
	* var w = new jx.ui.View({ id : 'panelView', clss : '', vertical : true, scroll : true });
	* w.addPane({ id : '', clss : '', title : '', label : '', index : '' })
	**/
	jx.ui.View = function(){	
			
		var pager,view,list,pane,panes,a = arguments[0];
		view = jx.el('div', { id : (a.id || ''), clss : 'jx-view ' + (a.clss || '') });
		list = jx.el('ul', { clss : 'jx-pane-wrap' });
		if(a.id !== undefined) list.addClass(a.id + '-jx-pane-wrap') 
		list.appendTo(view);
		
		/* Add pane */
		view.addPane = function(o){
			pane = jx.el('li', { id : (o.id || ''), clss : 'jx-pane ' + (o.clss || '')});
			if(o.title !== undefined) pane.attr('data-title', o.title);
			if(o.index === undefined){
				if( view.getPanes().length === undefined ) pane.attr('data-index',2);
				else if(view.getPanes().length === 0 ) pane.attr('data-index',1).addClass('on');
				else pane.attr('data-index', view.getPanes().length+1);
			}
			list.append(pane);
			setTimeout(view.refresh,0);
			if( (a.pager === true )  && ( a.scroll !== true ) ) setTimeout(view.initPager,0);
		}
			
		/* Panes */
		view.getPanes = function(){
			var panes = view.find('.jx-pane-wrap');
			if ( ( panes instanceof NodeList ) || ( panes instanceof StaticNodeList )  ) return panes[0].childNodes;
			else return panes.childNodes;
		}
			
		view.getActivePane = function(e){
			var o = {};
			if( list.find('.jx-pane.on').length === undefined ) o = list.find('.jx-pane.on');
			else o = list.find('.jx-pane.on')[0];
			return o;
		}
				
		/* Set pagination */
		view.initPager = function(){
			var pagie = jx.el('ul');
			setTimeout(function(){
				var panes = view.getPanes();
				panes.each(function(i){
					var p = jx.el('li',{ clss : 'jx-view-pager-btn' + ( i.attr('data-index') === '1' ? ' on' : '' ), 'data-index' : i.attr('data-index'), 'data-title' : i.attr('data-title') });
					p.txt( a.label === true ? i.attr('data-title') : i.attr('data-index'))
					
					//click function
					p.start = function(e){
						
						if(e.stopPropagation)e.stopPropagation();
						else e.cancelBubble = true;
						panes.each(function(x){
							x.removeClass('on');
						})
						pager.find('li').each(function(x){
							x.removeClass('on');
						})
						if(a.vertical !== true ) list.moveTo('-' + i.offsetLeft + 'px',0,0,(a.time || 400),(a.ease || 'ease-in-out'));
						else list.moveTo(0, '-' + i.offsetTop + 'px',0,(a.time || 400),(a.ease || 'ease-in-out'));
						i.addClass('on');
						p.addClass('on');
					}
					
					p.init(p.start)	
					p.appendTo(pagie);
				})
				if(a.menu !== false) pager.empty().append(pagie);
			}, 0);
		}
			
		/* Refresh panes */
		view.refresh = function(){
			panes = view.getPanes();
			if(panes.length !== undefined){
				list.find('.jx-pane').each(function(i){
					i.css({ width : view.offsetWidth + 'px', height : view.offsetHeight + 'px' })
				})
			}
			else panes.css({ width : view.offsetWidth + 'px', height : view.offsetHeight + 'px' })
			setTimeout(function(){
				if(a.vertical !== true ) list.css({ width : view.offsetWidth * view.find('.jx-pane').length + 'px', height : view.offsetHeight + 'px' });
			}, 0);
		}
		
		/* Stage */
		if(a.vertical === true ) view.addClass('vertical');
		else view.addClass('horizontal');
				
			pager = jx.el('div', { clss : 'jx-view-pager' });
			pager.appendTo(view);
			view.initPager();
			
			/* Move X View  */
			view.moveHorizontal = function(n){
				list.moveTo('-' + n.offsetLeft + 'px',0,0,200,'ease-out');
				setTimeout(function(){
					n.siblings().each(function(i){
						i.removeClass('on');	
					})
					n.addClass('on');
				}, 0)
			}
			
			/* Move Y View */		
			view.moveVertical = function(n){
				list.moveTo(0,'-' + n.offsetTop + 'px',0,200,'ease-out');
				setTimeout(function(){
					n.siblings().each(function(i){
						i.removeClass('on');	
					})
					n.addClass('on');
				}, 0)
			}
			
			if(a.vertical === true ) {
				
				if(jx.hasTouch) list.drag({ x : false });
				list.on('movedown',function(e){
					var o = view.getActivePane();
					if( o === list.childNodes[0]) list.moveTo(0,0,0,400,'ease-out')
					else view.moveVertical(o.previous());
				})
				.on('moveup',function(e){
					var o = view.getActivePane();
					if(o === e.target.childNodes[e.target.childNodes.length-1]) list.moveTo( '-' + list.childNodes[list.childNodes.length-1].offsetLeft + 'px',0,0,400,'ease-out')
					else view.moveVertical(o.next());
				})
				.on('movecancel',function(e){
					var o = view.getActivePane();
					view.moveVertical(o);
				})
			}else{
			
				view.addClass('horizontal');
				if(jx.hasTouch) list.drag({ y : false });
				list.on('moveright',function(e){
					var o = view.getActivePane();
					if( o === list.childNodes[0]) list.moveTo(0,0,0,400,'ease-out')
					else view.moveHorizontal(o.previous());
				})
				.on('moveleft',function(e){
					var o = view.getActivePane();
					if(o === list.childNodes[list.childNodes.length-1]) list.moveTo( '-' + list.childNodes[list.childNodes.length-1].offsetLeft + 'px',0,0,400,'ease-out')
					else view.moveHorizontal(o.next());
				})
				.on('movecancel',function(e){
					var o = view.getActivePane();
					view.moveHorizontal(o);
				})
			}
		
		setTimeout(view.refresh,0);
		window.on('resize', view.refresh);
		window.on('orientationchange', view.refresh);
		
		/** load theme **/
		jx.include('src/js/ui/View.css');
		
		return view;	
	}
	/**
	**/
