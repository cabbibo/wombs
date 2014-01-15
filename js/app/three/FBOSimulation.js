
define(function(require, exports, module) {

  require( 'lib/three.min' );

  var fboUtils          = ( 'app/three/FBOUtils' );
  
  var SC                = require( 'app/shaders/shaderChunks'       );
  var fragmentShaders   = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders     = require( 'app/shaders/vertexShaders'      );
  var tempParticles     = require( 'app/shaders/tempParticles'      );
  
  // Visual part of system
  var physicsParticles  = require( 'app/shaders/physicsParticles'   );

  var physicsShaders    = require( 'app/shaders/physicsShaders'     );

  var helperFunctions   = require( 'app/utils/helperFunctions'      );

  function FBOSimulation( womb , params ){


    this.params = _.defaults( params || {} , {

      size: 
      positionShader:
      velocityShader:

      // must include map?
      particlesUniforms:
      particlesVertShader:
      particlesFragShader:

      particlesMap:
      particlesColor:
      particles

    });

    this.fbo = fboUtils( this.size , this.renderer , this.physicsShader ); 


  }

  FBOSimulation.prototype


  module.exports = FBOSimulation;


});
