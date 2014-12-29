"use strict";

var jQInit = jQInit || [];

jQInit.push( [ 'myModule1', function( $ ) {

	console.log( "mod1 on init" );

	$(function(){

		var $out = $('#out');
		$out.text( $out.text() + "Module1 dom ready\n" );

	} );

	var MyModule1 = {

		say: function( text ){
			console.log( "mod1 says '" + text + "'" );
		}
	}

	MyModule1.say( "Hello from mod1" );

	return MyModule1;

} ] );
