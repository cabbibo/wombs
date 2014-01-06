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


  /*
   
     Create our womb

  */
  var link = 'http://robbietilton.com';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'LeapPaddleControls',
    modelLoader:      true,
    textCreator:      true,
    raycaster:        true,
    //title:            'Philip Glass - Knee 1 ( Nosaj Thing Remix )',
    //link:             link, 
    //summary:          info,
    gui:              true,
    imageLoader:      true,
    stats:            true,
    color:            '#000000',
    size: 400
  });


  womb.stream = womb.audioController.createUserAudio();

  womb.audioController.gain.gain.value = 0;
  womb.stream.onStreamCreated = function(){

    womb.ps.positionShader.uniforms.audioTexture.value = womb.stream.texture.texture;
    console.log('ass');

  }

  womb.ps = new PhysicsSimulator( womb , {

    textureWidth:70,
    velocityShader: physicsShaders.velocity.flocking,
    positionShader: physicsShaders.position
    
  });
  womb.scene.remove( womb.ps.particleSystem );
  
  womb.psClone = womb.ps.particleSystem.clone();
  womb.psClone.rotation.z = 0; 
  womb.scene.add( womb.psClone );


  womb.psCloneClone = womb.psClone.clone();
  womb.psCloneClone.rotation = new THREE.Quaternion();
  womb.psCloneClone.rotation.z = Math.PI ;
  womb.scene.add( womb.psCloneClone );





    womb.interface.addVector( womb.psClone , 'rotation' );

        //womb.

 // }

  //console.log( womb.psClone.material.uniforms );
  //womb.psClone.material.uniforms.psColor.value = new THREE.Color( 0xff0000 );
 // womb.scene.add( womb.psClone );

  //for( var i = 0; i < 
  womb.particleSystem = new THREE.ParticleSystem( 
      new THREE.CubeGeometry( womb.size , womb.size , womb.size , 100 , 100 , 100 ),
      new THREE.ParticleSystemMaterial 
  );
  //womb.scene.add( womb.particleSystem );

  //womb.interface.addVector( womb.particleSystem , 'rotation' );

  womb.particleSystem.scale.multiplyScalar( 1 );

  womb.interface.addAllUniforms( womb.ps.velocityShader.uniforms );


  womb.loader.loadBarAdd();
  
  womb.update = function(){

    womb.ps._update();

    //render();
    
  }

  womb.start = function(){

  }

  womb.raycaster.onMeshHoveredOver = function(){

  }

  womb.raycaster.onMeshHoveredOut = function(){

  }

  

});
