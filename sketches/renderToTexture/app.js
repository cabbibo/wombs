define(function(require, exports, module) {

  var m                   = require( 'wombs/utils/Math'                 );
  var AudioGeometry       = require( 'wombs/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'wombs/utils/AnalyzingFunctions'   );

  var Womb                = require( 'wombs/Womb'                       );

  var recursiveFunctions  = require( 'wombs/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'wombs/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'wombs/shaders/vertexShaders'      );
  var physicsShaders      = require( 'wombs/shaders/physicsShaders'     );
  var shaderChunks        = require( 'wombs/shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'wombs/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'wombs/shaders/physicsShaders'     );
  var physicsParticles    = require( 'wombs/shaders/physicsParticles'   );


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
    positionShader: physicsShaders.positionAudio_4,
    particlesUniforms:        physicsParticles.uniforms.audio,
    particlesVertexShader:    physicsParticles.vertexShaders.audio,
    particlesFragmentShader:  physicsParticles.fragmentShaders.audio,
    bounds: 400,
    speed: .1,
   
    audio: womb.stream

  });
  console.log( womb.ps.velocityShader.uniforms );
  womb.interface.gui.add( womb.ps.velocityShader.uniforms.noiseSize , 'value' , 0 , .01 );
  womb.interface.gui.add( womb.ps.velocityShader.uniforms.potentialPower , 'value' , 0 , 10.0 );
  //womb.interface.addUniform( womb.ps.velocityShader.uniforms.noiseSize , 'VelocityShader' );
  womb.u = {

      texture:    { type: "t", value: womb.stream.texture.texture },
      image:      { type: "t", value: womb.stream.texture.texture },
      color:      { type: "v3", value: new THREE.Vector3( .3 , .01 , .1 ) },
      time:       womb.time,
      pow_noise:  { type: "f" , value: 0.2 },
      pow_audio:  { type: "f" , value: .3 },

    };

    var uniforms = THREE.UniformsUtils.merge( [
        THREE.ShaderLib['basic'].uniforms,
        womb.u,
    ]);

    uniforms.texture.value = womb.stream.texture.texture;
    uniforms.time=  womb.time  ;

    var mat = new THREE.ShaderMaterial({

      uniforms: uniforms,
      vertexShader: vertexShaders.passThrough,
      fragmentShader: fragmentShaders.audio.color.uv.absDiamond,
      blending: THREE.AdditiveBlending,
      transparent: true,
      side: THREE.BackSide,

    });
    var geo = new THREE.CubeGeometry( 3000 , 3000 , 3000 );
    var mesh = new THREE.Mesh( geo , mat );

   // womb.scene.add( mesh );


  womb.stream.onStreamCreated =  function(){
  }

  womb.loader.loadBarAdd();
  
  womb.update = function(){

    womb.ps._update();

    //render();
    
  }

  womb.start = function(){

    womb.stream.play();
  
  }

  womb.raycaster.onMeshHoveredOver = function(){

  }

  womb.raycaster.onMeshHoveredOut = function(){

  }
  

});
