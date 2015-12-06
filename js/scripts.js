var ezArgs = {
	topWrapper:$('body'),
	hooks:{
		//'ez.init.before'
		//'ez.init.after'
		//'ez.goTo.before'
		//'ez.goTo.after'
	},
	defaultPage:'/main',
	hashSymbol:'#!', // it can be the hash only, but we set to hash bang as per google standards.
	hashArgsSeparator:'/', // the separator to use to detect arguments in the hash
	pages:{
		'main':{
			render:{ //render is the function that renders the content
				synchronous:false, // if true, the transition callback gets fired immediately, otherwise it waits for your async function to end.
				contentSource:'ajax', // it can be simple ajax or a function
				contentUrl:'templates/html/main.html', // the url of the content
				ajaxMethod:'GET', // the method of the content (defaults to get)
				contentInsertion:{
					fn:'html', // what jquery function do you want to use? append, html, before, after, etc.
					target:$('#outerWrapper') // element to target the insertion
				}
			},
			hooks:{
				before:function(){
					// do you want to execute something before your insertion happens?
				},
				after:function(){
					// do you want to execute something after your insertion happens?
				}
			},
		},
		'detail':{
			// if you make the function async (ajax for example) provide a callback to the function and fire it up once you believe it is a good time.
			render:{
				synchronous:true,
				contentSource:'html',
				contentHtml:'<div id="detail"><h1>This is the detail page</h1><p>The html is declared directly on the object. <br /><a href="#!/function-page">Go check the function page</a></p></div>',
				contentInsertion:{
					fn:'html', // your favourite jQuery append method
					target:$('#outerWrapper') // the target of your append
				}
			}
		},
		'function-page':{
			render:{
				synchronous:false,
				contentSource:function(asyncCallback){ // the asyncCallback paramenter is the final transitioning function
					var data = {
						items:[
							{
								'salutation':'hello',
								'target':'you'
							},
							{
								'salutation':'howdy',
								'target':'everyone'
							},
							{
								'salutation':'bye',
								'target':'all'
							}
						]
					};
					$.ajax({
						url : 'templates/handlebars/function-template.html',
						success : function (hbHtml) {
							var hbTemplate = Handlebars.compile(hbHtml);
							var html = hbTemplate(data);
							$('#outerWrapper').html(html);
							asyncCallback(); //remember to execute the callback so the transitioning completes.
						},
						dataType: "text",
						async : false
					});
				}
			}
		}
	}
};
var l = function(a){console.log(a);};
$(document).ready(function(){
	$.ajaxSetup({ cache: false });
	//init app
	$.ez.init(ezArgs);
	ezArgs = null;
});