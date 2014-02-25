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

  var Mesh                = require( 'Components/Mesh'            );
  var FBOParticles        = require( 'Species/FBOParticles'       );
 
  var VideoTexture        = require( 'Womb/Textures/VideoTexture' );
  //var shaderCreator       = require( 'Shaders/ShaderCreator' );
  /*
   
     Create our womb

  */


  womb = new Womb({
    stats:            true,
  });

  womb.texture = new VideoTexture( womb , {

    file:'/lib/video/weddingBells.mp4'

  });
   
  console.log( womb.texture );

  womb.particleUniforms = THREE.UniformsUtils.clone( physicsParticles.uniforms.basic );

  // Adding precision
  womb.particleUniforms.lookupP = {
    type: "t",
    value: null
  }

  console.log( womb.particleUniforms );
  womb.particleVertShader = physicsParticles.vertex.lookupPrecision;
  womb.particleFragShader = physicsParticles.fragment.basic;


  var map         = '/lib/img/particles/lensFlare.png';
  var lookup      = '/lib/img/shaderTextures/field1.png';
  var precision   = '/lib/img/shaderTextures/field2.png';
  womb.particleParams =   {
    size: 1,
    sizeAttenuation: true,
    blending: THREE.NormalBlending,
    depthWrite: false,//true,
    transparent:false,// true,
    fog: true, 
    map:        THREE.ImageUtils.loadTexture( map ),
    lookup:     THREE.ImageUtils.loadTexture( lookup ),
    lookupP:    THREE.ImageUtils.loadTexture( precision ),
    opacity:    .1,
  }

  console.log( womb.particleParams.lookup );

  womb.particleParams.lookup.minFilter  = THREE.NearestFilter,
  womb.particleParams.lookup.magFilter  = THREE.NearestFilter,
  womb.particleParams.lookup.format     = THREE.RGBAFormat,
  womb.particleParams.lookup.type       = THREE.FloatType,

  womb.particleParams.lookupP.minFilter  = THREE.NearestFilter,
  womb.particleParams.lookupP.magFilter  = THREE.NearestFilter,
  womb.particleParams.lookupP.format     = THREE.RGBAFormat,
  womb.particleParams.lookupP.type       = THREE.FloatType,

  womb.particleMaterial = new THREE.ShaderMaterial({

    uniforms:       womb.particleUniforms,
    vertexShader:   womb.particleVertShader,
    fragmentShader: womb.particleFragShader,

    color:          true,
    blending:       womb.particleParams.blending,
    transparent:    womb.particleParams.transparent,
    depthWrite:     womb.particleParams.depthWrite,
    fog:            womb.particleParams.fog,


  });

  var width = 512;
  var height = 512;
  var  geometry = new THREE.Geometry();

  for ( var i = 0, l = width * height; i < l; i ++ ) {

    var vertex = new THREE.Vector3();
    
    vertex.x = ( i % width ) / width ;
    vertex.y = Math.floor( i / width ) / height;

    //vertex.x = Math.random();
    //vertex.y = Math.random();

    geometry.vertices.push( vertex );

  } 

  helperFunctions.setMaterialUniforms( womb.particleMaterial , womb.particleParams );

  womb.geometry = new THREE.CubeGeometry( 1, 1 , 1 , 100 , 100 , 10 );
  womb.geometry = new THREE.PlaneGeometry( 1, 1 , 512 , 512 );
  womb.particleSystem = new THREE.ParticleSystem(
    geometry,
    womb.particleMaterial
  );

 // womb.particleSystem.scale.multiplyScalar( 100 );
  console.log( womb.particleSystem );

  womb.scene.add( womb.particleSystem );

  /*var uniforms = shaderCreator.parse( 'uniform', FBOShaders.fragment.displaceSphere );
  var varyings = shaderCreator.parse( 'varying', FBOShaders.fragment.displaceSphere );

  console.log( uniforms );
  console.log( varyings );*/


  womb.loader.loadBarAdd();

  womb.update = function(){

    womb.texture._update();

  }

  womb.start = function(){
   // audio.play();

    //womb.texture.video.play();
    //womb.videoTexture.

  }

});
