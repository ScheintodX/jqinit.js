"use strict";

var jQInit = jQInit || [];

/**
 * Loader module for jQInit
 *
 * This can be used to load modules and notify jQInit about them.
 *
 * It uses jQInit.register hook to register the newly loaded module.
 *
 * Usage: Loader.load( name, url )
 *     name: Name of the module
 *      url: Url to load from
 */
jQInit.push( [ 'Loader', function($){

	var Loader = {

		load: function( name, src ) {

			$.ajax( {
				url: src,
				dataType: 'script',
				cache: true
			} ).done( function( data, textStatus ){
				console.debug( "loaded", name, src, data );
				jQInit.register( name, data || {} );
			} )
			;

			return this;
		}
	};

	return Loader;

} ] );
