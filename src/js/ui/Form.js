	/**
	* jx JS 1.0.1
	* @Author: Teddy Moussignac
	* @website: http://www.teddyproductions.com
	* (c) Copyright 2012, All Rights Reserved.
	**/
	
	/**
	* jx.ui.Form 1.0.1
	* var form = new jx.ui.Form({ id : 'form-1', action : '/src/php/Image.php', method : 'POST', success : greet(res){ ... }, error : fn(error){ ... } })
	* var form = new jx.ui.Form({ id : 'form-1', action : fn(data){ ... }, method : 'POST', success : greet(res){ ... }, error : fn(error){ ... } })
	* addInput,addSelect,addCheckbox,addButton
	* form.el.appendTo('body')
	* The request is encoded with String.prototype.encode = jx.encode
	* The response is decoded with String.prototype.decode = jx.decode
	* Form Events: submissionError, submissionSuccess
	* Input Events: validationError, validationSuccess
	* Form action can be a url of function ex ..., action : subFN, ....
	**/	
	jx.ui.Form = function(){
		
		var form = jx.el('form'); 
		var r,d,s,a = arguments[0] || {};
	
		/**
		* Form.addInput('tel',{ id : 'txt-1', clss : 'local', placeholder : 'Firstname', 'data-validate' : false, validateFn : fn, value : '' })
		* Input Events: validationError, validationSuccess
		**/
		form.addInput = function(t,o){
			var i = function(){
				var f,i,v,w,a,t = arguments[0]; a = arguments[1] || {};
				v = a['data-validate'] !== undefined ? a['data-validate'] : null;
				w = jx.el('div', { clss :  'jx-input' }).addClass(a.clss || '');
				if( a.label !== undefined ) w.append( jx.el('h4',{ clss : 'jx-input-label' }).txt(a.label.encode()));
				a.type = t.encode().toLowerCase();
				f = function(){
					if( v === false ){ 	
						if( a.validateFn !== undefined){
							a.validateFn(i.value);
							return
						}
						if( a.type === 'email'){
							if(i.value.isEmail()) i.trigger('validationSuccess'); 
							else i.trigger('validationError')
						}
						if( a.type === 'tel'){
							if( i.value.isUSPhoneNumber() ) i.trigger('validationSuccess')
							else i.trigger('validationError')
						}
						if(( a.type !== 'email') && ( a.type !== 'tel') ){
							if( i.value.encode().length > 0 ) i.trigger('validationSuccess')
							else i.trigger('validationError')
						}
					}
					
				}
				var onSuccess = function(){
					w.find('.jx-input-msg').remove();
					i.replaceClass('error','success');
					i.attr('data-validate', true);
					if( a.successMsg !== undefined ) i.after( jx.el('span',{ clss : 'jx-input-success jx-input-msg' }).txt(a.successMsg));
					return;
				}
				var onError = function(){
					w.find('.jx-input-msg').remove();
					i.replaceClass('success','error');
					i.attr('data-validate', false);
					if( a.errorMsg !== undefined ) i.after( jx.el('span',{ clss : 'jx-input-error jx-input-msg' }).txt(a.errorMsg));
					return;
				}
				
				i = jx.el(t === 'textarea' ? 'textarea' : 'input', a);
				i.removeAttribute('errorMsg');
				i.removeAttribute('successMsg');
				i.removeAttribute('validateFn');
				i.addClass(a.type.decode().toLowerCase() === 'submit' ? 'jx-btn' : 'text')
				.on('focus', f)
				.on('keyup', f)
				.on('validationError', onError)
				.on('validationSuccess', onSuccess)
				
				if( a.type === 'textarea' ) i.removeAttribute('type')
				if((a.type === 'color') || (a.type === 'date')) i.removeClass('text')
				i.appendTo(w);
				return w;
			}
	
			form.append(i(t,o));
			return this;
		}
		
		/**
		* form.addSelect({ label : 'Choose a city', name : 'hobbie', options : 'Manhattan=man&Brooklyn=bk&Queens=qns', selected : 'bk' })
		* Select Events: validationError, validationSuccess
		**/
		form.addSelect = function(o){
			var i = function(){
	
				var i,f,v,l,w,s,o,a = arguments[0] || {};
				
				o = a.options.split('&');
				w = jx.el('div', { id : (a.id || ''), clss : 'jx-select' + (a.clss || '') });
				q = jx.el('span', { clss : 'after' }).appendTo(w);
				l = jx.el('span', { clss : 'label' }).appendTo(w);
				i = jx.el('input',{ type : 'hidden', name : (a.name || ''), value : (a.value || '') })
					i.appendTo(w);
					if( a['data-validate'] !== undefined ) i.attr('data-validate', a['data-validate']);
				s = jx.el('select', {  name : (a.name+'-wrapper' || '') });
				f = function(){
					i.value = s.options[s.selectedIndex].value;
					var v = i.getAttribute('data-validate');
					if( v !== undefined ){
						if( a.validateFn !== undefined){
							a.validateFn();
							return
						}
						if( i.value.encode() === '' ){
							i.trigger('validationError');	
						}else{
							i.trigger('validationSuccess');	
						}
					}
				}
				var onSuccess = function(){
					w.replaceClass('error','success');
					i.attr('data-validate', true)
				}
				var onError = function(){
					w.replaceClass('success','error');
					i.attr('data-validate', false)
				}
				//if( v !== null ) i.attr('data-validate',v);
				s.on('change', f);
				i.on('validationError', onError);
				i.on('validationSuccess', onSuccess);
				s.appendTo(w);
				if( typeof a.label !== 'undefined' ) jx.el('option', { value : '' }).txt(a.label || '').appendTo(s);
				o.each(function(i){
					var o = i.split('=');
					jx.el('option', { value : o[1] }).txt(o[0]).appendTo(s);
				});
				if(typeof a.selected !== undefined){
					var o = w.find('option');
					o.each(function(i){
						if( i.value === a.selected ) { 
							i.setAttribute('selected','selected');
							if(i.innerText !== undefined ) l.txt(i.innerText);
							else l.txt(i.textContent);
						}
					});
					setTimeout(f, 0);
				}
				setTimeout(function(){
					if(l.innerText !== undefined) l.innerText = (s.options[s.selectedIndex].text);
					else l.textContent = (s.options[s.selectedIndex].text);
					s.value = s.options[s.selectedIndex].value;
					s.on('change', function(){ 
						if(l.innerText !== undefined) l.innerText = (s.options[s.selectedIndex].text);
						else l.textContent = (s.options[s.selectedIndex].text);
						s.value = s.options[s.selectedIndex].value;
					});
				}, 0);	
				return w;
			}
	
			form.append(i(o));
			return this;
		}
			
		/**
		* form.CheckBox({ label : 'Married', name : 'status', options : 'yes&no', selected : 'yes'  });
		**/
		form.addCheckBox = function(o){
			var i = function(){
				var t,o,w,p,l,i,u,y,n,a = arguments[0] || {};
				o = a.options.split('&');
				p = jx.el('div',{ clss : 'jx-input jx-checkbox-wrap' });
				w = jx.el('div', { id : (a.id || ''), clss : 'jx-checkbox' + (a.clss || '') }).appendTo(p);
				l = jx.el('span', { clss : 'label' }).txt(a.label || '').appendTo(w);
				i = jx.el('input', { type : 'hidden', name : (a.name || ''), value : 'false'});
					i.appendTo(w);
					if( a['data-validate'] !== undefined ) i.attr('data-validate', a['data-validate']);
				u = jx.el('ul', { clss : 'fx' }).appendTo(w);
				y = jx.el('li', { clss : 'on' }).txt(o[0]).appendTo(u);
				n = jx.el('li', { clss : 'off' }).txt(o[1]).appendTo(u);
				t = function(){
					if( i.value === 'false' ){
						w.replaceClass('off','on');
						i.value = 'true';
						w.value = 'true';
						i.trigger('validationSuccess')
					}else{
						w.replaceClass('on','off');
						i.value = 'false';
						w.value = 'false';
						i.trigger('validationError')
					}
				}
				var onSuccess = function(){
					w.find('.jx-input-msg').remove();
					w.replaceClass('error','success');
					i.attr('data-validate', true);
					if( a.successMsg !== undefined ) i.after( jx.el('span',{ clss : 'jx-input-success jx-input-msg' }).txt(a.successMsg));
					return;
				}
				var onError = function(){
					w.find('.jx-input-msg').remove();
					w.replaceClass('success','error');
					i.attr('data-validate', false);
					if( a.errorMsg !== undefined ) i.after( jx.el('span',{ clss : 'jx-input-error jx-input-msg' }).txt(a.errorMsg));
					return;
				}
				i.on('validationError', onError)
				i.on('validationSuccess', onSuccess)
				if( a.selected !== undefined ) t();
				w.on('click',t);
				return p;
			}
			form.append(i(o));
			return this;
		}
		
		/**
		* form.addButton({ label : '', id : '', clss : ''})
		* form.addButton({ type : 'submit', label : '', id : '', clss : ''})	
		**/		
		form.addButton = function(o){
			var i = function(){
				var b,l,a = arguments[0] || {};
				if((a.type.toLowerCase() === 'submit') || (a.type.toLowerCase() === 'cancel')){
				
					b = jx.el('button',{ 
						type : a.type, 
						clss : ( 'jx-btn ' +  (a.clss || '') ) , 
						id : ( a.id || ''), 
						name : ( a.name || '' ), 
						value : ( a.value || '' ) 
					}).txt(a.label || '');
										
				}else{
									
					b = jx.el('a', { 
						id : (a.id || '' ), 
						clss : ( 'jx-btn ' +  (a.clss || '') ), 
						href : (a.href || 'javascript://' ) 
					}).on('click', (a.exe || null));
					l = jx.el('span', { clss : 'label' }).txt(a.label || '' ).appendTo(b);
				}
				return b;
			}					
			form.append(i(o));
			return this;
		}
		
		/**
		* on submit
		**/		
		form.submit = function(e){
					
			if(e.preventDefault) e.preventDefault();
			else e.returnValue = false;
			form.wait();
			d = '';
			r = form.find('*[data-validate=false]');
			if( (r.length === undefined) || ( r.length > 0 ) ){
				if(r.length === undefined) r.trigger('validationError')
				if( r.length > 0 ){
					r.each(function(i){
						i.trigger('validationError')	
					})
				}
				form.clearWait();
				form.trigger('submissionError');
				return;
			}
			if(form.find('input').length > 0){
				var s = form.find('input');
				s.each(function(i){
					d += i.name + '=' + i.value + '&';
				})	
			}
			else if(form.find('input').length === undefined){
				var s = form.find('input');
				d += s.name + '=' + s.value + '&';
			}
			
			if(form.find('textarea').length > 0){
				var s = form.find('textarea');
				s.each(function(i){
					d += i.name + '=' + i.value + '&';
				})	
			}
			else if(form.find('textarea').length === undefined){
				var s = form.find('textarea');
				d += s.name + '=' + s.value + '&';
			}
			setTimeout(function(){
			
				var ss = function(){
					form.trigger('submissionSuccess');
					form.clearWait();
					var m = form.find('.jx-input-msg');
					if( m.length > 0 ){
						form.find('.jx-input-msg').each(function(i){
							i.remove();
						})	
					}
					else form.find('.jx-input-msg').remove();
					var sc = form.find('.success');
					if( sc.length > 0 ){
						form.find('.success').each(function(i){
							i.removeClass('success');
							i.removeClass('error');	
						})
					}
					else if(sc.length === undefined) sc.removeClass('success').removeClass('error');
				}
				if(typeof a.action === 'string'){
					jx.request({ url : a.action, method : a.method, params : d.encode(), callback : function(res){
						if(res.length > 0){
							if(a.success !== undefined) a.success(res.decode());
							ss()
						}else{
							if(a.error !== undefined) a.error(503);
							form.trigger('submissionError');
						}
					}})
				}else{
					var f,res = {};
					// serialize data
					f = function ($0, $1, $2, $3) { res[$1] = $3; }
			        d.replace(/([^?=&]+)(=([^&]*))/g,f);
					a.action(res);
					ss()
				}
				
			}, 0)
		}
		
		form.addClass('jx-form');
		form.on('submit', form.submit);
		form.id = a.id || '';
		// clear form
		if( a.success !== null ){
			form.success = a.success;
			form.removeAttribute('success')
		}
		if( a.error !== null ){ 
			form.error = a.error;
			form.removeAttribute('error')
		}
		
		/** load theme **/
		jx.include('src/css/Form.css');
		
		return form;
	}
