		/**
		* jx JS 1.0.1
		* @Author: Teddy Moussignac
		* @website: http://www.teddyproductions.com
		* (c) Copyright 2012, All Rights Reserved.
		**/
		
		/**
		* jx.date.toString()// 
		* Returns String 20120321 *** yearmonthday
		**/
		jx.date = {
			/**
			* jx.date.getMonth("20120321")
			* jx.date.getMonth(jx.date.toString())
			**/	
			version: 1.0,
			getMonth : function(){
				var t,m,a = arguments[0] || null;
				m = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				if(a !== null){ 
					t = parseInt(a.substr(4,2)); 
					return m[t-1];
				}
				else return jx.date.getMonth(jx.date.toString());
			},
			// jx.date.getDay("20120321")
			getDay : function(){
				var e,a = arguments[0] || null;
				if(a !== null){
					var x,l,s,e,d = parseInt(a.substr(6,2));
					e = function(n){
						var e = 'th';
						if( ( n === 11 ) || ( n === 12 ) ) return e;
						s = parseInt(String(n).length);
						l = parseInt((String(n).length));
						x = parseInt(String(n).substr(l-1,1));
						switch(x){
							case 1 : e = 'st'; break;
							case 2 : e = 'nd'; break;
							case 3 : e = 'rd'; break;
						}
						return e;
					}
					return d + "" + e(d);
				}
				else return jx.date.getDay(jx.date.toString());
			},
			// jx.date.getYear("20120321")
			getYear : function(){
				var a = arguments[0] || null;
				if( a === null ) return jx.date.getYear(jx.date.toString());
				else return a.substr(0,4);
			},
			// jx.date.parse("20120321")
			parse : function(){
				var a = arguments[0] || null;
				return jx.date.getMonth(a) + " " + jx.date.getDay(a) + ", " + jx.date.getYear(a);
			},
			// jx.date.toString()			
			toString : function(){
				var t,d = new Date();
				t = d.getFullYear() + '' + (d.getMonth() + 1).leadZero() + '' + d.getDate().leadZero();
				return t;
			}
		}