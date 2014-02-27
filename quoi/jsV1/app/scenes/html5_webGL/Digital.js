define(function(require, exports, module) {

  var Womb                = require( 'app/Womb'                       );

  var AntiSerpenski       = require( 'app/scenes/html5_webGL/AntiSerpenski' );
  var Ring                = require( 'app/scenes/html5_webGL/Ring'    );
  var Text                = require( 'app/scenes/html5_webGL/Text'    );
  var Image               = require( 'app/scenes/html5_webGL/Image'   );
  var Fan                 = require( 'app/scenes/html5_webGL/Fan'     );
  var Random              = require( 'app/scenes/html5_webGL/Random'  );
  var Head                = require( 'app/scenes/html5_webGL/Head'  );

  function Digital( womb, params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    this.scenes = [];


    this.ferns = new Image( womb , {

      image: '/lib/img/html5_webGL/spiralFern.jpg',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      ratio: 200/307

    });

    this.ferns.scene.position.x = -80;

    this.flowers = new Image( womb , {

      image: '/lib/img/html5_webGL/sunflower.jpeg',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      ratio:60/45

    });

    this.flowers.scene.position.x = 80;


    /*this.recursive = new AntiSerpenski( womb , {
      
    });*/


    this.textureLimit = new Image( womb , {

      image: '/lib/img/moon_1024.jpg',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      ratio:60/45

    });   

    this.spheres = new Random( womb , {

      geo: new THREE.SphereGeometry( 5 , 5 , 5 ),
      numOf: 30,
       size: 400,
      color:  new THREE.Vector3( 2.5 , 0.5 , 1.5 ),

      image: '/lib/img/moon_1024.jpg'


    });

    this.cubes = new Random( womb , {

      geo: new THREE.CubeGeometry( 10 , 10 , 10 ),
      numOf: 30,
      size: 400,
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),
      image: '/lib/img/moon_1024.jpg'

    });

    // UNSEEN: SHOW STATS
    //

    this.alteredQualia = new Head( womb , {

      size: 50
    });


    this.currentEvent = 0;

    this.events = [
     
      function(){

        this.ferns.enter();

      },

      function(){

        this.flowers.enter();

      },


      function(){

        this.flowers.exit();
        this.ferns.exit();

        //this.recursive.enter();

      },

      function(){

        //this.recursive.exit();

        this.textureLimit.enter()

      },

      function(){

        this.textureLimit.exit();
        this.spheres.enter();

      },

      function(){

        this.cubes.enter();
        
      },


      function(){

        this.alteredQualia.enter();

      },

    
      function(){

        this.spheres.exit();
        this.cubes.exit();

      },

      function(){

        this.alteredQualia.exit();

      }

    ]


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
