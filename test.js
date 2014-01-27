define(function(require, exports, module) {

  var m                   = require( 'wombs/utils/Math'                 );
  var AudioGeometry       = require( 'wombs/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'wombs/utils/AnalyzingFunctions'   );

  var Womb                = require( 'wombs/Womb'                       );

  var recursiveFunctions  = require( 'wombs/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'wombs/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'wombs/shaders/vertexShaders'      );
  var shaderChunks        = require( 'wombs/shaders/shaderChunks'       );

  var VideoTexture        = require( 'wombs/three/VideoTexture'         );

  var physicsShaders      = require( 'wombs/shaders/physicsShaders'     );
  var PhysicsSimulator    = require( 'wombs/shaders/PhysicsSimulator'   );
  var physicsParticles    = require( 'wombs/shaders/physicsParticles'   );
  
  var FBOShaders          = require( 'wombs/shaders/FBOShaders'         );
  var FBOUtils            = require( 'wombs/three/FBOUtils'             );

  var helperFunctions     = require( 'wombs/utils/helperFunctions'      );
  
  /*
   
     Create our womb

  */
  var link = 'http://soundcloud.com/holyother';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  console.log( 'HELL');
  womb = new Womb({
    cameraController: 'TrackballControls',
    modelLoader:      true,
    textCreator:      true,
    raycaster:        true,
    title:            'Holy Other - We Over',
    link:             link, 
    summary:          info,
    gui:              true,
    imageLoader:      true,
    stats:            true,
    color:            '#000000',
    failureVideo:84019684,
    size: 400
  });

 womb.stream = womb.audioController.createStream( '../lib/audio/tracks/weOver.mp3' );


  womb.modelLoader.loadFile( 'OBJ' , '/lib/models/mug_11530_10.obj' , function( object ){

      if( object[0] instanceof THREE.Mesh ){
      }

      if( object[0] instanceof THREE.Geometry ){

        womb.geo = object[0];
        womb.geo.computeFaceNormals();
        womb.geo.computeVertexNormals();
        
        womb.modelLoader.assignUVs( womb.geo );
       
        womb.onMugLoad( womb.geo );
      }

  });


  womb.onMugLoad = function( geo ){

  //womb.stream = womb.audioController.createUserAudio();

  //womb.stream.onStreamCreated  = function(){
  var width = 1024, height = 1024;

  var data = new Float32Array( width * height * 4 );
  var positionsTexture = new THREE.DataTexture( data, width, height, THREE.RGBAFormat, THREE.FloatType );
  positionsTexture.minFilter = THREE.NearestFilter;
  positionsTexture.magFilter = THREE.NearestFilter;
  positionsTexture.generateMipmaps = false;
  positionsTexture.needsUpdate = true;

  var geometry = geo;

  var material = new THREE.MeshBasicMaterial( {
    color: 0xffffff
  } );

  mesh = new THREE.Mesh( geometry, material );
  mesh.position.y = -50;

  mesh.scale.multiplyScalar( 500 );

  var geometry = new THREE.Geometry();

  THREE.GeometryUtils.merge( geometry , mesh );


  var geometry = new THREE.CubeGeometry( 150 , 150 , 150 , 10 , 10 , 10 );
  //womb.scene.add( mesh );


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
      audioTexture: { type: "t", value: womb.stream.texture.texture },
      opacity: { type: "f", value: 1.0 },
      time:     womb.time
    },

    vertexShader:   FBOShaders.vertex.basic,
    fragmentShader: FBOShaders.fragment.dissipateFromOriginalAudio
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

  console.log( particleMaterial.uniforms );

  particleMaterial.uniforms.audioTexture.value = womb.stream.texture.texture;


  mesh = new THREE.ParticleSystem( geometry, particleMaterial );
  womb.scene.add( mesh );


  womb.particleMaterial = particleMaterial;
  womb.fboParticles     = fboParticles;
  womb.simulationShader = simulationShader;

  womb.loader.loadBarAdd();
  }


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

    womb.stream.play();
  
  }

  womb.raycaster.onMeshHoveredOver = function(){

  }

  womb.raycaster.onMeshHoveredOut = function(){

  }
  

});
