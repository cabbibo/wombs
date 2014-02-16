define(function(require, exports, module) {

  var m                   = require( 'Utils/Math'                 );

  var Womb                = require( 'Womb/Womb'                       );
  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  /*
   
     Create our womb

  */
  var link = 'http://robbietilton.com';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    title:            'Simplex Noise',
    link:             link, 
    summary:          info,
    stats:            true,
  });



  // SHARED UNIFORMS

  var size = womb.size / 20;
  womb.sphereGeo = new THREE.IcosahedronGeometry( size , 6 );
  womb.normalMaterial = new THREE.MeshNormalMaterial();


  womb.uniforms  = {

    color:      { type: "v3", value: new THREE.Vector3( 2.1 , .5 , .4 ) },
    time:       { type: "f" , value: 0 },
    noiseSize:  { type: "f" , value: 1 },

  };

 

  womb.vertexShader = [

    "varying vec2 vUv;",
    "varying vec3 vPos;",
    "varying float displacement;",

    "uniform float time;",
    "uniform float noiseSize;",
    

    shaderChunks.noise3D,

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

      "float d = snoise3( offset );",
      "displacement = d + 1.0;",

      "pos *= displacement;",

      "vec4 mvPosition = modelViewMatrix * vec4( pos , 1.0 );",
      "gl_Position = projectionMatrix * mvPosition;",

    "}"


  ].join( "\n" );

  womb.fragmentShader = [

    "uniform vec3 color;",
    "varying vec2 vUv;",
    "varying vec3 vPos;",

    "varying float displacement;",

    "void main( void ){",
      "vec3 nPos = normalize( vPos );",
      "gl_FragColor = vec4( color * abs( nPos ) * displacement, 1.0 );",
    "}"

  ].join( "\n" );

  womb.material = new THREE.ShaderMaterial({

    uniforms        : womb.uniforms,       
    vertexShader    : womb.vertexShader,
    fragmentShader  : womb.fragmentShader
  
  });


  womb.sphereMesh = new THREE.Mesh( 

      womb.sphereGeo ,
      womb.material

  );

  womb.scene.add( womb.sphereMesh );

  
  womb.loader.loadBarAdd();


  womb.update = function(){

    womb.uniforms.time.value ++;


    womb.uniforms.noiseSize.value = 4 * Math.sin( womb.uniforms.time.value / 1000.0 );

  }

  womb.start = function(){

  }


});
