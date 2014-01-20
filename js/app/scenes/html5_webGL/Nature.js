define(function(require, exports, module) {

  var Womb                = require( 'app/Womb'                       );

  var Ring                = require( 'app/scenes/html5_webGL/Ring'    );
  var Text                = require( 'app/scenes/html5_webGL/Text'    );
  var Image               = require( 'app/scenes/html5_webGL/Image'   );
  var Fan                 = require( 'app/scenes/html5_webGL/Fan'     );
  var Random              = require( 'app/scenes/html5_webGL/Random'  );

  function Nature( womb, params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    this.scenes = [];

    this.atomic = new Image( womb , {

      image: '/lib/img/html5_webGL/atoms.jpeg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    });   

    this.rayleigh = new Image( womb , {

      image: '/lib/img/html5_webGL/rayleighBernard.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    }); 

    this.ashtonKutcher = new Image( womb , {

      image: '/lib/img/html5_webGL/ashtonKutcher.jpg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    });  

    this.mountain = new Image( womb , {

      image: '/lib/img/html5_webGL/mountain.jpg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    });

    this.mountain.scene.position.x = -50;

    this.river = new Image( womb , {

      image: '/lib/img/html5_webGL/river.jpg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    });   

    this.sunset = new Image( womb , {

      image: '/lib/img/html5_webGL/sunset.jpg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    });   
    this.sunset.scene.position.x = 50;


    this.sunset = new Image( womb , {

      image: '/lib/img/html5_webGL/sunset.jpg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    });


    this.bonsai = new Image( womb , {

      image: '/lib/img/html5_webGL/bonsai.jpg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    });

    this.turtledBark = new Image( womb , {

      image: '/lib/img/html5_webGL/turtledBark.jpg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    });

    this.currentEvent = 0;
    this.events = [
     
      function(){

        this.atomic.enter();

      },

      function(){

        this.atomic.exit();
        this.rayleigh.enter();

      },

      function(){

        this.rayleigh.exit();
        this.ashtonKutcher.enter();

      },

      function(){

        this.pattern1.exit();
        this.dropByDrop.enter();

      },

      function(){

        this.dropByDrop.fanOut();

      },

      function(){
  
        this.space.enter();
        this.dropByDrop.exit();

      },

     
      function(){
  
        this.space.exit();
        this.singleMoment.enter();

      },


      function(){
  
        //this.space.enter();
        this.branching.enter();

      },

      function(){
  
        this.branching.fanOut();

      },

      function(){
  
        this.singleMoment.exit();
        this.branching.exit();

      },



      
    ]


    this.womb.loader.loadBarAdd();

    //this.world.update = this.update.bind( this );

  }


  Nature.prototype.triggerEvent = function( e ){

    this.events[e].bind( this )();

  }


  Nature.prototype.nextEvent = function(){

    this.triggerEvent( this.currentEvent );
    this.currentEvent ++;

  }
   

  Nature.prototype.enter = function(){


  }

  Nature.prototype.exit = function(){
  
  }

  module.exports = Nature;

});
