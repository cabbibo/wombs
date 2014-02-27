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

    this.wizard = new Image( womb , {

      image: '/lib/img/html5_webGL/wizardHat.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 3.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 )

    });
    this.scenes.push( this.wizard );

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
      geo: new THREE.PlaneGeometry( 150 , 150 , 50 , 50 ),

      color: new THREE.Vector3( 0 , 5 , 0),

    });
    this.scenes.push( this.pop );

    this.atomic = new Image( womb , {

      image: '/lib/img/html5_webGL/atoms.jpeg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    });   

    this.rayleigh = new Image( womb , {

      image: '/lib/img/html5_webGL/rayleighBenard.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    }); 

    this.ashtonKutcher = new Image( womb , {

      image: '/lib/img/html5_webGL/ashtonKutcher.jpg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 200 , 200 , 50 , 50 ),

    });  

    this.mountain = new Image( womb , {

      image: '/lib/img/html5_webGL/mountain.jpg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),

    });

    this.mountain.scene.position.x = -150;

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
    this.sunset.scene.position.x = 150;


    this.awesome = new Text( womb , {

      text: 'AWESOME',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),

    });

    this.awesome.scene.position.z = 20;


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

        this.paintBrush.enter();

      },

      function(){

        this.paintBrush.fanOut();

      },

      function(){

        this.paintBrush.exit();
        this.wizard.enter();
      },

      function(){

        this.wizard.exit();
        this.pop.enter();

      },

      function(){

        this.pop.exit();

      },

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

        this.ashtonKutcher.exit();

      },

      function(){

        this.mountain.enter();

      },

      function(){

        this.river.enter();

      },


      function(){

        this.sunset.enter();

      },



      function(){

        this.mountain.exit();
        var self = this;

        var t = setTimeout( function(){
          self.river.exit();
        }, 250 );

        var t = setTimeout( function(){
          self.sunset.exit();
        }, 500 );


        this.awesome.enter();

      },


      function(){

        this.awesome.exit();

        this.bonsai.enter();

      },

      function(){

        this.bonsai.exit();

        this.turtledBark.enter();

      },


      function(){

        this.turtledBark.exit();

      }




       

      
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
