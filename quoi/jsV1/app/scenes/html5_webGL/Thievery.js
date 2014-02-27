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


    this.threejs = new Text( womb , {

      text: 'THREE.JS',
      geo: new THREE.PlaneGeometry( 150 , 150 , 50 , 50 ),


    })

    this.threejs.scene.position.z = 10;

    var width = 70;
    var height = 60;

    this.mrDoobCommits = new Image( womb , {

      image: '/lib/img/html5_webGL/mrDoobCommits.png',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 40 , 40 , 50 , 50 ),
       ratio: 900/360 

    }); 

    this.mrDoobCommits.scene.position.y = height;
    this.mrDoobCommits.scene.position.x = -width;

    this.alteredqCommits = new Image( womb , {

      image: '/lib/img/html5_webGL/alteredqCommits.png',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 40 , 40 , 50 , 50 ),
       ratio: 900/360 

    });
    this.alteredqCommits.scene.position.y = height;
    this.alteredqCommits.scene.position.x = width;


    this.bhoustonCommits = new Image( womb , {

      image: '/lib/img/html5_webGL/bhoustonCommits.png',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 40 , 40 , 50 , 50 ),
      ratio: 900/360 


    });

   // this.bhoustonCommits.scene.postion.y = -height;
    this.bhoustonCommits.scene.position.x = -width;


    this.zz85Commits = new Image( womb , {

      image: '/lib/img/html5_webGL/zz85Commits.png',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 40 , 40 , 50 , 50 ),
       ratio: 900/360 

    });

    //this.alteredqCommits.scene.postion.y = -height;
    this.zz85Commits.scene.position.x = width;


    this.gero3Commits = new Image( womb , {

      image: '/lib/img/html5_webGL/gero3Commits.png',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 40 , 40 , 50 , 50 ),
      ratio: 900/360 

    }); 
    
    this.gero3Commits.scene.position.y = -height;
    this.gero3Commits.scene.position.x = -width;


    this.westLangleyCommits = new Image( womb , {

      image: '/lib/img/html5_webGL/westLangleyCommits.png',
      color: new THREE.Vector3( 2.5 , 0.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 40 , 40 , 50 , 50 ),
      ratio: 900/360 

    }); 
    
    this.westLangleyCommits.scene.position.y = -height;
    this.westLangleyCommits.scene.position.x = width;


    this.world = new World( womb , {


    });

    this.stars = new Stars( womb , {


    });




    this.currentEvent = 0;

    this.events = [
    
      function(){

        this.threejs.enter();

      },

      function(){

        this.threejs.exit();
        this.mrDoobCommits.enter();

      },

      function(){

        this.alteredqCommits.enter();

      },

      function(){

        this.bhoustonCommits.enter();

      },

      function(){

        this.zz85Commits.enter();

      },

      function(){

        this.gero3Commits.enter();

      },

      function(){

        this.westLangleyCommits.enter();

      },


      function(){

        var self = this;

        var t = setTimeout( function(){
          self.mrDoobCommits.exit();
        } , 100 );
         var t = setTimeout( function(){

        self.bhoustonCommits.exit();

        } , 200 );

         var t = setTimeout( function(){

        self.alteredqCommits.exit(); 

        } , 400 );

        var t = setTimeout( function(){

        self.zz85Commits.exit();

        } , 600 );

         var t = setTimeout( function(){

        self.gero3Commits.exit();

        } , 800 );

         var t = setTimeout( function(){

        self.westLangleyCommits.exit();

        } , 1000 );


      },


      function(){

        this.world.enter();

      },

      function(){

        this.stars.enter();

      },

      function(){

        this.world.exit();
        this.stars.exit();

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
