"use strict";

var jQInit = jQInit || [];

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
