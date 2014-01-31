define(function(require, exports, module) {

  var m                   = require( 'Utils/Math'                 );

  var Womb                = require( 'Womb/Womb'                  );
  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var physicsParticles    = require( 'Shaders/physicsParticles'   );
  
  var FBOShaders          = require( 'Shaders/FBOShaders'         );

  var FBOUtils            = require( 'Utils/FBOUtils'             );
  var helperFunctions     = require( 'Utils/helperFunctions'      );
  var m                   = require( 'Utils/Math'                 );

  
  /*
   
     Create our womb

  */
  var link = 'https://github.com/mrdoob/sporel';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    title:            'FBO Particle Dissipation',
    link:             link, 
    summary:          info,
    stats:            true,
    color:            '#000000',
    failureVideo:     84019684,
    size:             400
  });



  //womb.stream = womb.audioController.createUserAudio();

  //womb.stream.onStreamCreated  = function(){
  var width = 1024, height = 1024;

  var geometry = new THREE.CubeGeometry( 150 , 150 , 150 , 10 , 10 , 10 );
  
  var data = new Float32Array( width * height * 3 );

  var point = new THREE.Vector3();
  var facesLength = geometry.faces.length;

  for ( var i = 0, l = data.length; i < l; i += 3 ) {

    var face = geometry.faces[ Math.floor( Math.random() * facesLength ) ];

    var vertex1 = geometry.vertices[ face.a ];
    var vertex2 = geometry.vertices[ Math.random() > 0.5 ? face.b : face.c ];

    point.subVectors( vertex2, vertex1 );
    point.multiplyScalar( Math.random() );
    point.add( vertex1 );

    data[ i ] = point.x;
    data[ i + 1 ] = point.y;
    data[ i + 2 ] = point.z;

  }

  var originsTexture = new THREE.DataTexture( data, width, height, THREE.RGBFormat, THREE.FloatType );
  
  originsTexture.minFilter = THREE.NearestFilter;
  originsTexture.magFilter = THREE.NearestFilter;
  originsTexture.generateMipmaps = false;
  originsTexture.needsUpdate = true;

  var positionsTexture = originsTexture.clone();
  positionsTexture.needsUpdate = true;

  rtTexturePos = new THREE.WebGLRenderTarget( width, height, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type:THREE.FloatType,
    stencilBuffer: false
  });

  rtTexturePos2 = rtTexturePos.clone();


  simulationShader = new THREE.ShaderMaterial({

    uniforms: {
      tPositions: { type: "t", value: positionsTexture },
      tOrigins: { type: "t", value: originsTexture },
      opacity: { type: "f", value: 1.0 },
      time:     womb.time
    },

    vertexShader:   FBOShaders.vertex.basic,
    fragmentShader: FBOShaders.fragment.dissipateFromOriginal
  });

  fboParticles = new FBOUtils( width, womb.renderer, simulationShader );
  fboParticles.renderToTexture( rtTexturePos, rtTexturePos2 );

  fboParticles.in = rtTexturePos;
  fboParticles.out = rtTexturePos2;


  var  geometry = new THREE.Geometry();

  for ( var i = 0, l = width * height; i < l; i ++ ) {

    var vertex = new THREE.Vector3();
    vertex.x = ( i % width ) / width ;
    vertex.y = Math.floor( i / width ) / height;
    geometry.vertices.push( vertex );

  } 

  particleMaterial = new THREE.ShaderMaterial( {

    uniforms:       physicsParticles.uniforms.audio,
    vertexShader:   physicsParticles.vertex.lookup,
    fragmentShader: physicsParticles.fragment.audio,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  // depthTest: false,
    transparent: true

  } );


  mesh = new THREE.ParticleSystem( geometry, particleMaterial );
  womb.scene.add( mesh );


  womb.particleMaterial = particleMaterial;
  womb.fboParticles     = fboParticles;
  womb.simulationShader = simulationShader;

  womb.loader.loadBarAdd();



  womb.update = function(){

    // swap
    var tmp = womb.fboParticles.in;
    womb.fboParticles.in = womb.fboParticles.out;
    womb.fboParticles.out = tmp;

    womb.simulationShader.uniforms.tPositions.value = womb.fboParticles.in;
    womb.fboParticles.simulate( womb.fboParticles.out );

    womb.particleMaterial.uniforms.lookup.value = womb.fboParticles.out;

  }

  womb.start = function(){

  }

});
