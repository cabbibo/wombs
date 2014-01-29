define(function(require, exports, module) {

  var m                   = require( 'wombs/utils/Math'                 );
  var AudioGeometry       = require( 'wombs/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'wombs/utils/AnalyzingFunctions'   );

  var Womb                = require( 'wombs/Womb'                       );

  var recursiveFunctions  = require( 'wombs/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'wombs/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'wombs/shaders/vertexShaders'      );
  var shaderChunks        = require( 'wombs/shaders/shaderChunks'       );

  var VideoTexture        = require( 'wombs/three/VideoTexture'         );

  var physicsShaders      = require( 'wombs/shaders/physicsShaders'     );
  var PhysicsSimulator    = require( 'wombs/shaders/PhysicsSimulator'   );
  var physicsParticles    = require( 'wombs/shaders/physicsParticles'   );

  var helperFunctions     = require( 'wombs/utils/helperFunctions'      );
  
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

  womb.texture = new VideoTexture( womb , {

    file:'/lib/videos/demoReel.mp4'

  });

  //console.log( womb.texture );

  var light = new THREE.AmbientLight( 0xffffff );

  womb.scene.add( light );

  womb.u = {
    
    texture:    { type: "t", value: womb.texture},
    time:       womb.time,
    pow_noise:  { type: "f" , value: 0.01 },
    pow_audio:  { type: "f" , value: .04 },
  
  }
  womb.uniforms = THREE.UniformsUtils.merge( [
    THREE.ShaderLib['basic'].uniforms,
    womb.u,
  ]);



  womb.particleUniforms = THREE.UniformsUtils.clone( physicsParticles.uniforms.basic );
  womb.particleVertShader = physicsParticles.vertexShaders.lookup;
  womb.particleFragShader = physicsParticles.fragmentShaders.position;

  womb.particleParams =   {
    size: 25,
    sizeAttenuation: true,
    blending: THREE.NormalBlending,
    depthWrite: false,
    transparent: true,
    fog: true, 
    map: THREE.ImageUtils.loadTexture( '/lib/img/particles/lensFlare.png' ),
    opacity:    1.0,
  }

  womb.particleMaterial = new THREE.ShaderMaterial({

    uniforms:       womb.particleUniforms,
    vertexShader:   womb.particleVertShader,
    fragmentShader: womb.particleFragShader,

    color:          true,
    blending:       womb.particleParams.blending,
    transparent:    womb.particleParams.transparent,
    depthWrite:     womb.particleParams.depthWrite,
    fog:            womb.particleParams.fog,

  });

  womb.geometry = new THREE.PlaneGeometry( 1 , 1 , 100 , 100 );

  helperFunctions.setMaterialUniforms( womb.particleMaterial , womb.particleParams );

  womb.particleSystem = new THREE.ParticleSystem(
    womb.geometry,
    womb.particleMaterial
  );

  womb.particleSystem.scale.multiplyScalar( 100 );
  console.log( womb.particleSystem );

  womb.scene.add( womb.particleSystem );


  womb.material = new THREE.MeshLambertMaterial({
    map: womb.texture.texture
  });

  //var material = new THREE.MeshNormalMaterial();
  womb.geo = new THREE.CubeGeometry( 100 , 100 , 100 , 10 , 10 , 10 );

  womb.mesh = new THREE.Mesh( womb.geo , womb.material );

  womb.scene.add( womb.mesh );

/*
  womb.stream = womb.audioController.createStream( '../lib/audio/tracks/weOver.mp3' );


  womb.ps = new PhysicsSimulator( womb , {
   
    debug:false,
    audio: womb.stream,
    textureWidth: 300,
    positionShader:         physicsShaders.positionAudio_4,
    particlesUniforms:      physicsParticles.uniforms.audio,
    particlesVertexShader:  physicsParticles.vertex.audio,
    particlesFragmentShader:physicsParticles.fragment.audio,

    velocityStartingRange:.0000,
    startingPositionRange:[1 , .000002, 0 ],
    bounds: 100,
    speed: .1,
    particleParams:   {
        size: 25,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        fog: true, 
        map: THREE.ImageUtils.loadTexture( '../lib/img/particles/lensFlare.png' ),
        opacity:    1,
      }, 
  });
  //womb.ps.scene.position.z = -100;*/


  womb.loader.loadBarAdd();
 


  womb.update = function(){


    //womb.texture._update();
    //console.log('HOW');
    //womb.mesh.material.textureNeedsUpdate = true;
    //render();
    
  }

  womb.start = function(){

    womb.stream.play();
    console.log('CHECK' );
    womb.ps.enter();
  
  }

  womb.raycaster.onMeshHoveredOver = function(){

  }

  womb.raycaster.onMeshHoveredOut = function(){

  }
  

});
