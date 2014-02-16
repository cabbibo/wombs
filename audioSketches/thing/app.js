define(function(require, exports, module) {

  var m                   = require( 'Utils/Math'                 );

  var Womb                = require( 'Womb/Womb'                  );
  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  /*
   
     Create our womb

  */
  var link = 'http://www.nosajthing.com/';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    modelLoader:      true,
    textCreator:      true,
    title:            'Philip Glass - Knee 1 ( Nosaj Thing Remix )',
    link:             link, 
    summary:          info,
    gui:              true,
    imageLoader:      true,
    stats:            true,
    color:            '#000000' 
  });


  womb.stream = womb.audioController.createStream( '/lib/audio/tracks/knee1.mp3' );
  womb.stream.play();
  
  
  // SHARED UNIFORM

  var size = womb.size / 5;
  womb.sphereGeo = new THREE.IcosahedronGeometry( size , 6 );
  womb.sphereGeo = new THREE.SphereGeometry( size , 100 , 100 );

  womb.sphereGeo = new THREE.CubeGeometry( size , size , size , 100 , 100  ,100 );
  womb.normalMaterial = new THREE.MeshNormalMaterial();


  womb.uniforms  = {

    color:      { type: "v3", value: new THREE.Vector3( .0 , .0 , .9 ) },
    seed:       { type: "v3", value: new THREE.Vector3( -0.1 , -0.1 ,  -0.9) },
    texture:    { type: "t" , value: womb.stream.texture },
    time:       { type: "f" , value: 0 },
    noiseSize:  { type: "f" , value: 1 },
    noisePower: { type: "f" , value: .2 },
    audioPower: { type: "f" , value: 0.2 },

  };


  womb.interface.addAllUniforms( womb.uniforms , 'WEIRD SQUARE' );


  womb.vertexShader = [

    "varying vec2 vUv;",
    "varying vec3 vPos;",
    "varying float displacement;",

    "uniform sampler2D texture;",
    
    "uniform float time;",
    "uniform float noisePower;",
    "uniform float audioPower;",
    "uniform float noiseSize;",
    

    shaderChunks.noise3D,
    shaderChunks.absAudioPosition,
    shaderChunks.audioUV,

    "void main( void ){",

      "vUv = uv;",
      "vPos = position;",

      "vec3 pos = position;",
     
      "vec3 offset;",
      "vec3 nPos = normalize( position );",

      "offset.x = nPos.x + cos( time / 100.0 );",
      "offset.y = nPos.y + sin( time / 100.0 );",
      "offset.z = nPos.z;", //+ tan( time / 100.0 );",
      "offset *= noiseSize;",

      "vec2 absUV =  abs( uv - .5 );",

      "vec3 audioPosition = absAudioPosition( texture , position );",

      "float dAudio = snoise3( audioPosition );",
      "float dNoise = snoise3( offset );",

      "float aP = length( audioPosition );",

      "displacement = length( (audioPosition * audioPower) ) + ( dNoise * noisePower ) + .8;",


      "pos *= displacement;",

      "vec4 mvPosition = modelViewMatrix * vec4( pos , 1.0 );",
      "gl_Position = projectionMatrix * mvPosition;",

    "}"


  ].join( "\n" );

  womb.fragmentShader = [

    "uniform vec3 color;",
    "uniform vec3 seed;",
    "uniform float loop;",
    "uniform float noisePower;",
    "varying vec2 vUv;",
    "varying vec3 vPos;",

    shaderChunks.createKali( 20 ),


    "varying float displacement;",

    "void main( void ){",
      "vec3 nPos = normalize( vPos );",

      "vec3 c = kali( nPos , seed );",

      "vec3 cN = normalize( normalize( c ) + 3.0 * color );",
      "gl_FragColor = vec4( cN * ( ( displacement -.5 ) / ( noisePower * 2.0 ) ) , 1.0 );",
    "}"

  ].join( "\n" );

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

      womb.sphereGeo ,
      womb.material

  );

  womb.scene.add( womb.sphereMesh );

  
  womb.loader.loadBarAdd();


  womb.update = function(){

    womb.uniforms.time.value ++;

    //womb.uniforms.noiseSize.value = 0;
   // womb.uniforms.noiseSize.value = 1 * Math.sin( womb.uniforms.time.value / 1000.0 );

    womb.uniforms.seed.value.x = ( Math.sin( womb.uniforms.time.value / 1000.0 ) -1.0 ) / 2;
    womb.uniforms.seed.value.y = ( Math.cos( womb.uniforms.time.value / 1000.0 ) -1.0 ) / 2;
  }

  womb.start = function(){

  }


});
