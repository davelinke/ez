// declare helper functions
$.extend($,{
	ez:{
		undef:function(obj){
			if (typeof(obj)=='undefined') return true;
			return false;
		},
		addPage:function(pageName,pageObj){
			var newObject = $.extend({
				hooks:{},
				render:null
			},pageObj);
			ez.pages[pageName] = newObject;
			// create hooks
			for (var hook in ez.pages[pageName].hooks){
				if (ez.pages[pageName].hooks[hook]) $(document).on('ez.pages.'+pageName+'.'+hook,ez.pages[pageName].hooks[hook]());
			}
		},
		setUpPage: function(args){
			return $.extend({
				render:function(){},
				asyncCb:false
			},args);
		},
		triggerHook:function(hook){
			l('triggering '+ hook +' hook');
			$(document).trigger(hook);
		},
		hashCompanion:function(){
			return ez.hashSymbol.replace('#','');
		},
		goTo:function(pageName){
			window.location.hash = $.ez.hashCompanion() + pageName;
		},
		cleanArray:function(actual){
			var newArray = [];
			for(var i = 0; i<actual.length; i++){
				if (actual[i]){
					newArray.push(actual[i]);
				}
			}
			return newArray;
		},
		getHash:function(){
			return self.location.hash.substring(ez.hashSymbol.length);
		},
		hashArray:function(){
			return $.ez.cleanArray($.ez.getHash().split(ez.hashArgsSeparator));
		},
		pageName:function(){
			return ($.ez.undef($.ez.hashArray()[0])?'':$.ez.hashArray()[0]);
		},
		hashChange:function(){
			var pageName = $.ez.pageName();
			var go = function(){
				$.ez.triggerHook('ez.goTo.before');
				$.ez.triggerHook('ez.pages.'+pageName+'.before');
				ez.topWrapper.one('transitionend',function(){
					l('transition to render ended');
					var tw = $(this);
					if(!$.ez.undef(ez.pages[pageName].render)) $.ez.renderPage(pageName);
				}).addClass(pageName);
			};
			l('hashchange on '+pageName);
			if ($.ez.undef(ez.pages[pageName])){
				console.log(ez.pages);
				if($.ez.undef(ez.pages.notFound)){
					$.ez.goTo(ez.defaultPage);
				} else {
					if (pageName===''){
						$.ez.goTo(ez.defaultPage);
					}else{
						ez.pages[pageName] = $.extend({},ez.pages.notFound);
						go();
						//$.ez.goTo('/notFound');
					}
				}
			} else {
				go();
			}
		},
		renderPage:function(pageName){
			l('renderpage: '+pageName);
			var
				rd = $.extend({
					synchronous:true,
					contentSource:'function',
					contentHtml:'',
					contentUrl:null,
					contentObject:{},
					contentFunction:function(){return'';},
					ajaxMethod:'GET',
					contentInsertion:{
						fn:'append',
						target:$('body')
					}
				},ez.pages[pageName].render),
				transFunc = function(){
					// why a settimeout? because life sucks, that's why
					setTimeout(function(){
						ez.topWrapper.one('transitionend',function(){
							$.ez.triggerHook('ez.pages.'+pageName+'.after');
							$.ez.triggerHook('ez.goTo.after');
						}).attr('class',pageName);
					},ez.timeoutMs);
				},
				asyncCallback = (rd.synchronous?function(){}:transFunc),
				renderVariants = function(){
					if (typeof(rd.contentSource)=='function'){
							rd.contentSource(asyncCallback);
					}else{
						switch(rd.contentSource){
							case 'ajax':
								$.ajax({
									method: rd.ajaxMethod,
									url: rd.contentUrl,
									success:function(data){
										rd.contentInsertion.target[rd.contentInsertion.fn](data);
										asyncCallback();
									}
								});
								break;
							case 'html':
								rd.contentInsertion.target[rd.contentInsertion.fn](rd.contentHtml);
								break;
						}
					}
				};

			renderVariants();
			if(rd.synchronous) transFunc();
		},
		init:function(args){
			ez = $.extend({
				topWrapper:$('body'),
				hooks:{},
				defaultPage:'/hello_world',
				timeoutMs:100,
				hashSymbol:'#!',
				hashArgsSeparator:'/', // the separator to use to detect arguments in the hash
				pages:{
					'hello_world':{
						render:{ //render is the function that renders the content
							synchronous:true, // if true, the transition callback gets fired immediately, otherwise it waits for your async function to end.
							contentSource:'html', // it can be simple ajax or a function
							contentHtml:'<h1>Hello World</h1>',
							contentInsertion:{
								fn:'html', // what jquery function do you want to use? append, html, before, after, etc.
								target:$('body') // element to target the insertion
							}
						}
					},
					notFound:{
						render:{ //render is the function that renders the content
							synchronous:true, // if true, the transition callback gets fired immediately, otherwise it waits for your async function to end.
							contentSource:'html', // it can be simple ajax or a function
							contentHtml:'<h1>Page Not Found</h1>',
							contentInsertion:{
								fn:'html', // what jquery function do you want to use? append, html, before, after, etc.
								target:$('body') // element to target the insertion
							}
						}
					}
				}
			},args);

			// init hooks (cause we need those right away)
			// general hooks
			for(var hook in ez.hooks){
				$(document).on(hook,ez.hooks[hook]);
			}
			// pages setup
			for(var page in ez.pages){
				//normalize decalred pages
				$.ez.addPage('page',ez.pages[page]);
			}

			// fire up hash detection
			$(self).on('hashchange',function(){
				$.ez.hashChange();
			});
			$(document).on('submit','form',function(){
				console.log('submitting form');
				$(this).ezForm();
			});

			// trigger before callback
			$.ez.triggerHook('ez.init.before');

			// respect the hash
			var hash = $.ez.getHash();
			if(hash!==''){
				$.ez.hashChange();
				$(document).one('ez.pages.'+hash+'.after',function(){
					// trigger after callback
					$.ez.triggerHook('ez.init.after');
				});
			} else {
				$.ez.goTo(ez.defaultPage);
				$(document).one('ez.pages.'+ez.defaultPage+'.after',function(){
					// trigger after callback
					$.ez.triggerHook('ez.init.after');
				});
			}
		}
	}
});
