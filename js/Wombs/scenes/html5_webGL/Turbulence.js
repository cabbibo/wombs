define(function(require, exports, module) {

  var Womb                = require( 'wombs/Womb'                             );

  var AntiSerpenski       = require( 'wombs/scenes/html5_webGL/AntiSerpenski' );
  var Ring                = require( 'wombs/scenes/html5_webGL/Ring'          );
  var Text                = require( 'wombs/scenes/html5_webGL/Text'          );
  var Image               = require( 'wombs/scenes/html5_webGL/Image'         );
  var Fan                 = require( 'wombs/scenes/html5_webGL/Fan'           );
  var Random              = require( 'wombs/scenes/html5_webGL/Random'        );
  var Head                = require( 'wombs/scenes/html5_webGL/Head'          );
  var World               = require( 'wombs/scenes/html5_webGL/World'         );
  var Stars               = require( 'wombs/scenes/html5_webGL/Stars'         );
  var MeshDemo            = require( 'wombs/scenes/html5_webGL/MeshDemo'      );
  var Thing               = require( 'wombs/scenes/html5_webGL/Thing'         );


  var PhysicsSimulator    = require( 'wombs/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'wombs/shaders/physicsShaders'     );
  var physicsParticles    = require( 'wombs/shaders/physicsParticles'   );


  function Digital( womb, params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    this.scenes = [];

    this.events = [];
    this.currentEvent = 0;

    this.head = this.womb.digital.alteredQualia;

    var geo = new THREE.CubeGeometry( 10 , 10 , 10 , 50 , 50 , 50);
    this.littleStars = new Random( womb , {
     
      radius: womb.size * 10 ,
      size: womb.size * 2,
      modelScale: 40,
      audioPower: -2.5,
      noisePower:  .3,
      geo: geo ,
      image: '/lib/img/moon_1024.jpg',
      color: new THREE.Vector3( 1.9, .9 , 1.5 ),
      
    });

   this.littleStars.update = function(){
      if( this.spinning == true ){
        this.scene.rotation.y += .002;
        this.scene.rotation.x -= .003;
        this.scene.rotation.z += .005;
      }
    }

   this.littleStars1 = new Random( womb , {
     
      radius: womb.size * 10 ,
        size: womb.size * 2,

     image: '/lib/img/moon_1024.jpg',
      modelScale: 40,
      audioPower: -2.5,
      noisePower:  .5,
      geo: geo ,
      color: new THREE.Vector3( .9, 1.9 , 1.9  ),
      
    });

   this.littleStars1.update = function(){
      if( this.spinning == true ){
        this.scene.rotation.y -= .005;
        this.scene.rotation.x += .001;
        this.scene.rotation.z -= .007;
      }
    }

    this.littleStars2 = new Random( womb , {
     
      image: '/lib/img/moon_1024.jpg',
      radius: womb.size * 10 ,
      size: womb.size * 2,
      modelScale: 40,
      audioPower: -2.5,
      noisePower:  .5,
      geo: geo ,
      color: new THREE.Vector3(1.5, .9 , 1.9 ),
      
    });

    this.littleStars2.update = function(){
      if( this.spinning == true ){
        this.scene.rotation.y += .004;
        this.scene.rotation.x -= .005;
        this.scene.rotation.z -= .003;
      }
    }



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
      startingPositionRange:[ 1 , 1 , 0 ],
      positionShader: physicsShaders.position,
      particles:      physicsParticles.basic,
      bounds: 100,
      speed: .01,
     
      velocityShaderUniforms:{
  
          seperationDistance:   100.0,
          alignmentDistance:    150.0,
          cohesionDistance:     100.0,
          freedomFactor:          0.3,


          noiseSize:              .02,
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


      this.firstSystem.exit();

    });

    this.events.push( function(){

      this.voicePulser.enter();

    });

    this.events.push( function(){

      this.littleStars.enter();
      this.littleStars1.enter();
      this.littleStars2.enter();

      this.littleStars.spinning = true;
      this.littleStars1.spinning = true;
      this.littleStars2.spinning = true;

    });

    this.events.push( function(){

      this.littleStars.exit();
      this.littleStars1.exit();
      this.littleStars2.exit();

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
