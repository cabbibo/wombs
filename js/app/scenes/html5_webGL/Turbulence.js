define(function(require, exports, module) {

  var Womb                = require( 'app/Womb'                             );

  var AntiSerpenski       = require( 'app/scenes/html5_webGL/AntiSerpenski' );
  var Ring                = require( 'app/scenes/html5_webGL/Ring'          );
  var Text                = require( 'app/scenes/html5_webGL/Text'          );
  var Image               = require( 'app/scenes/html5_webGL/Image'         );
  var Fan                 = require( 'app/scenes/html5_webGL/Fan'           );
  var Random              = require( 'app/scenes/html5_webGL/Random'        );
  var Head                = require( 'app/scenes/html5_webGL/Head'          );
  var World               = require( 'app/scenes/html5_webGL/World'         );
  var Stars               = require( 'app/scenes/html5_webGL/Stars'         );
  var MeshDemo            = require( 'app/scenes/html5_webGL/MeshDemo'      );
  var Thing               = require( 'app/scenes/html5_webGL/Thing'         );


  var PhysicsSimulator    = require( 'app/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );
  var physicsParticles    = require( 'app/shaders/physicsParticles'   );


  function Digital( womb, params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    this.scenes = [];

    this.events = [];
    this.currentEvent = 0;

    this.head = this.womb.digital.alteredQualia;

    this.curlNoise = new Image( womb , {

      image: '/lib/img/html5_webGL/curlNoise.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 3.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      ratio: 640/360,

    });

    this.kyoto = new Image( womb , {

      image: '/lib/img/html5_webGL/kyoto.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 3.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      ratio:  786/445
,

    });

    this.lotus = new Image( womb , {

      image: '/lib/img/html5_webGL/lotus.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 3.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      ratio:  635/353,

    });


    this.firstSystem  = new PhysicsSimulator( womb , {

      textureWidth: 300,
      debug: false,
      velocityShader: physicsShaders.velocity.curl,
      startingVelocityRange:.0,
      startingPostionRange:[ 1 , 1 , 0 ],
      positionShader: physicsShaders.position,
      particles:      physicsParticles.basic,
      bounds: 100,
      speed: .1,
     
      velocityShaderUniforms:{
  
          seperationDistance:   100.0,
          alignmentDistance:    150.0,
          cohesionDistance:     100.0,
          freedomFactor:          0.3,


          noiseSize:              .005,
          potentialPower:         5.0,
          
          dampening:             1.0,
          gravityStrength:    .001,
        
      },
      particleParams:   {
          size: 5,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
          fog: true, 
          map: THREE.ImageUtils.loadTexture( '../lib/img/particles/lensFlare.png' ),
          opacity:    1,
        } 
      
      
    }); 

    this.voicePulser = this.womb.intro.voicePulser;
    console.log('BBC RADIO 1');
    console.log( this.voicePulser );


    this.events.push( function(){

      this.curlNoise.enter();
    
    });

    this.events.push( function(){

      this.curlNoise.exit();
      this.kyoto.enter();
    
    });

    this.events.push( function(){

      this.kyoto.exit();
      this.lotus.enter();
    
    });

    this.events.push( function(){

      this.lotus.exit();

    });

    this.events.push( function(){

      this.voicePulser.exit();
      this.firstSystem.enter();

    });

     this.events.push( function(){

      this.voicePulser.enter();
      this.firstSystem.exit();

    });

    this.womb.loader.loadBarAdd();

    //this.world.update = this.update.bind( this );

  }


  Digital.prototype.triggerEvent = function( e ){

    this.events[e].bind( this )();

  }


  Digital.prototype.nextEvent = function(){

    this.triggerEvent( this.currentEvent );
    this.currentEvent ++;

  }
   

  Digital.prototype.enter = function(){


  }

  Digital.prototype.exit = function(){
  
  }

  module.exports = Digital;

});
