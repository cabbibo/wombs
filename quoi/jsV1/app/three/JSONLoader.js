define(function(require, exports, module) {


  function JSONLoader( womb , params ){

    this.womb   = womb;

    this.loader = new THREE.JSONLoader(); 

    this.geometries = [];

  }


  JSONLoader.prototype.loadFile = function( file , callback ){

    this.womb.loader.addToLoadBar();

    this.loader.load( file , function( object , materials ){

      this.womb.loader.objectsLoaded ++;

      console.log( 'MATERIAL' );
      console.log( materials );
      console.log( object );
      var geometries = [];
      object.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {
          geometries.push( child.geometry);
        }
      
      });


      callback( geometries );

    });


  }


  module.exports = JSONLoader;

});
