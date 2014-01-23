define(function(require, exports, module) {

  var Womb                = require( 'app/Womb'                       );

  var Ring                = require( 'app/scenes/html5_webGL/Ring'    );
  var Text                = require( 'app/scenes/html5_webGL/Text'    );
  var Image               = require( 'app/scenes/html5_webGL/Image'   );
  var Fan                 = require( 'app/scenes/html5_webGL/Fan'     );
  var Random              = require( 'app/scenes/html5_webGL/Random'  );

  function Intro( womb, params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    this.scenes = [];

    this.voicePulser = new Ring( womb , {
      numOf: 10,
      //img: null,
      geo: new THREE.CubeGeometry( 450 , 5 , 450 , 10 , 10 , 10 )
    });
    this.voicePulser.scene.rotation.x = Math.PI / 2;
    this.voicePulser.scene.position.z = -100;

    this.womb.loader.loadBarAdd();

    //this.world.update = this.update.bind( this );

  }


  Intro.prototype.triggerEvent = function( e ){

    this.events[e].bind( this )();

  }


  Intro.prototype.nextEvent = function(){

    this.triggerEvent( this.currentEvent );
    this.currentEvent ++;

  }
   

  Intro.prototype.enter = function(){


  }

  Intro.prototype.exit = function(){
  
  }

  module.exports = Intro;

});
