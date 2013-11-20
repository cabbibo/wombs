define(function(require, exports, module) {

  var l = require( 'lib/three/OBJLoader' );

  function ObjectLoader( world , params ){

    this.world  = world;
    this.womb   = world.womb;

    this.loader = new THREE.OBJLoader(); 

    this.geometries = [];

  }


  ObjectLoader.prototype.loadFile = function( file , callback ){

    this.womb.loader.objectsToLoad ++;

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
