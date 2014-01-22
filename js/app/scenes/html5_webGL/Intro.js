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
      //geo: new THREE.CubeGeometry( 50 , 50 , 50 )
    });
    this.voicePulser.scene.rotation.x = Math.PI / 2;
    this.voicePulser.scene.position.z = -100;

    this.scenes.push( this.voicePulser );

    this.happy = new Text( womb , {

      text: 'HAPPY',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),

    });
    this.scenes.push( this.happy );

    this.wizard = new Image( womb , {

      image: '/lib/img/html5_webGL/wizardHat.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 3.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 )

    });
    this.scenes.push( this.wizard );


    this.superman = new Image( womb , {

      image: '/lib/img/html5_webGL/supermanLogo.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 )

    });
    this.scenes.push( this.superman );


    this.paintBrush = new Fan( womb , {

      size: this.womb.size * 1.5,
      image: '/lib/img/html5_webGL/paintBrush.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      numOf: 10,
      ratio: .556 

    });
    this.paintBrush.scene.position.z = - 30;
    this.scenes.push( this.paintBrush );


    this.pop = new Text( womb , {

      font: 'Comic Sans MS',
      text: 'POP!',
      color: new THREE.Vector3( 0 , 5 , 0),

    });
    this.scenes.push( this.pop );


    this.currentEvent = 0;
    this.events = [

      function(){
        console.log( this );
        console.log( this.voicePulser );
        this.voicePulser.enter();
      },

      function(){
        this.happy.enter();
      },

      function(){

        this.happy.exit();

      },

      function(){

        this.paintBrush.enter();

      },
      
      function(){

        this.paintBrush.fanOut();

      },

      function(){
      
        this.pop.enter();

      },


      function(){

        this.paintBrush.exit();
        this.pop.exit();

      }, 
      
    ]


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
