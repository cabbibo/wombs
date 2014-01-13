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
    cameraController: 'TrackballControls',
    modelLoader:      true,
    textCreator:      true,
    raycaster:        true,
    //title:            'Philip Glass - Knee 1 ( Nosaj Thing Remix )',
    //link:             link, 
    //summary:          info,
    //gui:              true,
    imageLoader:      true,
    neededTech:       [ 'webGL' , 'audio' ],
    //stats:            true,
    color:            '#000000',
    size: 400
  });


  womb.stream = womb.audioController.createUserAudio();
  womb.audioController.gain.gain.value = 0;

  /*womb.ps = new PhysicsSimulator( womb , {

    textureWidth: 500,
    debug: false,
    velocityShader: physicsShaders.velocity.curl,
    velocityStartingRange:.0000,
    positionStartingRange:.000002,
    positionShader: physicsShaders.positionAudio4,
    bounds: 50,
    speed: .1
    
  })*/

  womb.stream.onStreamCreated =  function(){

    //console.log('WHOA');

    womb.u = {

      texture:    { type: "t", value: womb.stream.texture.texture },
      image:      { type: "t", value: womb.stream.texture.texture },
      color:      { type: "v3", value: new THREE.Vector3( .5 , .9 , .7 ) },
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
      //side: THREE.BackSide,
    });
    var geo = new THREE.CubeGeometry( 100 , 100 , 100 );
    var mesh = new THREE.Mesh( geo , mat );

    womb.scene.add( mesh );
  //womb.interface.addAllUniforms( womb.ps.velocityShader.uniforms );

      console.log('HELLO');
  }

  womb.loader.loadBarAdd();
  
  womb.update = function(){

    //womb.ps._update();

    //render();
    
  }

  womb.start = function(){

   // womb.stream.play();
  }

  womb.raycaster.onMeshHoveredOver = function(){

  }

  womb.raycaster.onMeshHoveredOut = function(){

  }
  

});
