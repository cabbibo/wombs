define(function(require, exports, module) {

  var Womb                = require( 'wombs/Womb'                       );

  var Ring                = require( 'wombs/scenes/html5_webGL/Ring'    );
  var Text                = require( 'wombs/scenes/html5_webGL/Text'    );
  var Image               = require( 'wombs/scenes/html5_webGL/Image'   );
  var Fan                 = require( 'wombs/scenes/html5_webGL/Fan'     );
  var Random              = require( 'wombs/scenes/html5_webGL/Random'  );

  function Physical( womb, params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    this.scenes = [];

    this.art = new Text( womb, {

      text: 'ART',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),


    });

    this.dragonfly = new Image( womb , {

      image: '/lib/img/html5_webGL/dragonfly.png',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      ratio: 1788 / 1146
    });   


    this.simulacra = new Text( womb, {

      text: 'SIMULACRA',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),

    });

    this.me = new Text( womb, {

      text: 'ME',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),

    });

    this.nature = new Text( womb, {

      text: 'NATURE',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),

    });

    this.mountain = this.womb.nature.mountain;
    this.sunset = this.womb.nature.sunset;
    this.space = this.womb.coffee.space;


    this.mimicry = new Text( womb, {

      text: 'MIMICRY',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),

    });


    this.thief = new Text( womb, {

      text: 'THIEF',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),

    });

    this.currentEvent = 0;
    this.events = [
     
      function(){

        this.art.enter();

      },

      function(){

        this.art.exit();
        this.dragonfly.enter();

      },

      function(){

        this.dragonfly.exit();
        this.simulacra.enter();

      },

      function(){

        this.simulacra.exit();
        this.me.enter()

      },

      function(){

        this.me.exit();
        this.nature.enter();

      },

      function(){

        this.nature.exit();
        this.mountain.enter();
        
      },


      function(){

        this.mountain.exit();
        this.sunset.enter();

      },

      function(){

        this.sunset.exit();
        this.space.enter();

      },


      function(){

        this.space.exit();
        this.mimicry.enter();

      },

      function(){

        this.mimicry.exit();
        this.thief.enter();

      },

      function(){

        this.thief.exit();

      },

    ]


    this.womb.loader.loadBarAdd();

    //this.world.update = this.update.bind( this );

  }


  Physical.prototype.triggerEvent = function( e ){

    this.events[e].bind( this )();

  }


  Physical.prototype.nextEvent = function(){

    this.triggerEvent( this.currentEvent );
    this.currentEvent ++;

  }
   

  Physical.prototype.enter = function(){


  }

  Physical.prototype.exit = function(){
  
  }

  module.exports = Physical;

});
