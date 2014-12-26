"use strict";

/**
 * Module for initializing jQuery plugins
 *
 * In the beginning jQInit is an array of the form:
 * [ [ 'Module' [, 'Dependency', ... ], creator ], ... ]
 *
 * this will be converted by init to:
 *
 * jQInit.Module = { object returned by creatorFunction }
 * ...
 *
 * This is an extended version which calls init($) on 
 * the modules loaded after $(document).ready()
 *
 * This is not really needed because you can just as well
 * put $(Module.init) in the module itself which does the
 * same with less code.
 */

// Like module pattern
var jQInit = (function( _jQInit ) {

	// In case this is the first lib loaded:
	_jQInit = _jQInit || [];

	var $, jQInit = { 
			push: function( arg ) {
				_jQInit.push( arg );
				onPush();
			},
	    ready
		;
	
	function createModule( modDesc ){

		// find name and creator
		var name = modDesc[ 0 ]; // first
		var creator = modDesc[ modDesc.length-1 ]; // last

		// collect dependencies
		var mods = []
		for( var i=1; i<modDesc.length-1; i++ ){
			var dep = jQInit[ modDesc[ i ] ];
			if( ! dep ) return false;
			mods.push( dep );
		}

		// jQuery is always first arg for creator
		mods.unshift( $ );

		// Call creator and store result in jQInit assoc.
		// An empty map is stored it nothing else is returned
		jQInit[ name ] = creator.apply( null, mods ) || {};

		Main.available.push( name );

		return true;
	}

	function createModules() {

		var waiting,
			done = _jQInit;

		// All modules in array
		while( done.length ){

			done = [],
			waiting = [];

			while( _jQInit.length ){

				var modDesc = _jQInit.shift();

				var ok = createModule( modDesc );

				console.debug( ok, modDesc );

				if( ok ) done.push( modDesc );
				else waiting.push( modDesc );
			}
			_jQInit = waiting;
		}
	}

	// Initialized modules but only if dom ready
	function initModules() {

		//console.debug( "---------- initModules -------------" );

		if( ready ){

			var $root = $('root');

			$.each( Main.available, function() {

				var Mod = Main[ this ];
			
				if( Mod.init && ! Mod._is_init ) {

					//console.debug( "Init: " + this );

					Mod.init.call( Mod, $root );
					Mod._is_init = true;
				}

			} );
		}
	}

	function onPush() {
		if( $ ) createModules();
		if( ready ) initModules();
	}

	// Called by document ready
	function onReady() {

		//console.debug( '===== READY =====' );

		ready = true;
		initModules();
	};

	function onJQuery() {
		$ = window.jQuery;
		createModules();

		$( document ).ready( onReady );
	}

	// Poll to see if jQuery is ready
	function waitForJQuery() {

		if( window.jQuery ){
			onJQuery();
		} else {
			setTimeout( waitForJQuery, 20 );
		}
	}

	waitForJQuery();

	return jQInit;

})( jQInit );
