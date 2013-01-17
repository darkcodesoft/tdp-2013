	/**
	* jx JS 1.0.1
	* @Author: Teddy Moussignac
	* @website: http://www.teddyproductions.com
	* (c) Copyright 2012, All Rights Reserved.
	**/
	
	/**
	* jx.DB
	* Local Storage System
	**/
	jx.DB = {
		/**
		* jx.DB.store('Data') // Store collection/table
		* jx.DB.store('Data', {}) // Store simple objects
		* jx.DB.store('play', 'yes') // Store simple variable
		**/
		store : function(){
			var a = arguments,
				o = jx.DB.get(a[0]);
			if( typeof window.localStorage === undefined ) return false ;
			if( a[1] === undefined ){
				if( o === false ) window.localStorage.setItem('jx-'+ (a[0] || null) +'-var', '[]')
				else{
					console.log('"' + a[0] + '" already exists.');
					return false;
				}
			}
			else{
				if(a[1] instanceof String) window.localStorage.setItem('jx-'+ (a[0] || null) +'-var', a[1]); 
				else window.localStorage.setItem('jx-'+ (a[0] || null) +'-var', JSON.stringify(a[1])); 
			}
			return true;
		},
		// jx.DB.get('Data')
		get : function(k){
			if( k instanceof Array === true ) return k;
			else{
				if( typeof window.localStorage === undefined ) return false ;
				var c = window.localStorage.getItem('jx-'+k+'-var');
				if( c )	return c.isJSON() ? c.parseJSON() : c;
				else return false;
			}
		},
		// jx.DB.remove('Data')
		remove : function(k){
			if( typeof window.localStorage === undefined ) return false ;
			var c,s = true;
			c = window.localStorage.removeItem('jx-'+k+'-var');
			if(typeof c === undefined) s = false;
			return s;
		},
		// jx.DB.reset()
		reset : function(){
			if( typeof window.localStorage === undefined ) return false ;
			var c = jx.DB.collection();
			c.each(function(i){
				window.localStorage.removeItem(i.key);
			});
		},
		// jx.DB.size()
		size : function(){
			return jx.DB.collection().length;
		},
		// jx.DB.collection() //returns jx.util.Collection
		collection : function(){
			if( typeof window.localStorage === undefined ) return false ;
			var n,k,c = new jx.util.Collection(); n = localStorage.length-1;
			for (var i = 0; i <= n; i++){
				k = localStorage.key(i);
				if( ( k.match(/jx-/) !== null ) && ( k.match(/-var/) != null ) ){
					c.add({ key : k,value : localStorage.getItem(k) });
				}
			}	
			return c;
		},
				
		query : {
			/**
			* jx.DB.query.select('*','People')
			* jx.DB.query.select('first','People')
			* jx.DB.query.select('first','People',{last : 'will'})
			**/
			select : function(q,n,w){
				var c = jx.DB.get(n);
				if(q === '*'){ 
					if( w === undefined ) return jx.DB.get(n);
					else{
						var r = new Array();
						for( var i = 0 ; i < c.length ; i++ ){
							for( var k in w ){
								if( (c[i][k]) === (w[k]) ) r.push(c[i]);
								break;
							}
						}
						return r;	
					}
				}
				else{
					if( w === undefined ) {
						var r = new Array();
						 jx.DB.get(n).each(function(i){
							r.push(i[q]);	 
						 });
						 return r;
					}else{
						var r = new Array();
						for( var i = 0 ; i < c.length ; i++ ){
							for( var k in w ){
								if( (c[i][k]) === (w[k]) ) r.push(c[i][q]);
								break;
							}
						}
						return r;	
					}
				}
			},
			// jx.DB.query.insert(p,'Data') // For Array Objects
			insert : function(o,c){
				var s = jx.DB.get(c);
				s.push(o);
				jx.DB.store(c,s);
				return s;
			},
			/**
			* jx.DB.query.update('People',{first : 'ted'}) // For Collections
			* jx.DB.query.update('People',{first : 'ted'},{last : 'will'}) // For Collections
			* jx.DB.query.update('config',{ offline2 : true, sex2 : true }) // For simple objects
			**/
			update : function(c,q,w){
				var r,t = jx.DB.get(c);
				if( t instanceof Array === false ){
					r = {};
					for( var x in q ){
						t[x] = q[x]
					}
					r = t;
					jx.DB.store(c,r);
					return r;
				}else{
					if( w === undefined ){
						r = new Array();
						for( var i = 0 ; i < t.length ; i++ ){
							for( var y in q ){ 
								t[i][y] = q[y];
							}
							r.push(t[i]);
						}
						jx.DB.store(c,r);
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
						jx.DB.store(c,r);
						return r;
					}
				}	
			},				
			/**
			* jx.DB.query.remove('last','Employees') // For Collections
			* jx.DB.query.remove('age','Employees',{first : 'teddy'}) // For Collections
			* jx.DB.query.remove('time','config') // For simple objects
			**/
			remove  : function(q,c,w){
				var r,t = jx.DB.get(c);
				if( t instanceof Array === false ){
					r = t;
					delete r[q]
					jx.DB.store(c,r);
					return r;
				}else{
					if(q === '*'){
						if( w !== undefined ){
							r = new Array();
							for( var i = 0 ; i < t.length ; i++ ){
								for( var y in w ){ 
									if( (t[i][y]) !== (w[y]) ) r.push(t[i]);
								}
							}
							jx.DB.store(c,r);
							return r;	
						}
						else{
							jx.DB.remove(c);
							return r;
						}
					}
					else{
						if( w === undefined ){
							r = new Array();
							for( var i = 0 ; i < t.length ; i++ ){
								delete (t[i][q]);
								r.push(t[i]);
							}
							jx.DB.store(c,r);
							return r;
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
							jx.DB.store(c,r);
							return r;
						}	
					}
				}
			}
		}
	}
	/**
	**/
