
define(function(require, exports, module) {

  require( 'lib/three.min' );

  var fboUtils          = ( 'wombs/three/FBOUtils' );
  
  var SC                = require( 'wombs/shaders/shaderChunks'       );
  var fragmentShaders   = require( 'wombs/shaders/fragmentShaders'    );
  var vertexShaders     = require( 'wombs/shaders/vertexShaders'      );
  var tempParticles     = require( 'wombs/shaders/tempParticles'      );
  
  // Visual part of system
  var physicsParticles  = require( 'wombs/shaders/physicsParticles'   );

  var physicsShaders    = require( 'wombs/shaders/physicsShaders'     );

  var helperFunctions   = require( 'wombs/utils/helperFunctions'      );

  function FBOSimulation( womb , params ){

    this.womb = womb;

    this.params = _.defaults( params || {} , {

      size:

      // Should always be the same type of shader
      physicsVertShader:
      physicsFragShader:

      // must include map?
      particlesUniforms:
      particlesVertShader:
      particlesFragShader:

      particlesMap:
      particlesColor:
      particles

    });

    this.renderer = this.womb.renderer;

     
    this.size = this.params.size;


    this.positionsTexture = this.createDataTexture( this.size );

    this.physicsShader = new THREE.ShaderMaterial({

      uniforms        : this.params.physicsUniforms,
      vertexShader    : this.params.physicsVertShader,
      fragmentShader  : this.params.physicsFragShader

    });

    this.positionTexture = this.createDataTexture( this.size );

    this.rtTexturePos = this.createRenderTexture( size );


    this.fbo = fboUtils( this.size , this.renderer , this.physicsShader ); 


  }

  FBOSimulation.prototype.createDataTexture( size ){

    var data = new Float32Array( size * size * 4 );
    var texture = new THREE.DataTexture( data, size , size , THREE.RGBAFormat, THREE.FloatType );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    return texture;

  }

  FBOSimulation.protoype.createRenderTexture( size ){

    var texture = new THREE.WebGLRenderTarget( size , size , {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type:THREE.FloatType,
      stencilBuffer: false
    });


    return texture;

  }


  module.exports = FBOSimulation;


});
