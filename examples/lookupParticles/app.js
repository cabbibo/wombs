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


  var link = 'https://soundcloud.com/cashmerecat/';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  womb = new Womb({
    title: 'Lookup Particles -  Video',
    summary: info,
    link:     link,
    stats:            true,
  });

  womb.texture = new VideoTexture( womb , {


    file:'/lib/video/weddingBells.mp4'

  });
   
  console.log( womb.texture );

  womb.particleUniforms = THREE.UniformsUtils.clone( physicsParticles.uniforms.basic );

  console.log( womb.particleUniforms );
  womb.particleVertShader = physicsParticles.vertex.lookup;
  womb.particleFragShader = physicsParticles.fragment.position;

  womb.particleParams =   {
    size: 25,
    sizeAttenuation: true,
    blending: THREE.NormalBlending,
    depthWrite: false,
    transparent: true,
    fog: true, 
    map: THREE.ImageUtils.loadTexture( '/lib/img/particles/lensFlare.png' ),
    opacity:    1.0,
  }

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

  womb.geometry = new THREE.PlaneGeometry( 1 , 1 , 100 , 100 );
  
  helperFunctions.setMaterialUniforms( womb.particleMaterial , womb.particleParams );

  womb.particleSystem = new THREE.ParticleSystem(
    womb.geometry,
    womb.particleMaterial
  );

  womb.particleSystem.scale.multiplyScalar( 20 );
  console.log( womb.particleSystem );

  womb.scene.add( womb.particleSystem );

  womb.material = new THREE.MeshBasicMaterial({
    map: womb.texture.texture
  });

  //var material = new THREE.MeshNormalMaterial();
  womb.geo = new THREE.CubeGeometry( .1 , .1 , .1 , 10 , 10 , 10 );

  womb.mesh = new THREE.Mesh( womb.geo , womb.material );

  womb.scene.add( womb.mesh );

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

    womb.texture.video.play();
    //womb.videoTexture.

  }

});
