"use strict";

var jQInit = jQInit || [];

jQInit.push( [ 'myModule2', 'myModule1', function( $, mod1 ) {

	console.log( "mod2 on init" );

	mod1.say( "Hello from mod2" );

	$(function(){
		var $out = $('#out');
		$out.text( $out.text + "Module2 dom ready\n" );
	} );

} ] );
