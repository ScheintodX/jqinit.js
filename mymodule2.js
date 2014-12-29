"use strict";

var jQInit = jQInit || [];

jQInit.push( [ 'myModule2', 'myModule1', function( $, mod1 ) {

	console.log( "mod2 on init" );

	mod1.say( "Hello from mod2" );

	$(function(){
		console.log( "mod2 on dom ready" );
	} );

} ] );
