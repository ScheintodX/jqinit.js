"use strict";

var jQInit = jQInit || [];

jQInit.push( [ 'myModule1', function( $ ) {

	console.log( "mod1 on init" );

	$(function(){

		console.log( "mod1 on dom ready" );

	} );

	var MyModule1 = {

		say: function( text ){
			console.log( "mod1 says '" + text + "'" );
			var $out = $('#out');
			$out.text( $out.text + "\n" + text );
		}
	}

	MyModule1.say( "Hello from mod1" );

	return MyModule1;

} ] );
