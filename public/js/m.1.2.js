(function() {
	
	
	/*object
	 * Name:m
	 * include function:
	 * extend:继承函数，参数为(子类，父类)，子类内必须先执行  子类名.superClass.constructor.call(this,参数);
	 * Interface:接口类，参数为(接口名，接口所需含有的方法) 类方法ensureImplements用来检查对象是否满足接口;
	 * include：m.$()链式的扩展函数方法，参数为(方法名，方法);
	 * eventListener:添加注册事件方法，参数为(对象,事件名，方法);
	 * domready：dom树生成成功函数，参数为(函数);
	 * $：选择器函数，参数(标签名||.类名||#ID名) 参数(标签名||.类名||#ID名,标签名||.类名||#ID名)(获取参数二中的参数一对象);
	 * queue:队列函数，参数无，类方法：init()初始化重置，入队函数setQueue(入队元素或入队数组)，出队函数getQueue()；
	 */
	var m = {
		extend:function(subClass,superClass) {		//这样的继承方式可能优点性能上的问题
			var F = function() {};
			F.prototype = superClass.prototype;
			subClass.prototype = new F();		//查找原型的方法时多了一个对象
			subClass.prototype.constructor = subClass;
			subClass.superClass = superClass.prototype;
			if(superClass.prototype.constructor == Object.prototype.constructor) {
				superClass.prototype.constructor = superClass;	
			}
		},
		Interface:function(name,methods) {
			
			//Class's method
			if(window.m.Interface.ensureImplements == undefined) {
				window.m.Interface.ensureImplements = function() {	
					
				}
			}
			
			//Constructor
			if(arguments.length != 2) {
				throw new Error("Arguments");
			}
			this.name = name;
			this.methods = [];
			for(var i = 0,len = methods.length; i < len;i++) {
				
			}
		},
		include:function(name,method) {
			if(typeof(name)!=='string') {
				throw new Error("Method'name error");
			} else if(typeof(method)!=='function') {
				throw new Error("Method error");
			} else {
				eval("(" + "Ar.prototype." + name + " = " + method +")");
			}
		},
		eventListener:function(obj,fn,callback) {
			if(window.addEventListener) {
				m.eventListener = function(obj,fn,callback) { 
					obj.addEventListener(fn,callback,false); 
				}
			} else if (window.attachEvent) {
				m.eventListener = function(obj,fn,callback) {
					obj['__'+fn+callback] = callback;
					obj[fn+callback] = function() {
						obj['__'+fn+callback](window.event);
					}
					obj.attachEvent("on" + fn,obj[fn+callback]);
				}
			}
			m.eventListener(obj,fn,callback);
		},
		domready:(function() {
			var self = this;
			function __clear(timer){
			    clearTimeout(timer);
			    clearInterval(timer);
			    return null;
			};
			
			function __attach_event(evt, callback) {
			    if (window.addEventListener) {
			        window.addEventListener(evt, callback, false); 
			    } else if (window.attachEvent) {
			        window.attachEvent("on" + evt, callback);
			    }
			}
			
			function __domReady(f) {
			    if (__domReady.done) return f();
			    if (__domReady.timer) {
			        __domReady.ready.push(f);
			    } else {
			        __attach_event("load", __isDOMReady);
			        __domReady.ready = [f];
			        __domReady.timer = setInterval(__isDOMReady, 100);
			    }
			};
			
			function __isDOMReady() {
			    if (__domReady.done) return false;
			    if (document && document.getElementsByTagName && document.getElementById && document.body) {
			        __clear(__domReady.timer);
			        __domReady.timer = null;
			        if(typeof(__domReady.ready[0]) == 'function') {
				        for ( var i = 0; i < __domReady.ready.length; i++ ) {
				            __domReady.ready[i]();
				        }
				    }
			        __domReady.ready = null;
			        __domReady.done = true;
			    }
			};
			return __domReady;
		})(),
		$:function(a,b) {
			return new _$(a,b);
		},
		queue:(function() {
			var q=[];
			var frist=0;
			var tail=0;
			return {
				init:function() {
					q=[];
					frist=0;
					tail=0;
				},
				setQueue:function(a) {
					if(a.constructor == Array) {
						for(var i=0;i<a.length;i++) {
							x = a[i];
							q.push(x);
						}
						tail+=a.length;
					} else {
						q.push(a);
						tail++;
					}
				},
				getQueue:function() {
					if(frist == tail) {
						return false;
					} else {
						x = q[frist];
						q[frist] = null;
						frist++;
						return x;
					}
				}
			}
		})(),
		ajax:function(openMethod,openURL,callback,data) {
			Ajax.openandsend(openMethod,openURL,callback,data);
		}
	}
	//-----------------------------------------------------------------------------//

	
	//-------------------------以下是Ajax-------------------------------------------//
	var Ajax = {
		createXHRobject:function(){                     
			if(window.ActiveXObject){
				var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP']
				for(var i=0, count=versions.length; i<count; i++){
					try{
						this.createXHRobject = function() {
							return new ActiveXObject(versions[i]);
						}
						return new ActiveXObject(versions[i]);
					} catch(e) {
						continue;
					}
				}
			} else if(window.XMLHttpRequest) {
				try{
					this.createXHRobject = function() {
						return new XMLHttpRequest();
					}
					return new XMLHttpRequest();
				} catch(e) {
					throw new Error("create XHR object");
				}
		    } else {
		    	throw new Error('could not create an XHR object.')
		    }   
		},
		openandsend:function(option) {
			var openMethod = option.type.toUpperCase();
			var openURL = option.url; 
			var openAsync = option.async||true;
			var datatype = option.datatype;
			if(option.data) {
				var data = "";
				for(var i in option.data) {
					data += i+"="+option.data[i]+"&";
				}
				data = data.substring(0,data.length-1);
			}
			var datatype = "txt";
			var callback = {
				success:option.success,
				failure:option.failure||function(statusCode){ return 'XHR error , failure:' + statusCode }
			};
			if(!openMethod||!openURL||!callback.success) {
				throw new Error("Parameter are not complete");
			}
			var XHRobj = this.createXHRobject();
	        XHRobj.open(openMethod,openURL,openAsync);   //XMLHttpRequest已经准备好把一个请求发送到服务器。此时   readyStat=1 	          	
	        XHRobj.onreadystatechange =function(){              //回调函数
	     		if(XHRobj.readyState == 4){
	     			if(XHRobj.status == 200){         			             //响应(数据)已经被完全接收
	     				callback.success(XHRobj.responseText);         	//responseText包含着响应的文本内容          					       				
	     			} else {
						callback.failure(XHRobj.status);											/*return false;*/ 
					}
	     		}
	     	};
	     	if(option.datatype&&option.datatype.toLowerCase() == "json") {
	     		XHRobj.setRequestHeader("Content-Type", "application/Json");
	     	} else {
		    	XHRobj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		    }
			//XHRobj.setRequestHeader("Content-type", "application/json,charset=UTF-8");   //Response.ContentType = "text/xml"  Response.CharSet = "GB2312"
			if(openMethod != 'POST'){
				XHRobj.send();											
			} else {
				XHRobj.send(data);               // 已经通过send()方法把一个请求发送到服务器端，但是还没有收到一个响应。此时   readyStat=2
				};
			}
	}
	//-------------------------以下是Ajax-------------------------------------------//
	/*function
	 * Name:_getClassName
	 * parameter:name of class
	 * return:Array
	 */
	function _getClassName() {
		var elements = [];
		if(arguments.length < 2) {
			if( !!document.getElementsByClassName ) {
				return document.getElementsByClassName(arguments[0]);
			} else {
				var allElements = document.getElementsByTagName('*');
				for (var i=0; i< allElements.length; i++ ) {
					if (allElements[i].className.match(arguments[0]) ) {
						elements.push(allElements[i]);
					}
				}
			}
		} else {
			if(arguments[1].nodeType && arguments[1].nodeType == 1) {
				var a = new Array();
				a[0] = arguments[1];
			} else {
				var a = m.$(arguments[1]);
			}
			for(var j=0;j<a.length;j++) {
				var x = _gdvisite(a[j],'className',arguments[0]);
				for(var i=0;i<x.length;i++) {
					elements.push(x[i]);
				}
			}
		}
		return elements;
	};


	/*function
	 * Name:_getIdName
	 * parameter:name of id
	 * return:Array
	 */
	function _getIdName() {
		var elements = [];
		if(arguments.length < 2) {
			elements = [document.getElementById(arguments[0])];
		} else {
			if(arguments[1].nodeType && arguments[1].nodeType == 1) {
				var a = new Array();
				a[0] = arguments[1];
			} else {
				var a = m.$(arguments[1]);
			}
			var x = [];
			for(var j=0;j<a.length;j++) {
				var p = _gdvisite(a[j],'id',arguments[0]);
				for(var i=0;i<p.length;i++) {
					x.push(p[i]);
				}
			}
			elements[0] = x[0];
		}
		return elements;
	};
		
	//--------高级事件处理
	
	
	function _attachEvent(obj, evtType, fn) {
		var _type = '_' + evtType;
		if(obj[_type] == undefined) {
			obj[_type] = new Array();
		} else {
			for(fns in obj[_type]) {
				if(obj[_type][fns] == fn) {
					return false;
				}
			}
		}
		if(obj.attachEvent) {
			obj[_type].push(fn);
			obj['on' + evtType] = function() {
				for(var i in obj[_type]) {
					obj[_type][i].call(obj);	
				}
			}
		} else {
			obj.addEventListener(evtType, fn, false);
		}
	}

	function _detachEvent(obj, evtType, fn) {
		var _type = '_' + evtType;
		if(obj.detachEvent) {
			for(var i in obj[_type]) {
				if(obj[_type][i] == fn) {
					obj[_type].splice(i, 1);
					break;
				}
			}
			if(!obj[_type].length) {
				delete obj[_type];
				delete obj['on' + evtType];
			}
		} else {
			obj.removeEventListener(evtType, fn, false);
		}
	}
	
	
	//--------高级事件处理
	/*function
	 * Name:_getTagName
	 * parameter:name of tag
	 * return:Array
	 */
	function _getTagName() {
		var elements = [];
		if(arguments.length < 2) {
			var a = arguments[0];
			if(document.getElementsByTagName(a).length>0) {
				elements = document.getElementsByTagName(a);
			}
		} else {
			if(arguments[1].nodeType && arguments[1].nodeType == 1) {
				var a = new Array();
				a[0] = arguments[1];
			} else {
				var a = m.$(arguments[1]);
			}
			for(var j=0;j<a.length;j++) {
				var x = _gdvisite(a[j],'tagName',arguments[0].toUpperCase());
				for(var i=0;i<x.length;i++) {
					elements.push(x[i]);
				}
			}
		}
		return elements;
	};
	
	/*function
	 * Name:_gdvisite(广度优先节点算法)
	 * parameter:root(根节点)  feature(节点条件) name(符合的条件名)
	 * return array
	 */
	function _gdvisite(root,feature,name) {
		m.queue.init();
		var s = [];
		function a(b) {
			m.queue.setQueue(b);
			var mb = m.queue.getQueue();
			if(mb[feature]&&mb[feature].toString().match(name)) {
				s.push(mb);
			}
			if (mb.nodeName != "#text") {
				if(mb.childNodes.length>0) {
					for(var i=0;i<mb.childNodes.length;i++) {
						m.queue.setQueue(mb.childNodes[i]);
					}
				}
			}
			var ma = m.queue.getQueue();
			if(ma) {
				arguments.callee(ma);
			}
		}
		for(var i=0;i<root.childNodes.length;i++) {
			a(root.childNodes[i]);
		}
		m.queue.init();
		return s;
	}

	/*function
	 * Name:Ar(extend Array)
	 * parameter:none
	 * return Array
	 */
	if(navigator.userAgent.indexOf("IE") == -1) {
		var Ar = function(name) {
			Array.prototype.constructor.call(this,name);
			if(name.length>0) {
				for(var i=0;i<name.length;i++) {
					this.push(name[i]);
				}
			}
		};
		m.extend(Ar,Array);
	} else {
		var Ar = function(name) {
			this.length = 0;
			if(name.length>0) {
				for(var i=0;i<name.length;i++) {
					this[this.length] = name[i];
					this.length++;
				}
			}
		}
	}
	//Ar.prototype.length = 0;
	//Ar.prototype.push = Array.prototype.push;
	Ar.prototype.each = function(fn,arg) {
		return _each.call(this,fn,arg);
	}
	Ar.prototype.length = Array.prototype.length;
	Ar.prototype.css = function(name,value) {
			if(arguments.length == 1) {
				return _css.call(this,name);
			} else if(arguments.length == 2) {
				_css.call(this,name,value);
				return this;
			}
	}

	Ar.prototype.attr = function(name,value) {
		if(arguments.length == 1) {
			return _attr.call(this,name);
		} else {
			_attr.call(this,name,value);
			return this;
		}
	}
	Ar.prototype.addClass = function(cName) {
		this.each(_addClass,cName);
		return this;
	}
	Ar.prototype.removeClass = function(cName) {
		if(arguments.length > 1) {
			var rmClass = new RegExp('(\\s|^)'+cName+'(\\s|$)');
			this.each(_removeClass,cName,rmClass);
		} else {
			this.each(function() {
				this.removeAttribute('class');
			})
		}
		return this;
	}
	Ar.prototype.addListener = function(fn,callback) {
		for(var i=0;i<this.length;i++) {
			m.eventListener(this[i],fn,callback);
		}
		return this;
	}
	Ar.prototype.advEvent = function(type,evtType, fn) {
		if(type == 'add') {
			return this.each(function() {
				_attachEvent(this,evtType,fn);
			})
		} else if(type == 'del') {
			return this.each(function() {
				_detachEvent(this,evtType,fn);
			})
		}
	}
	Ar.prototype.postForm = function(callback) {
		callback.failure = callback.failure||function() {return "failure"};
		return this.each(_postForm,callback);
	}
	
	/*function
	 * Name:_postForm（链式）
	 * parameter:callback
	 * function:类ajax提交表单
	 * userage:submit=(this.parentNode.post=m.$('#form')[0].post;this.parentNode.post())
	 * return:null
	 */
	function _postForm(callback) {
			if(this.nodeType&&this.nodeType == 1) {
				if(this.tagName != "FORM") {
					throw new Error("element not form");
				}
			} else { 
				throw new Error("element not form");
			}
			this.post = function() {
				var iframe = document.createElement("iframe");
				iframe.id = "___hidden_iframe";
				iframe.name = "___hidden_iframe";
				iframe.style.display = "none";
				this.target = "___hidden_iframe";
				this.appendChild(iframe);
				this.submit();
				var self = this;
				var x = (function() {
					var i = 0;
					return function() {
						i++;
						if(m.$("#___hidden_iframe")[0].contentWindow&&m.$("#___hidden_iframe")[0].contentWindow.document&&m.$("#___hidden_iframe")[0].contentWindow.document.body.innerHTML) {
							clearTimeout(t);
							callback.success(m.$("#___hidden_iframe")[0].contentWindow.document.body.innerHTML);
							self.removeChild(self.childNodes.item(self.childNodes.length-1));
						}
						if(i>=10) {
							i = 0;
							clearTimeout(t);
							self.removeChild(self.childNodes.item(self.childNodes.length-1));
							callback.failure();
						}
					}
				})()
				var t = setInterval(x,500);
			}
	}
		
		
	/*fucntion
	 * Name:_each（链式）
	 * parameter:fn(function),arg(arguments)
	 * function:为链式中的每个元素执行fn函数，参数为arg
	 * return:链式
	 */
	function _each(fn,arg) {
		if(arguments.length < 1) {
			return this;
		} else if(typeof(fn) !== 'function') {
			throw new Error('frist argument not a function');
			return false;
		} else if(arguments.length == 1 ) {
			arg = undefined;
		} else if(arguments.length > 2) {
			throw new Error('argument expect only 2');
			return false;
		}
		for (var i = 0,len = this.length;i < len; i++) {
			fn.call(this[i],arg);
		}
		return this;
	};
	
	/*function(链式)
	 * Name:_addClass
	 * parameter:cName(string)
	 * function:cName参数为要添加的类的名称
	 */
	function _addClass(cName) {
		var addClass = new RegExp('(\\s|^)'+cName+'(\\s|$)');
		if(!addClass.test(this.className)) {
			var x = this.className.split(' ');
			this.className = '';
			for(var i=0;i<x.length;i++) {
				this.className += x[i];
				this.className += ' ';
			}
			this.className = this.className.substr(0,this.className.length -1 );
			if(this.className.length >1 ) {
				this.className += (' ' + cName);
			} else {
				this.className += cName;
			}
		}
	}
	/*function(链式)
	 * Name:_removeClass
	 * parameter:cName(string)
	 * function:cName为要删除的类名称
	 */
	function _removeClass(cName,rmClass) {
		if(rmClass.test(this.className)) {
			var x = this.className.split(' ');
			this.className = '';
			for(var i=0;i<x.length;i++) {
				if(x[i] == cName) {
					continue;
				}
				this.className += x[i];
				this.className += ' ';
			}
			this.className = this.className.substr(0,this.className.length -1 );
		}
	}
	/*function（链式）
	 * Name:_attr
	 * parameter:a(string),b(string)
	 * function:a参数为名称，若d参数存在则设置a的属性设置d，否则返回a参数的值
	 */
	function _attr(a,b) {
		if(arguments.length < 1) {
			return this;
		} else if(arguments.length > 2) {
			throw new Error('argument expect only 2');
			return false;
		} else if(arguments.length == 1 && typeof(a) !== 'string') {
			throw new Error('argument not a string');
			return false;	
		} else if(arguments.length == 2 && (typeof(a) !== 'string' || typeof(b) !== 'string')) {
			throw new Error('argument not a string');
			return false;	
		} else { 
			if(arguments.length == 2) {
				this.each(function(b) {
					this.setAttribute(b[0],b[1]);
				},[a,b]);
			} else {
				return this[0].getAttribute(a);
			}
		}
	} 	
	

	/*function（链式）
	 * Name:_css
	 * parameter:a(string),b(string)
	 * function:a参数为js中的css名称，若d参数存在则设置a的属性设置d，否则返回a参数的值
	 * 
	 */
	function _css(a,b) {
		if(arguments.length < 1) {
			return this;
		} else if(arguments.length > 2) {
			throw new Error('argument expect only 2');
			return false;
		} else if(arguments.length == 1 && typeof(a) !== 'string') {
			throw new Error('argument not a string');
			return false;	
		} else if(arguments.length == 2 && (typeof(a) !== 'string' || typeof(b) !== 'string')) {
			throw new Error('argument not a string');
			return false;	
		} else {
			if(arguments.length == 2) {
				
				this.each(function(b) {
					this.style[b[0]] = b[1];
				},[a,b]);
			} else {
				var x = this[0].style[a];
				if(x != undefined && x != '') {
					return x;
				} else {
					if(document.all){
						x = this[0].currentStyle[a];
					} else {
						x = document.defaultView.getComputedStyle(this[0],null)[a];
					}
					return x;
				}
			}
		}
		
	};

	
	/*function
	 * Name:_$()
	 * parameter:a(string[Array]),d(string)
	 * function:
	 * 		选择器：参数a为选择元素的Class、Id、tagname，若参数d存在，则选择d元素中的a元素;
	 * 		包装器：参数a（数组或者选择器选择的元素），参数d若为'push'则添加元素;
	 * return:array
	 */
	function _$(a,d) {
		var elements = [];
		var returnElement = {};
		switch(a.constructor) {
			case Array:
				if(d == undefined) {
					elements = a;
				} else if(d == 'push') {
					if(this == undefined) {
						elements = a;
					} else {
						for(var i=0;i<a.length;i++) {
							this.push(a[i]);
						}
						return this;
					}
				} else {
					throw new Error('not '+d+' function');
				}
			break;
			
			case Ar:
				if(d == undefined) {
					for(var i=0;i<a.length;i++) {
						elements.push(a[i]);
					}
				} else if(d == 'push') {
					if(thisstructor != Ar) {
						for(var i=0;i<a.length;i++) {
							elements.push(a[i]);
						}
					} else {
						var x = [];
						for(var i=0;i<a.length;i++) {
							x.push(a[i]);
						}
						for(var i=0;i<x.length;i++) {
							this.push(x[i]);
						}
						return this;
					}
				} else {
					throw new Error('not '+d+' function');
				}
			break;
			
			case String:
				var a = a.split(' '),e = [];
				if(a.length>1) {
					for(var i = 1;i<a.length;i++) {
						e.push(a[i]);
					}
					a = a[0];
				} else {
					a = a[0];
				}
				if(a==''||a=='.'||a=='#'||a==undefined) {
					return null;
				}
				var c = a.substr(0,1);
				var b = c.match('^[.#]');
				if(b!=null) {
					b=b[0];
				}
				switch(b) {
					case '#':
						a = a.substr(1,a.length-1);
						if(!d) {
							elements = _getIdName(a);
						} else {
							elements = _getIdName(a,d);
						}
					break;
				
					case '.':
						a = a.substr(1,a.length-1);
						if(!d) {
							elements = _getClassName(a);
						} else {
							elements = _getClassName(a,d);
						}
					break;
				
					default:
						if(!d) {
							elements = _getTagName(a);
						} else {
							elements = _getTagName(a,d);
						}
				}
				if(elements == [null]) {
					throw new Error('no exist!');
				}
			break;
			
			default:
				throw new Error('arguments error');
		}
		returnElement = new Ar(elements);
		if(e == undefined||e.length < 1) {
			return returnElement;
		} else {
			function foreach(fn,fl) {
				for(var j=0;j<returnElement.length;j++) {
					var x = _gdvisite(returnElement[j],fn,fl);
					for(var k=0;k<x.length;k++) {
						elements.push(x[k]);
					}
				}
			}
			for(var i=0;i<e.length;i++) {
				elements = [];
				var c = e[i].match('^[.#]');
				if(c !== null) {
					c = c[0];
				}
				switch(c) {
					case '.':
						a = e[i].substr(1,e[i].length-1);
						foreach('className',a);
					break;
					
					case '#':
						a = e[i].substr(1,e[i].length-1);
						foreach('id',a);
					break;
					
					default:
						a = e[i];
						foreach('tagName',a.toUpperCase());
				}
				returnElement = new Ar(elements);
			}
			return returnElement;
		}
	};

	window.m = window.m||m;
	
})();






