define(function(require, exports, module) {

  var Womb                = require( 'app/Womb'                       );

  var Ring                = require( 'app/scenes/html5_webGL/Ring'    );
  var Text                = require( 'app/scenes/html5_webGL/Text'    );
  var Image               = require( 'app/scenes/html5_webGL/Image'   );
  var Fan                 = require( 'app/scenes/html5_webGL/Fan'     );
  var Random              = require( 'app/scenes/html5_webGL/Random'  );

  function HardLife( womb, params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    this.scenes = [];

    this.coffeeText = new Text( womb , {

      size: womb.size * 1.5,
      text: 'COFFEE',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      numOf: 20,
      ratio: .5, 
      
    });

    this.milkText = new Text( womb , {

      size: womb.size * 1.5,
      text: 'MILK',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      numOf: 20,
      ratio: .5, 
      opacity: .1,
    });


    this.milk = new Image( womb , {

      image: '/lib/img/html5_webGL/milk.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 300 , 300 , 50 , 50 ),
      ratio: 255/375

    });

    this.milk.scene.position.z = -50;

    this.pattern1 = new Image( womb , {

      image: '/lib/img/html5_webGL/milkAndCoffee1.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      ratio: 255/375

    });


    this.dropByDrop = new Fan( womb , {

      image: '/lib/img/html5_webGL/dropByDrop.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      ratio: 640/313,
      type: 'vertical'
    });

    this.space = new Image( womb , {

      image: '/lib/img/html5_webGL/space.jpeg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 300 , 300 , 50 , 50 ),
     
    });

    this.singleMoment = new Image( womb , {

      image: '/lib/img/html5_webGL/branching.png',  
      geo: new THREE.PlaneGeometry( 40 , 40 , 50 , 50 ),
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),

    });

    this.singleMoment.scene.position.z = 10;
    this.singleMoment.scene.position.x = 20;

    this.branching = new Fan( womb , {

      image: '/lib/img/html5_webGL/branching.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      type: 'depth',
      size: womb.size

    });




    this.currentEvent = 0;
    this.events = [

      function(){

        this.womb.intro.voicePulser.enter();

      },
     
      function(){

        this.coffeeText.enter();

      },

      function(){

        this.coffeeText.exit();
        this.milkText.enter();

      },

      function(){

        this.milkText.exit();
        this.pattern1.enter();

      },

      function(){

        this.pattern1.exit();
        this.dropByDrop.enter();

      },

      function(){

        this.dropByDrop.fanOut();

      },

      function(){

        this.dropByDrop.exit();

      },

      function(){
  
        this.space.enter();

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


  HardLife.prototype.triggerEvent = function( e ){

    this.events[e].bind( this )();

  }


  HardLife.prototype.nextEvent = function(){

    this.triggerEvent( this.currentEvent );
    this.currentEvent ++;

  }
   

  HardLife.prototype.enter = function(){


  }

  HardLife.prototype.exit = function(){
  
  }

  module.exports = HardLife;

});
