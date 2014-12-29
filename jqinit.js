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
 */

// Like module pattern
var jQInit = (function( _jQInit ) {

	// In case this is the first lib loaded:
	_jQInit = _jQInit || [];

	var $, jQInit = { 

			// Push a new Module description
			push: function( description ) {
				_jQInit.push( description );
				onPush();
			},

			// Register an otherwise created module.
			// This is used for jqinit.loader.js to provide dependencies
			register: function( name, module ){
				jQInit[ name ] = module;
				onPush(); // Allow other modules to initialize
			}
		}
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

				//console.debug( ok, modDesc );

				if( ok ) done.push( modDesc );
				else waiting.push( modDesc );
			}
			_jQInit = waiting;
		}
	}

	// Called for every new module loaded and pushed
	function onPush() {
		if( $ ) createModules();
	}

	// Called once when jQuery is loaded
	function onJQuery() {
		$ = window.jQuery;
		createModules();
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
