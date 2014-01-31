define(function(require, exports, module) {

  var m                   = require( 'Utils/Math'                 );

  var Womb                = require( 'Womb/Womb'                  );

  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'Species/PhysicsSimulator'   );
  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var physicsParticles    = require( 'Shaders/physicsParticles'   );


  /*
   
     Create our womb

  */
  var link = 'http://theknife.net/';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    title:            'Audio Based FBO Curl Noise - The Knife',
    link:             link, 
    summary:          info,
    color:            '#000000',
    failureVideo:     84019684,
    size:             400
  });


  womb.stream = womb.audioController.createStream( '/lib/audio/tracks/readyToLose.mp3' );

  womb.ps = new PhysicsSimulator( womb , {

    textureWidth: 300,
    debug: true,
    velocityShader:           physicsShaders.velocity.curl,
    positionShader:           physicsShaders.positionAudio_4,
    
    particlesUniforms:        physicsParticles.uniforms.audio,
    particlesVertexShader:    physicsParticles.vertex.lookup,
    particlesFragmentShader:  physicsParticles.fragment.audio,
    
    bounds: 400,
    speed: .1,
   
    audio: womb.stream

  });
  

  womb.loader.loadBarAdd();

  
  womb.update = function(){

  }

  womb.start = function(){

    womb.stream.play();
 
    womb.ps.enter();
  }

 

});
