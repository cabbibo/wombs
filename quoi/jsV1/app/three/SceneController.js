define(function(require, exports, module) {

  var Scene = require( 'app/three/Scene' );


  function SceneController( world , params ){
    
    this.world = world;
    this.womb  = world.womb;

    this.scenes = [];

  }

  SceneController.prototype.createScene = function( params ){
    
    var scene = new Scene( this.world , params );
    this.scenes.push( scene );

    return scene; 

  }


  SceneController.prototype.updateScenes = function(){

    for( var i = 0; i < this.scenes.length; i++ ){

      var scene = this.scenes[i];
      
      if( scene.active ){

        scene.update();

      }

    }

  }

  SceneController.prototype._update = function(){

    this.updateScenes();
    this.update();

  }

  SceneController.prototype.update = function(){};

  module.exports = SceneController;

});
