define(function(require, exports, module) {

  var m                   = require( 'app/utils/Math'                 );
  var AudioGeometry       = require( 'app/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'app/utils/AnalyzingFunctions'   );

  var Womb                = require( 'app/Womb'                       );
  
  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );
  var shaderChunks        = require( 'app/shaders/shaderChunks'      );

 

  womb = new Womb({
    cameraController: 'TrackballControls',
    objLoader:        true,
    massController:   true,
    springController: true,
    test:             true,
    title:            'A Tooth For An Eye - The Knife',
    summary:          'Drag to spin, press x to hide',
    gui:              true
    //effectComposer:   true
  });
  
 
  womb.stream = womb.audioController.createUserAudio();
  womb.audioController.gain.gain.value = 0;

 
  womb.stream.onStreamCreated = function(){

   
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

    womb.uniforms2 = {
      texture: { type: "t", value: womb.stream.texture.texture },
      color:{ type: "v3" , value: new THREE.Vector3( 0.3 , 1.0 , 1.5 ) },
      time:womb.time,
      pow_noise:{ type: "f" , value: 1.0 },
      pow_audio:{ type: "f" , value: 2.0 }
    };

    womb.material2 = new THREE.ShaderMaterial( {

      uniforms: womb.uniforms2,
      vertexShader: vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.position.absDiamond,
      blending:THREE.AdditiveBlending,
      transparent:true

    });


    womb.uniforms3 = {
      texture: { type: "t", value: womb.stream.texture.texture },
      color:{ type: "v3" , value: new THREE.Vector3( .8 , .2 , 1.6 ) },
      time:womb.time,
      pow_noise:{ type: "f" , value: 1.0 },
      pow_audio:{ type: "f" , value: 2.0 }
    };

    womb.material3 = new THREE.ShaderMaterial( {

      uniforms: womb.uniforms3,
      vertexShader: vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.position.absDiamond,
      transparent:true

    });


    var s = womb.size / 20;
    var geo = new THREE.CubeGeometry( s , s , s , 30 , 30 , 30 );

    var numOf = 10;
    for( var i = 0; i < numOf; i++ ){
      
      var cube = new THREE.Mesh(
        geo,
        womb.material1
      );

      cube.rotation.z = 2 * Math.PI * i / numOf;
         
      womb.scene.add( cube );

    }


    geo = new THREE.IcosahedronGeometry( s/4 , 5 );

    numOf = 20;
    for( var i = 0; i < numOf; i++ ){
      
      var cube = new THREE.ParticleSystem(
        geo,
        womb.material3
      );

      cube.rotation.z = 2 * Math.PI * i / numOf;


      var pos = Math.toCart( s * 5 ,  2 * Math.PI * i / numOf , 0 );
      cube.position.x = pos.x;
      cube.position.y = pos.z;
      cube.position.z = pos.y;
         
      womb.scene.add( cube );

    }

    geo = new THREE.SphereGeometry( s/4 , 20 , 30 );

    numOf = 20;
    for( var i = 0; i < numOf; i++ ){
      
      var cube = new THREE.Mesh(
        geo,
        womb.material2
      );

      cube.rotation.z = 2 * Math.PI * i / numOf;


      var pos = Math.toCart( s * 4 ,  2 * Math.PI * i / numOf , 0 );
      cube.position.x = pos.x;
      cube.position.y = pos.z;
      cube.position.z = pos.y;
         
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
