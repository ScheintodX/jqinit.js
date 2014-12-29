
Everything ASYNC
===============================================================================

 * jsinit.js allows 'async' loading of *every* script in your html header
 * It is pretty small (about 500 Byte minified)
 * It provides dependency checking and some basic dependency injection
 * Itself can be loaded asnc
 * It can be extended to do more
 * It's free as in tramp

***ALHA***
(just to be sure)

Try it out:
-------------------------------------------------------------------------------
In a new browser window open the console and go to: 

(https://rawgit.com/ScheintodX/jqinit.js/master/test.html)

Quickstart
-------------------------------------------------------------------------------

 1. download <a href="jqinit.js">jqinit.js</a> and put it somewhere (or reference it directly from rawgit.com to try it out. s. below)

 2. put it and all your modules in the html header like so: (order doesn't matter)

```
	<script async src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<script async src="//rawgit.com/ScheintodX/jqinit.js/master/jqinit.js"></script>
	<script async src="js/mymodule1.js"></script>
	<script async src="js/mymodule2.js"></script>
```

 3. build your modules like this:
	
```
	var jQInit = jQInit || [];

	jQInit.push( [ 'myModule1', function( $ ) {

		// do stuff including jQuery

	} ] );
```

 4. done. (really! Want to know more? read on)


"Just another JavaScript loader"?
-------------------------------------------------------------------------------

Quiet the opposite. There are numerous loaders for JavaScript. This one is different in that it doesn't load anything at all. Instead it lets the browser do all loading (something a browser is very good at) but manages the correct initialization of your modules. As a bonus you get some form of depencency injection. And of cause jqinit.js can be loaded asynchronously, too!

![Comic](https://rawgit.com/ScheintodX/jqinit.js/master/comic.svg)

I know that there are solutions out there which are in wide use. I have looked at many of them and they didn't see them fit my needs.

Some of the limitations I saw:
 * Doesn't support async
 * Need to put js code in every page
 * Way to big

jQuery is all about power in simplicity. So is this loader.

Html5 gave us these nice tiny extension to the `<script>` tag called `defer` and `async`. But you can't use it to load jQuery because every plugin to jQuery needs jQuery to be there in the first place. So no way to load jQuery *after* it's modules, isn't it?

Imagine:
 * Being able to load jQuery and dependent modules async in arbitrary order.
 * Having a well defined format for your own modules which can be loaded async
 * Being able to load modules when they are needed.
 * Don't have to care about order of initialization at all.
 * Don't have to put scripts in every html page (s. ready.js)
 * Using google's hosting for the jQuery core libs
 * Have a simple mechanism of dependency injection as a bonus.
 * Have a standard module format which encourages best practice and supports minification.
 * Having all modules accessible under one namespace
 * Doing all this in about 550 bytes (and that can still be optimized)
 * And the best: Have the "Loader" itself being loaded asynchronously.

So why did I put the word "Loader" in ampersands? Because what it does is rather the opposite of loading something. Indeed it lets all the loading do the browser which has very nifty methods of doing so. (Lookahead scanners and so on.)

What it does is simply making sure that everything which has been loaded is initialized and executed in the correct order. And all of this in just a few lines of javascript. So lets call that thing: "jQInit" for now.


So how does it look like?
-------------------------------------------------------------------------------

Simple: Put your stuff in the html header like you are used to, but add async:

	<script src="//google/jQuery" async></script>
	<script src="/js/jqinit.js" async></script>
	<script src="/js/module1.js async></script>
	<script src="/js/module2.js async></script>

Looks simple. But just to make a point, you can have written it this way, too:

	<script src="/js/module1.js async></script>
	<script src="/js/module2.js async></script>
	<script src="/js/jqinit.js" async></script>
	<script src="//google/jQuery" async></script>

or any other order you wanted. (Think about it. This is the very nature of async loading ...)

So how can a js module do this without being loaded itself? Sure there is a gotcha ... and well ... you have to do "something" of cause.

But rest assured this something are just a few bytes. So lets look at the module format:

You're of cause familiar with the simple module pattern:

	var MyModule = (function($){

		// do stuff here
		return {
			// put public stuff there
		}

	})(jQuery);

So let's extend this with dependencies and while where at it inject them as well:

	var MyModule = [ 'MyModule', 'MyOtherModule', function( MyOtherModule, $ ){

		// follow pattern

	} ];

So this defines a module with the name of 'MyModule' and an dependency on 'MyOtherModule' (and of cause jQuery, this is what this is all about). 

But there is no execution of this code right there, isn't it? We'll get there in a moment. What we first need is "something" to store that stuff into. So lets create an array for that, but only it its not already there:

	var jQInit = jQInit || [];

and put our module in:

	jQInit.push( [ 'MyModule', 'MyOtherModule', function( MyOtherModule, $ ){

		// follow pattern

	} ] );

*And that's it.* Yes right. There is nothing more you have to do in a module. This one can be loaded asynchronously.

So what is missing now? The magic of cause. This comes in when look at what jqinit.js does:

For starters jQInit itself follows normal module pattern (of cause it doesn't need to register itself):

jQInit.js:

	var jQInit = (function( _jQInit ) {

		// in case we are executed first
		_jQInit = _jQInit || [];

		// more stuff which is needed to work

		// do the magic:
		return {
			push: function( module ) {

				// Store in array
				_jQInit.push( module );

				initializeModulesIfDependenciesAreMet();
			}
		}

	} )( jQInit );

So it essentially swaps the array we used in the modules (remember: if it doesn't existed we simply created one) with its own structure and simulates the only array operation we need. So if this is executed before some of our modules are loaded the syntax to register them stays the same but now we can initialize them right away.


Limitations / Possible extensions:
-------------------------------------------------------------------------------

Currently this doesn't work for jQuery Modules like Mobile or UI. This is primary of cause because they don't follow the module syntax like it would be needed.
With some hackery it is still possible but with some limitations: There is a loader called jqinit.loader.js which uses jQuery to load them and is only a few bytes long. The main drawback is that the modules are loaded after jQuery is done loading. So no async here. Of cause this situation would improve greatly if jqinit would be integrated in jQuery and the modules would follow module semantics.

An addition to this and something I intend to look into further is a way of passing content loaded via ajax to the modules so that they can do initialization on it.

Some jQuery plugins (e.g. mobile) must be configured before they are loaded/executed. There should be a standard way for this kind of stuff. Currently one can use jqinit.loader.js to achieve this. But only async (see above).

One possible extension could be a simple way of loading modules while the application is already running. With the this mechanism it is already as simple as `$('head').append( '<script src="/js/somescript.js"></script>' )` but it would certainly be nicer to have a function for this like: `$.load( "/js/somescript.js" );` or so. But this is as easily implemented in a plugin. s. jqinit.loader.js

Something I haven't even begun to think about is "dependency-loading". So there is currently no external definition of dependencies on a per file-basis. I like it this way because it keeps things simple but one could think about having some module-definition like: `{ ModA: "/js/moda.js", ModB: ... }` and have jQInit load them on demand according to dependencies. This certainly makes only sense for modules which aren't loaded anyway. But it could provide useful for large apps. But I think this could be added easily as plugin if needed.


How do I do?
===============================================================================

What to put in my html5 page?
-------------------------------------------------------------------------------

Simple. Just put the jQuery, jqinit.js and your own modules in `<script>` tags in the header. This should look like:

	<script src="//google/jQuery" async></script>
	<script src="/js/jqinit.js" async></script>
	<script src="/js/module1.js async></script>
	<script src="/js/module2.js async></script>

It is a good idea to put jQuery first but it makes no big difference. The whole purpose of this lib is that it makes no difference.


How do I write a module?
-------------------------------------------------------------------------------

The simplest possible module would look like this:

mymodule.js:

	var jQInit = jQInit || [];

	jQInit.push( [ 'MyModule', function( $ ) {

		// code goes here
	}

But for your convenience I have although a basic pattern for you which shows a little more what you can do:

mymodule.js:

	"use strict";

	var jQInit = jQInit || [];

	jQInit.push( [ 'MyModule', function( $ ) {

		// private stuff here

		function init() {

			// this is called in $(document).ready()
		}

		var module = {

			// public stuff here

			//e.g.
			doPublicly: function(){

			}

		}

		$( init ); // register init via jQuery.ready

		return module;

	} ] );

of cause you could put `init` in `module` and make it public this way.

What about dependencies / dependency injection?
-------------------------------------------------------------------------------

One part of jQInit's work is to check dependenc in order to only execute modules which have all dependencies met.

So to tell jQInit what is needed just put your dependencies in like that:

	jQInit.push( [ 'MyModule', 'MyFirstDependency', 'MySecondDependency', function( $ ) { ...

and jQInit knows that these modules have to be initialized first.

If you not only want them to be initialized but also want to use them, just put them as arguments in the creator function
and their public methods will be available:

	jQInit.push( [ 'MyModule', 'First', 'Second', function( $, first, second ) {

		first.doSomething();

		second.doSomethingelse();
	}


How do I load jQueryUI / jQueryMobile etc.?
-------------------------------------------------------------------------------

This one is a bit tricky. Since they don't follow this pattern they can't be loaded asynchronously right away. This could improve if the jQuey people decided to put a loader like this directly in jQuery. For now you can use jqinit.loader.js` in that way:


loadlibs.js:

	"use strict";

	var jQInit = jQInit || [];

	jQInit.push( [ 'LoadLibs', 'Loader', function( $, Loader ){

		Loader.load( "JQuery.Mobile", "https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.3/jquery.mobile.min.js" )
		      .load( "JQuery.Validate", "//ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.js" )
		      ;

	} ] );


By the way: have a look at jqinit.loader.js code. There is not much to it. It itself is a jqinit module and you can just copy it and extend it if you need to.


And when I need jQueryUI / jQueryMobile for my Modules to work?
-------------------------------------------------------------------------------

Fear not. `jqinit.loder.js` to the rescue. As you can see in the code above every dependency you load gets a unique name. For the sake of this example we named them `JQuery.Mobile` and `JQuery.Validate` but you can name them whatever you want.

The only other thing you have to do is put them into your module as dependency like so:

	jQInit.push( [ 'MyModule', 'JQuery.Mobile', 'JQuery.Validate', function( $, first, second ) { ...


How do I access my Module / check if my module has been loaded?
-------------------------------------------------------------------------------

So know you have loaded your module and returned some structure from it. But how to access it anyway?

Normally you don't have to call it directly because you can use dependency injection for that. But if you insist:

jQInit keeps track of every module it has loaded and keeps them as key. Simply call for it this way:

	jQInit.MyModule.doStuff()

or via string:

	jQInit['MyModule'].meaning = 42;


to see if something is loaded just check it with:

	if( jQInit.MyModule ) { ... do something ... }


How do I do something after *everything* has loaded?
-------------------------------------------------------------------------------

The real question here is: When is everything loaded? The very nature of this library is to make sure the stuff which is loaded is executed in the correct order. And because everything is loaded asynchronously it has no means of knowing what there is to come. So if you decide while you are running your app that you need to load some more modules, you can do so and they will be integrated.

But feat not. There is a simple solution. When you say *everything* you normally have an idea what this everything is. So lets say you have 3 Modules: 

	First
		<- Second
		<- Third

where `Second` and `Third` depend on `First`.

Just throw in an fourth module like so:

	jQInit.push( [ 'Fourth', 'Second', 'Third' function( $ ){

		// This is executed after all three other modules have loaded
	}

You don't need to specify `First` because the dependency mechanism will do that for you.


How do I minify stuff / put it all together?
-------------------------------------------------------------------------------

That depends. Firstly the module format enables heavy minification because there are hardly global variables which need to keep their names. (And it is best practice to keep it that way. So put most of your code in the private area of a module.

Then just use your minification-tool of choise or any online minification service.

If you have written many modules and want to minify them you simply can concatenate them in one file and minify that. The order in which you do that is not important. Put jsinit.js in there, too. But you don't have to. Sometimes it is easier to find bugs if you have a file to point to. An sometimes (dependent on your setup) it is faster to have some more files which can be loaded in parallel.

There is a light redundancy if putting it all in one file: `"use strict"` and `var jQInit = jQInit || []` will be there multiple times. Normally gzip will take care of that and it will make no big difference. But if every byte counts you could put jqinit.js in first and remove all occurrences both of those snippets.


What is the state of this project?
-------------------------------------------------------------------------------

Currently I call it *PRE ALPHA* just because it is so new and I want to be able to change stuff without notice if I see the need to.
But it's not much code at all. So just copy it and patch it as you want.

There is room for improvement:

Firstly not very much has been done to reduce size. Currently readability matters more. But again: There is nothing here to stop you shrinking it.

Secondly: I'm not the best Javascript coder under the sun. So if you find something which can be written more clearly / faster / better / greater just do it and send me your patch. If it doesn't extend the scope I will gladly put it in. 


How do I notify jQInit that I have loaded another dependency which doesn't follow pattern?
-------------------------------------------------------------------------------

This is what `jqinit.loader.js` does. Remember: jqinit replaces the array you created in your modules with it's own structure where it defines a `push` function in order to be compatible with array.

In addition to that function it although defines a `register` function with this syntax: `register( name, module ). All that this does is remember the provided modules under the given name (as it would have done with push and the returned module from the creator function) and initialize modules which may depend on it.

This is exacly what `jqinit.loader.js` does: load a javascript file and register it's result under the name given.


And what is the image about?
-------------------------------------------------------------------------------

The image is my recreation of an panel from the famous graphic novel: "Asterix and the Goths" from René Goscinny and Albert Uderzo. Asterix and his friend Obelix accompany thier druid "Getafix" to the annual druid' conference where the druids present their best work. One of them manages to reduce soup to just a powder which is as he says easier to carry around than a cauldron. Hinted that he still needs a cauldron to recreate his soup he tells the amazed audience that he found a way to even reduce the cauldron to a powder.

This is meant as a reference to the "asynchronous loader" which is loaded asynchronously itself.

In the end the winner is of cause Getafix with his magic potion. So the powdered cauldron wasn't so ingenious after all.

I can't put the original image in here because of copyright laws which forbid citations if they are only for entertaining purposes -- at least by german laws. So I had to recreate it.
