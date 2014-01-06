define(function(require, exports, module) {

  var THREE = require('lib/three.min');
  var l = require( 'lib/three/OBJLoader' );

  function ObjectLoader( womb , params ){

    this.womb   = womb;

    this.loader = new l(); 

    this.geometries = [];

  }


  ObjectLoader.prototype.loadFile = function( file , callback ){

    this.womb.loader.addToLoadBar();

    this.loader.load( file , function( object ){

      this.womb.loader.objectsLoaded ++;

      var geometries = [];
      object.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {
          geometries.push( child.geometry);
        }
      
      });


      callback( geometries );

    });


  }


  module.exports = ObjectLoader;

});
