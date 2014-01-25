define(function(require, exports, module) {

  var m                   = require( 'app/utils/Math'                 );
  var AudioGeometry       = require( 'app/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'app/utils/AnalyzingFunctions'   );

  var Womb                = require( 'app/Womb'                       );

  var recursiveFunctions  = require( 'app/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );
  var shaderChunks        = require( 'app/shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'app/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );
  var physicsParticles    = require( 'app/shaders/physicsParticles'   );


  /*
   
     Create our womb

  */
  var link = 'http://soundcloud.com/holyother';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    modelLoader:      true,
    textCreator:      true,
    raycaster:        true,
    title:            'Holy Other - We Over',
    link:             link, 
    summary:          info,
    gui:              true,
    imageLoader:      true,
    stats:            true,
    color:            '#000000',
    failureVideo:84019684,
    size: 400
  });


  //womb.stream = womb.audioController.createUserAudio();
  womb.stream = womb.audioController.createStream( '../lib/audio/tracks/weOver.mp3' );
  //womb.audioController.gain.gain.value = 0;

  womb.ps = new PhysicsSimulator( womb , {

    textureWidth: 300,
    debug: true,
    velocityShader: physicsShaders.velocity.curl,
    velocityStartingRange:.0000,
    positionStartingRange:.000002,
    positionShader: physicsShaders.position,
    particles:      physicsParticles.basic,
    bounds: 400,
    speed: .1,
    particleParams:   {
        size: 5,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
        fog: true, 
        map: THREE.ImageUtils.loadTexture( '../lib/img/particles/lensFlare.png' ),
        opacity:    1.0,
        color: new THREE.Color(.0, .0 ,1.0 )
      }
   
    //audio: womb.stream
  });

  womb.ps.scene.rotation.z = Math.PI / 4;

  var p = womb.ps.particleSystem.clone();
  womb.scene.add( p );


  womb.stream.onStreamCreated =  function(){
  }

  womb.loader.loadBarAdd();
  
  womb.update = function(){


    //render();
    
  }

  womb.start = function(){

   /* for( var i = 0; i < systems.length; i++ ){

      systems[i].enter();
    }*/
    womb.ps.enter();
   // womb.stream.play();
  
  }

  womb.raycaster.onMeshHoveredOver = function(){

  }

  womb.raycaster.onMeshHoveredOut = function(){

  }
  

});
