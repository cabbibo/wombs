define(function(require, exports, module) {

  var m                   = require( 'Utils/Math'           );

  var Womb                = require( 'Womb/Womb'                  );
  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  /*
   
     Create our womb

  */
  var link = 'http://www.fractalforums.com/new-theories-and-research/very-simple-formula-for-fractal-patterns/';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    raycaster:        false,
    title:            'Kali Fractal Vertex and Fragment Shader',
    link:             link, 
    summary:          info,
    stats:            true,
  });

  womb.vertexShader = [

    "varying vec2 vUv;",
    "varying vec3 vPos;",
    "varying vec3 pPos;",

    "uniform float time;",
    "uniform vec3  seed;",

   
    shaderChunks.createKali( 3 ),

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
      "vPos = pos;",

      shaderChunks.modelView, 

    "}"


  ].join( "\n" );

  womb.fragmentShader = [

    "uniform vec3 color;",
    "uniform vec3 seed;",
    
    "varying vec2 vUv;",
    "varying vec3 vPos;",
    "varying vec3 pPos;",

    shaderChunks.createKali( 15 ), 
    shaderChunks.polar,

    "void main( void ){",
     
      "vec3 k = kali( vPos , seed );",
      "vec3 polar = polar( vec3( 1.0 , vUv ) );",
      "vec3 nPos = normalize( vPos );",
      "float l = 1.0 - length( nPos );",
      "gl_FragColor = vec4( normalize(k) * .2 + polar * color  , 1.0 );",
    "}"

  ].join( "\n" );


  womb.loader.loadBarAdd();

  function initMain(){

    var s = womb.size / 2;
    womb.geometry = new THREE.CubeGeometry( s , s , s , 50 , 50  ,50 );

    womb.uniforms  = {

      color:      { type: "v3", value: new THREE.Vector3( .1 , .1 , .9 ) },
      seed:       { type: "v3", value: new THREE.Vector3( -0.1 , -0.1 ,  -0.9) },
      time:       { type: "f" , value: 0 },
      noiseSize:  { type: "f" , value: 1 },
      noisePower: { type: "f" , value: .2 },
      audioPower: { type: "f" , value: 0.2 },


    };

    womb.material = new THREE.ShaderMaterial({

      uniforms        : womb.uniforms,       
      vertexShader    : womb.vertexShader,
      fragmentShader  : womb.fragmentShader,
   

      depthTest       : false,
     blending        : THREE.AdditiveBlending,
      transparent     : true,
     // wireframe       : true
    
    });


    womb.sphereMesh = new THREE.Mesh( 

        womb.geometry ,
        womb.material

    );


    womb.scene.add( womb.sphereMesh );


  }

  womb.update = function(){

    womb.uniforms.time.value ++;

    var c = womb.uniforms.color.value;
    womb.uniforms.seed.value.x = -c.x + .3 * ( Math.sin( womb.uniforms.time.value / 500.0 ) -1.0 ) / 2;
    womb.uniforms.seed.value.y = -c.y + .3 * ( Math.cos( womb.uniforms.time.value / 520.0 ) -1.0 ) / 2;
    womb.uniforms.seed.value.y = -c.z + .3 * ( Math.cos( womb.uniforms.time.value / 550.0 ) -1.0 ) / 2;
  
  }

  womb.start = function(){

    initMain();

  }


});
