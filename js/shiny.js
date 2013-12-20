define(function(require, exports, module) {

  var m                   = require( 'app/utils/Math'                 );
  var AudioGeometry       = require( 'app/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'app/utils/AnalyzingFunctions'   );

  var ShaderMaterial      = require( 'app/utils/ShaderMaterial'       );

  var Womb                = require( 'app/Womb'                       );
  

  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );
  var shaderChunks        = require( 'app/shaders/shaderChunks'      );

 

  womb = new Womb({
    cameraController: 'TrackballControls',
    objLoader:        true,
    massController:   true,
    springController: true,
    textCreator:      true,
    test:             true,
    title:            'A Tooth For An Eye - The Knife',
    summary:          'Drag to spin, press x to hide',
    gui:              true
    //effectComposer:   true
  });
  
  womb.stream = womb.audioController.createUserAudio();
 // womb.stream = womb.audioController.createStream( '../lib/audio/aTooth.mp3' );
  //womb.audioController.gain.gain.value = 0;

 
  womb.stream.onStreamCreated = function(){

    console.log('ss');
   
    // Communal uniform
    womb.time = { type: "f" , value: 0 };

    womb.uniforms1 = {
      texture: { type: "t", value: womb.stream.texture.texture },
      color:{ type: "v3" , value: new THREE.Vector3( 0.5 , 0.2 , 1.5 ) },
      time: womb.time,
      pow_noise:{ type: "f" , value: 1.0 },
      pow_audio:{ type: "f" , value: 2.0 }
    };

    womb.interface.addAllUniforms( womb.uniforms1 , 'uniforms1' );

    womb.material1 = new THREE.ShaderMaterial( {
      uniforms: womb.uniforms1,
      vertexShader: vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.position.absDiamond,
      transparent:true
    });

    var s = womb.size / 20;
    var geo = new THREE.PlaneGeometry( s , s , 100 , 100 );

    var numOf = 1;
    for( var i = 0; i < numOf; i++ ){
      
      var cube = new THREE.Mesh(
        geo,
        womb.material1
      );
         
      womb.scene.add( cube );

    }

    womb.onWindowResize();

    womb.loader.loadBarAdd();

  }
  

  womb.update = function(){

   womb.time.value ++; 

  }

  womb.start = function(){



  }


});
