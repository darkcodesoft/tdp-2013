/**
* Teddy Productions 2013
* @Author: Teddy Moussignac
* @website: http://www.teddyproductions.com
* (c) Copyright 2013, All Rights Reserved.
**/

/**
* Init app & Resolve Conflit
**/
_.tp = _.tp || {}

/**
* Settings & Spotlight Fn
**/
_.tp.setSpotlight = function(){
	var sett = _.$('#sett-init'),
		spot = _.$('#spot-init'),
		pane = _.$('#spot'),
		wrap = _.$('#wrap'),
		scrn = _.$('#app-screen');
	
	var initPane = function(t){
		if( t.id === 'sett-init' ) pane.find('#spot-sett-panes').moveTo('-300px',0)
		else pane.find('#spot-sett-panes').moveTo(0,0)
	}		
	var initThis = function(){
		scrn.addClass('on');
		if( pane.attr('data-status') !== 'on' ){
			this.addClass('on');
			wrap.moveTo('-300px',0);
			pane.attr('data-status','on');
			pane.attr('data-pane',this.id);
			initPane(this)
		}else{
			if( pane.attr('data-pane') !== this.id ){
				_.$('.sett-init').each(function(i){ i.removeClass('on') });
				this.addClass('on');
				pane.attr('data-pane', this.id);
				initPane(this)
			}else{
				this.removeClass('on');
				wrap.moveTo(0,0);
				pane.attr('data-status','off');
				scrn.removeClass('on');
			}
		}
	}
	scrn.on('click',function(){
		_.$('.sett-init').each(function(i){ i.removeClass('on') });
		wrap.moveTo(0,0);
		pane.attr('data-status','off');
		scrn.removeClass('on');
	})
	sett.on('click',initThis);
	spot.on('click',initThis);
}

/**
* Panes Fns
**/
_.tp.setPanes = function(){
	var pwrap = _.$('#panes'),
		panes = _.$('#panes .pane'),
		paneW = _.$('body').width(),
		paneH = _.$('body').height(),
		index = -1,
		width = 0;
	pwrap.css({ width : paneW * panes.length + 'px' });
	panes.each(function(p){
		index++;
		width = paneW * index;
		p.css({ left : paneW * index + 'px', width : paneW + 'px', height : paneH + 'px'  });
	})
	window.on('resize', _.tp.setPanes);
	window.on('orientationchange', _.tp.setPanes);
	setTimeout(function(){
		if(pwrap.attr('data-state') !== 'active') pwrap.attr('data-state', 'active')	
	}, 0)
} 
_.tp.initPane = function(o){
	var id = o.replace('-btn','-p'),
		pwrap = _.$('#panes');
	setTimeout(function(){
		pwrap.moveTo('-' + _.$('#' + id).position().left,0);
		_.navigateTo('/'+id.replace('-p',''))
	}, 0)
}

/**
* Nav Fn
**/
_.tp.setNav = function(){
	var btns = _.$('#nav-list > li'),
		sele = _.$('#sel-disc-wrap'),
		bars = _.$('#inner-nav-bar'); 
	var initThis = function(){
		btns.each(function(i){ i.removeClass('on') });
		this.addClass('on');
		sele.moveTo(_.$('#nav-list > li.on').position().left,0);
		bars.moveTo(_.$('#nav-list > li.on').position().left,0);
		_.tp.initPane(this.id);
	}
	btns.each(function(b){
		b.on('click', initThis)
	})
}

/**
* Run app
**/
_.ready(function(){	
	//
	_.tp.setSpotlight();
	//
	_.tp.setNav();
	//
	_.tp.setPanes();
})
