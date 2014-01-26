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
  var physicsParticles    = require( 'wombs/shaders/physicsParticles'   );


  function Image( womb , params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    var self = this;
    this.params = _.defaults( params || {} , {

    });

    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;



    var self = this;


    //this.stream = womb.audioController.createStream( '../lib/audio/tracks/weOver.mp3' );

    this.ps = new PhysicsSimulator( womb , {

      textureWidth: 0,
      debug: false,
      velocityShader: physicsShaders.velocity.curl,
      velocityStartingRange:.0,
      positionStartingRange:[ 1 , 1 , 0 ],
      positionShader: physicsShaders.position,
      particles:      physicsParticles.basic,
      bounds: 100,
      speed: .1,
     
      velocityShaderUniforms:{
  
          seperationDistance:   100.0,
          alignmentDistance:    150.0,
          cohesionDistance:     100.0,
          freedomFactor:          0.3,


          noiseSize:              .01,
          potentialPower:         5.0,
          
          dampening:             1.0,
          gravityStrength:    .001,
        
      },
      particleParams:   {
          size: 25,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
          fog: true, 
          map: THREE.ImageUtils.loadTexture( '../lib/img/particles/lensFlare.png' ),
          opacity:    1,
        }, 
     



      audio: this.stream

    });
   
    this.womb.loader.loadBarAdd();
    this.womb.loader.loadBarAdd();

    var self = this;
    this.world.update = function(){

      self.ps._update();

    }



  }


   

  Image.prototype.enter = function(){

    //this.audio.turnOnFilter();
    this.world.enter();
  }

  Image.prototype.exit = function(){
   
    if( this.audio ){
      this.audio.fadeOut();
    }
  
    this.world.exit();
  
  }

  module.exports = Image;

});
