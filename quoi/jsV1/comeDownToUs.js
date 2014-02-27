define(function(require, exports, module) {

  var m                   = require( 'app/utils/Math'                 );
  var AudioGeometry       = require( 'app/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'app/utils/AnalyzingFunctions'   );

  var ShaderMaterial      = require( 'app/utils/ShaderMaterial'       );

  var Womb                = require( 'app/Womb'                       );
  

  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );
  var shaderChunks        = require( 'app/shaders/shaderChunks'      );

 

  // TODO: Fix momentum fly controls
  womb = new Womb({
    cameraController: 'LeapSpringControls',
    objLoader:        true,
    massController:   true,
    springController: true,
    test:             true,
    title:            'A Tooth For An Eye - The Knife',
    info:             'Drag to spin, press x to hide'
    //effectComposer:   true
  });
  
  womb.scene = womb.world.scene;
  
  womb.stream = womb.audioController.createStream( '../lib/audio/readyToLose.mp3' );

  womb.uniforms = {
    texture: { type: "t", value: womb.stream.texture.texture },
    color:{ type: "v3" , value: new THREE.Vector3( 2.0 , 0.5 , 0.2 ) },
    time:{ type: "f" , value: 0 },
    pow_noise:{ type: "f" , value: 1.0 },
    pow_audio:{ type: "f" , value: 2.0 }
  };

  womb.material = new THREE.ShaderMaterial( {

    uniforms: womb.uniforms,
    vertexShader: vertexShaders.audio.noise.position,
    //vertexShader: vertexShaders.passThrough,
    fragmentShader: fragmentShaders.audio.color.position.absDiamond,
    //side: THREE.DoubleSide,
    blending:THREE.AdditiveBlending,
    transparent:true

  });

  var s = womb.world.size / 10;
  var geo = new THREE.CubeGeometry( s , s , s , 30 , 30 , 30 );

  var numOf = 1;
  for( var i = 0; i < numOf; i++ ){
    
    var cube = new THREE.Mesh(
      geo,
      womb.material
    );

    cube.rotation.z = 2 * Math.PI * i / numOf;
       
    womb.scene.add( cube );

  }


  womb.world.onWindowResize();

  womb.loader.loadBarAdd();
  

  womb.update = function(){

   womb.uniforms.time.value ++; 

  }

  womb.start = function(){

     womb.stream.play();


  }


});
