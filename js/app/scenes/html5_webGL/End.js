define(function(require, exports, module) {

  var Womb                = require( 'app/Womb'                       );


  var MomentumFlyControls   = require( 'controls/MomentumFlyControls'   );
  var LeapFlyControls     = require( 'controls/LeapFlyControls'       );
  var Text                = require( 'app/scenes/html5_webGL/Text'    );
  var PhysicsSimulator    = require( 'app/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );
  var physicsParticles    = require( 'app/shaders/physicsParticles'   );


  function Digital( womb, params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    this.scenes = [];

    this.events = [];
    this.currentEvent = 0;

    this.stream = womb.audioController.createStream( '../lib/audio/tracks/weOver.mp3' );
    this.weOver = new PhysicsSimulator( womb , {

      textureWidth: 300,
      debug: false,
      velocityShader: physicsShaders.velocity.curl,
      velocityStartingRange:.0000,
      startingPositionRange:[1 , .000002, 0 ],
      positionShader: physicsShaders.positionAudio_4,
      particles:      physicsParticles.basicAudio,
      bounds: 100,
      speed: .1,
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

    this.holyOther = new Text( womb , {

      text: 'Holy Other - We Over',
      color: new THREE.Vector3( 1.0 , .6 , 1.9 ),

    }); 

 
    this.events.push( function(){

      this.womb.intro.voicePulser.exit();
      this.holyOther.enter();

    });


    this.events.push( function(){

      this.holyOther.exit();
      this.stream.play();
      this.weOver.enter();
 
      console.log( this.womb.cameraController );
      console.log( this.womb.cameraController.controls );

      //this.womb.cameraController.controls = new MomentumFlyControls( this.womb.camera, this.womb.renderer.domElement  , {} );
      console.log( MomentumFlyControls );
      console.log( LeapFlyControls );
      this.womb.cameraController.controls = new LeapFlyControls( 
        this.womb.camera, 
        this.womb.leapController  
       // {}
      );

    });

    this.events.push( function(){
 
      this.weOver.exit();
    
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
