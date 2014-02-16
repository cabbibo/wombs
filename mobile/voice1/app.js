define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                  );
  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  /*
   
     Create our womb

  */
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    neededTech:       [ 'webGL' , 'audio' ],
    color:            '#000000',
  });


  womb.stream = womb.audioController.createUserAudio();
  womb.audioController.gain.gain.value = 0;

  womb.stream.onStreamCreated =  function(){

    //console.log('WHOA');

    womb.u = {

      texture:    { type: "t", value: womb.stream.texture },
      image:      { type: "t", value: womb.stream.texture },
      color:      { type: "v3", value: new THREE.Vector3( .5 , .9 , .7 ) },
      time:       womb.time,
      pow_noise:  { type: "f" , value: 0.2 },
      pow_audio:  { type: "f" , value: .3 },

    };

    var uniforms = THREE.UniformsUtils.merge( [
        THREE.ShaderLib['basic'].uniforms,
        womb.u,
    ]);

    uniforms.texture.value = womb.stream.texture;
    uniforms.time=  womb.time  ;

    var mat = new THREE.ShaderMaterial({

      uniforms: uniforms,
      vertexShader: vertexShaders.passThrough,
      fragmentShader: fragmentShaders.audio.color.uv.absDiamond,
      blending: THREE.AdditiveBlending,
      transparent: true,

    });

    var geo = new THREE.CubeGeometry( 100 , 100 , 100 );
    var mesh = new THREE.Mesh( geo , mat );

    womb.scene.add( mesh );

  }

  womb.loader.loadBarAdd();
  

});
