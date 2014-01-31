define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                  );
  
  var m                   = require( 'Utils/Math'                 );
  var recursiveFunctions  = require( 'Utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var physicsParticles    = require( 'Shaders/physicsParticles'   );
  
  var PhysicsSimulator    = require( 'Species/PhysicsSimulator'   );

  /*
   
     Create our womb

  */
  var link = 'http://soundcloud.com/holyother';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    title:            'Holy Other - We Over',
    link:             link, 
    summary:          info,
    color:            '#000000',
    failureVideo:     84019684,
    size:             400
  });


  womb.stream = womb.audioController.createStream( '/lib/audio/tracks/weOver.mp3' );

  womb.ps = new PhysicsSimulator( womb , {

    textureWidth: 300,
    debug: false,
    velocityShader: physicsShaders.velocity.curl,
    velocityStartingRange:.0000,
    startingPositionRange:[1 , .000002, 0 ],
    positionShader: physicsShaders.positionAudio_4,
    particlesUniforms:        physicsParticles.uniforms.audio,
    particlesVertexShader:    physicsParticles.vertex.audio,
    particlesFragmentShader:  physicsParticles.fragment.audio,

    bounds: 100,
    speed: .1,
    particleParams:   {
        size: 25,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        fog: true, 
        map: THREE.ImageUtils.loadTexture( '/lib/img/particles/lensFlare.png' ),
        opacity:    1,
      }, 
    audio: womb.stream

  });
  
  womb.u = {

    texture:    { type: "t", value: womb.stream.texture.texture },
    image:      { type: "t", value: womb.stream.texture.texture },
    color:      { type: "v3", value: new THREE.Vector3( .3 , .01 , .1 ) },
    time:       womb.time,
    pow_noise:  { type: "f" , value: 0.2 },
    pow_audio:  { type: "f" , value: .3 },

  };

 

  womb.loader.loadBarAdd();
  
  womb.start = function(){

    womb.stream.play();
    womb.ps.enter();

  }


});
