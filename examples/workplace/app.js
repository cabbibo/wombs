define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                          );
  
  var UserMediaTexture    = require( 'Womb/Textures/UserMediaTexture'     );
  var physicsParticles    = require( 'Shaders/PhysicsParticles'           );
  var TextureParticles    = require( 'Species/Materials/TextureParticles' );
  var shaderChunks    = require( 'Shaders/ShaderChunks'               );

  var MeshEmitter     = require( 'Components/MeshEmitter' );
  var Mesh            = require( 'Components/Mesh' );
  
  /*
   Create our womb

  */
  
  var womb = new Womb({
    stats: true,
  });

  var being = womb.creator.createBeing();

 
  var mesh = new Mesh( being , {
    geometry: new THREE.CubeGeometry( womb.size / 20 , womb.size/20 , womb.size/20 ) 
    
  });

  mesh.add();

  var emitter = new MeshEmitter( mesh );

  womb.emitter = emitter;
  womb.scene.add( mesh );
  
  womb.loader.loadBarAdd();

  womb.update = function(){

    emitter.update();    
  
  }

  womb.start = function(){
    being.enter();
    emitter.begin();
  }


});
