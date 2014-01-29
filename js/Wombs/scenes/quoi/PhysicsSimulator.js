define(function(require, exports, module) {

  var m                   = require('wombs/utils/Math'              );
  var AudioGeometry       = require('wombs/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('wombs/utils/AnalyzingFunctions');


  var Womb                = require( 'wombs/Womb'                       );

  var recursiveFunctions  = require( 'wombs/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'wombs/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'wombs/shaders/vertexShaders'      );
  var physicsShaders      = require( 'wombs/shaders/physicsShaders'     );
  var shaderChunks        = require( 'wombs/shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'wombs/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'wombs/shaders/physicsShaders'     );


  function PhysicsSimulatorScene( womb , params ){


    var params = params || {};
    this.womb = womb;

    this.womb.loader.addToLoadBar();

    console.log( womb );
    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;

    this.physicsSimulation = new PhysicsSimulator( womb /*, {

      bounds: params.bounds || womb.size,
      textureWidth:  params.textureWidth ||20,
      velocityShader: params.velocityShader || physicsShaders.velocity.flockign,
      positionShader:  params.physicsShader || physicsShaders.position,
      startingVelocityRange:  params.startingVelocityRange ||10,
      startingPositionRange:  params.startingPositionRange ||1,
      debug: false,
      particleParams:{

        size: 5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        fog: true, 
        map: THREE.ImageUtils.loadTexture( '../lib/img/quoi/cookieSprite.png' ),
        opacity:    .9,
      },

      velocityShaderUniforms: params.velocityShaderUniforms || {
          
          speed:                 1.0,

          seperationDistance:   4000.0,
          alignmentDistance:    3500.0,
          cohesionDistance:     100.0,
          freedomFactor:          0.3,
          
          dampening:             1.0,
          gravityStrength:     5000.0,
        
      },


      
    }*/);

    womb.scene.remove( this.physicsSimulation.particleSystem );
    this.scene.add( this.physicsSimulation.particleSystem );


    var physSim = this.physicsSimulation;
    var self = this;
    this.world.update = function(){
      self.physicsSimulation._update();
      self.scene.rotation.y += .001;
    }

    womb.loader.loadBarAdd();

  }

  PhysicsSimulatorScene.prototype.enter = function(){
    this.world.enter();
  }

  PhysicsSimulatorScene.prototype.exit = function(){
    this.world.exit();
  }

  module.exports = PhysicsSimulatorScene;

});
