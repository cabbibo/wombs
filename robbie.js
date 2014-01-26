define(function(require, exports, module) {

  var m                   = require( 'wombs/utils/Math'                 );
  var AudioGeometry       = require( 'wombs/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'wombs/utils/AnalyzingFunctions'   );

  var Womb                = require( 'wombs/Womb'                       );

  var recursiveFunctions  = require( 'wombs/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'wombs/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'wombs/shaders/vertexShaders'      );
  var shaderChunks        = require( 'wombs/shaders/shaderChunks'       );

  var PS = require( 'wombs/scenes/quoi/PhysicsSimulator' );
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
    title:            'Robbie Tilton - Master Of Disguise',
    link:             link, 
    summary:          info,
    //gui:              true,
    imageLoader:      true,
    stats:            true,
    color:            '#100e30' 
  });

  womb.ps = new PS( womb );
  womb.ps.enter();


  // SHARED UNIFORMS

  var size = womb.size / 20;
  womb.sphereGeo = new THREE.SphereGeometry( size , 500 , 500 );
  womb.normalMaterial = new THREE.MeshNormalMaterial();


  womb.uniforms  = {

    color:      { type: "v3", value: new THREE.Vector3( .9 , .5 , .4 ) },
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

      "float d = snoise( offset );",
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
