define(function(require, exports, module) {

  var Scene = require( 'app/three/Scene' );


  function SceneCreator( world , params ){

    this.world = world;
    this.womb  = world.womb;


    this.scenes = [];

  }

  SceneCreator.prototype.createScene = function( params ){

    var scene = new Scene( this.world , params );
    this.scenes.push( scene );


    return scene; 

  }


  module.exports = SceneCreator;

});
