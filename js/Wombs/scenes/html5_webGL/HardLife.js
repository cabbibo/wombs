define(function(require, exports, module) {

  var Womb                = require( 'wombs/Womb'                       );

  var Ring                = require( 'wombs/scenes/html5_webGL/Ring'    );
  var Text                = require( 'wombs/scenes/html5_webGL/Text'    );
  var Image               = require( 'wombs/scenes/html5_webGL/Image'   );
  var Fan                 = require( 'wombs/scenes/html5_webGL/Fan'     );
  var Random              = require( 'wombs/scenes/html5_webGL/Random'  );

  function HardLife( womb, params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    this.scenes = [];

    this.why = new Text( womb , {

      size: womb.size * 1.5,
      text: 'WHY?',
      color: new THREE.Vector3( .5 , .1 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      numOf: 20,
      ratio: .5, 
      opacity: .1,
    });


    this.moneyParticles = new Random( womb , {

      size: womb.size * 1.5,
      image: '/lib/img/html5_webGL/money.png',
      color: new THREE.Vector3( .5 , .1 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      numOf: 20,
      ratio: .5, 
      opacity: .1,
    });

    this.moneyParticles.update = function(){

      this.scene.rotation.x -= .001;
      this.scene.rotation.y -= .001;
      this.scene.rotation.z += .001;

    }

    this.timeParticles = new Random( womb , {

      size: womb.size * 1.5,
      image: '/lib/img/html5_webGL/time.png',
      color: new THREE.Vector3( .5 , 0 , .5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      numOf: 50,
      ratio: .5,
      opacity: .1,


    });

    this.timeParticles.update = function(){

      this.scene.rotation.x += .001;
      this.scene.rotation.y += .001;
      this.scene.rotation.z += .001;

    }

    this.lifeIsHard = new Text( womb , {

      //font: 'G,
      text: 'Life Is Hard!',
      color: new THREE.Vector3( 1 , 0 , 3),

    });


    this.urgent = new Text( womb , {

      //font: 'G,
      text: 'URGENT',
      color: new THREE.Vector3( 3 , 0 , 0),

    });
  
    this.important = new Text( womb , {

      //font: 'G,
      text: 'IMPORTANT',
      color: new THREE.Vector3( 0 , 3 , 0),

    });

    this.keepCalm = new Image( womb , {

      image: '/lib/img/html5_webGL/keepCalm.jpg',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 300 , 300 , 50 , 50 ),
      ratio: 3/ 4.5 

    });

    this.keepCalm.scene.position.z = -50;


    this.currentEvent = 0;
    this.events = [

      function(){
      
        this.why.enter()

      },

      function(){

        this.why.exit();
        this.lifeIsHard.enter();

      },

      function(){

        this.moneyParticles.enter();

      },
      
      function(){

        this.timeParticles.enter();

      },

      function(){

        this.lifeIsHard.exit();
        this.urgent.enter();

      },

      function(){

        this.urgent.exit();
        this.important.enter();

      },

    
      function(){

        this.keepCalm.enter();

      },

      function(){

        this.important.exit();
        this.keepCalm.exit();

        var self = this;
        
        var t = setTimeout(function(){
          self.timeParticles.exit()
        } , 500 );

        var t = setTimeout(function(){
          self.moneyParticles.exit()
        } , 1000 );

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
