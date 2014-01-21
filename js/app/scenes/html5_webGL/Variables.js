define(function(require, exports, module) {

  var Womb                = require( 'app/Womb'                       );

  var AntiSerpenski       = require( 'app/scenes/html5_webGL/AntiSerpenski' );
  var Ring                = require( 'app/scenes/html5_webGL/Ring'    );
  var Text                = require( 'app/scenes/html5_webGL/Text'    );
  var Image               = require( 'app/scenes/html5_webGL/Image'   );
  var Fan                 = require( 'app/scenes/html5_webGL/Fan'     );
  var Random              = require( 'app/scenes/html5_webGL/Random'  );
  var Head                = require( 'app/scenes/html5_webGL/Head'    );
  var World               = require( 'app/scenes/html5_webGL/World'   );
  var Stars               = require( 'app/scenes/html5_webGL/Stars'   );

  function Digital( womb, params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    this.scenes = [];

    this.events = [];
    this.currentEvent = 0;

    this.head = this.womb.digital.alteredQualia;

    this.webAudio = new Text( womb , {

      text: 'Web Audio API',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),

    });

    this.webAudio.scene.position.y = 20;
    this.webAudio.scene.position.z = 150;

    this.leapMotion = new Text( womb , {

      text: 'Leap Motion',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),

    });

    this.leapMotion.scene.position.y = -20;
    this.leapMotion.scene.position.z = 150;




    this.events.push( function(){

      this.head.enter();
    });

    this.events.push( function(){

      this.head.material.color.setHex( 0x442255 );
     // this.head.exit();
    });

    this.events.push( function(){

      this.head.material.color.setHex( 0x9955bb );
      this.head.directionalLight2.color.setHex( 0xc0ffee );

      this.head.spotLight.color.setHex( 0xc0ffee );
      this.head.ambientLight.color.setHex( 0x9944bb );

    });

    this.events.push( function(){
  
      this.webAudio.enter();

    });

    this.events.push( function(){

      this.leapMotion.enter();

    });


    this.events.push( function(){

      this.head.head.material = this.head.materialAudio;
      this.head.head.materialNeedsUpdate = true;
     // this.head.exit();
    });


    this.events.push( function(){

      this.head.exit();
      this.webAudio.exit();
      this.leapMotion.exit();

    });

        

    this.womb.loader.loadBarAdd();

    //this.world.update = this.update.bind( this );

  }


  Digital.prototype.triggerEvent = function( e ){

    console
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
