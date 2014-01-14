define(function(require, exports, module) {

  var m                   = require( 'app/utils/Math'                 );
  var AudioGeometry       = require( 'app/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'app/utils/AnalyzingFunctions'   );

  var Womb                = require( 'app/Womb'                       );

  var recursiveFunctions  = require( 'app/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );
  var shaderChunks        = require( 'app/shaders/shaderChunks'       );

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
    title:            'Philip Glass - Knee 1 ( Nosaj Thing Remix )',
    link:             link, 
    summary:          info,
    gui:              true,
    imageLoader:      true,
    stats:            true,
    color:            '#000000' 
  });


  womb.stream = womb.audioController.createStream( '../lib/audio/tracks/knee1.mp3' );
  womb.stream.play();
  
  womb.stream = womb.audioController.createUserAudio();
  womb.audioController.gain.gain.value = 0; 
  

  womb.vertexShader = [

    "varying vec2 vUv;",
    "varying vec3 vPos;",
    "varying vec3 pPos;",
    "varying float displacement;",

    "uniform sampler2D texture;",
    
    "uniform float time;",
    "uniform float noisePower;",
    "uniform float audioPower;",
    "uniform float noiseSize;",
    "uniform vec3  seed;",

   
    shaderChunks.createKali( 10 ),

    shaderChunks.noise3D,
    shaderChunks.absAudioPosition,
    shaderChunks.audioUV,
    shaderChunks.polar,

    "void main( void ){",

      "vUv = uv;",
      "vPos = position;",
      "pPos = polar( position );",

      "vec3 pos = position;",
     
      "vec3 offset;",
      "vec3 nPos = normalize( position );",

      "vec3 c = kali( nPos , seed );",
      "vec3 cN = abs( normalize( c ) );",
      "pos = cN * vPos;",
      "displacement = snoise( cN ) + 1.0;",
      "pos =  cN * vPos;",
      //"pos.z = polar( vec3( 1.0 , vUv ) ).z;",
      //"pos.z = ( displacement - 0.5 ) * 5.0;",
      "vPos = pos;",

      shaderChunks.modelView, 

    "}"


  ].join( "\n" );

  womb.fragmentShader = [

    "uniform vec3 color;",
    "uniform vec3 seed;",
    "uniform float noisePower;",
    "varying vec2 vUv;",
    "varying vec3 vPos;",
    "varying vec3 pPos;",

    shaderChunks.createKali( 10 ), 
    shaderChunks.noise3D,
    shaderChunks.polar,



    "varying float displacement;",

    "void main( void ){",
     
      "vec3 k = kali( displacement * vPos , seed );",
      "vec3 polar = polar( vec3( 1.0 , vUv ) );",
      "vec3 nPos = normalize( vPos );",
      "float l = 1.0 - length( nPos );",
      "gl_FragColor = vec4( normalize(k) * .2 + polar * .7 + displacement * l , 1.0 );",
    "}"

  ].join( "\n" );


  womb.loader.loadBarAdd();

  function initMain(){

    // SHARED UNIFORM

    var s = womb.size / 5;
    womb.geometry = new THREE.CubeGeometry( s , s , s , 100 , 100  ,100 );
   //womb.geometry = new THREE.PlaneGeometry( s , s , 50 , 50 );


    womb.uniforms  = {

      color:      { type: "v3", value: new THREE.Vector3( .1 , .1 , .9 ) },
      seed:       { type: "v3", value: new THREE.Vector3( -0.1 , -0.1 ,  -0.9) },
      texture:    { type: "t" , value: womb.stream.texture.texture },
      time:       { type: "f" , value: 0 },
      noiseSize:  { type: "f" , value: 1 },
      noisePower: { type: "f" , value: .2 },
      audioPower: { type: "f" , value: 0.2 },


    };

    womb.interface.addAllUniforms( womb.uniforms , 'WEIRD SQUARE' );


    womb.material = new THREE.ShaderMaterial({

      uniforms        : womb.uniforms,       
      vertexShader    : womb.vertexShader,
      fragmentShader  : womb.fragmentShader,
   

      //depthTest       : false,
      //side            : THREE.DoubleSide,
      //blending        : THREE.AdditiveBlending,
      //transparent     : true,
      //wireframe       : true
    
    });


    womb.sphereMesh = new THREE.Mesh( 

        womb.geometry ,
        womb.material

    );

   // womb.sphereMesh.scale.multiplyScalar( 10 );

    womb.scene.add( womb.sphereMesh );


  }

  womb.update = function(){

    womb.uniforms.time.value ++;

    //womb.uniforms.noiseSize.value = 0;
   // womb.uniforms.noiseSize.value = 1 * Math.sin( womb.uniforms.time.value / 1000.0 );

    var c = womb.uniforms.color.value;
    womb.uniforms.seed.value.x = -c.x + .01 * ( Math.sin( womb.uniforms.time.value / 1000.0 ) -1.0 ) / 2;
    womb.uniforms.seed.value.y = -c.y + .1 * ( Math.cos( womb.uniforms.time.value / 1000.0 ) -1.0 ) / 2;
  }

  womb.start = function(){

    initMain();

  }

  womb.raycaster.onMeshHoveredOver = function(){

    console.log( 'WHOA' );

  }

  womb.raycaster.onMeshHoveredOut = function(){

    console.log( 'WHO' );

  }

  

});
