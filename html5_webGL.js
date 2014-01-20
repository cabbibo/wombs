define(function(require, exports, module) {

  var Womb                = require( 'app/Womb'                       );

  var Ring                = require( 'app/scenes/html5_webGL/Ring'    );
  var Text                = require( 'app/scenes/html5_webGL/Text'    );
  var Image               = require( 'app/scenes/html5_webGL/Image'   );
  var Fan                 = require( 'app/scenes/html5_webGL/Fan'     );
  var Random              = require( 'app/scenes/html5_webGL/Random'  );


  /*
   
     Create our womb

  */
  var link = 'http://soundcloud.com/';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    modelLoader:      true,
    textCreator:      true,
    raycaster:        true,
    title:            'Turbulence: Finding and Making your Happy Place',
    link:             link, 
    summary:          info,
    gui:              true,
    imageLoader:      true,
    stats:            true,
    color:            '#000000',
    failureVideo:     84019684,
    test: true,
    size:             400
  });

  womb.stream = womb.audioController.createUserAudio();

  womb.audioController.gain.gain.value = 0;

  
  var init = function(){
   

    /*
    
       INTRO SCENE

    */

    womb.voicePulser = new Ring( womb , {
      numOf: 10
    });
    womb.voicePulser.scene.rotation.x = Math.PI / 2;

    womb.happy = new Text( womb , {

      text: 'HAPPY',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),

    });


    womb.wizard = new Image( womb , {

      image: '/lib/img/html5_webGL/wizardHat.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 3.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 )

    });

    womb.superman = new Image( womb , {

      image: '/lib/img/html5_webGL/supermanLogo.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 )

    });

    womb.paintBrush = new Fan( womb , {

      size: womb.size * 1.5,
      image: '/lib/img/html5_webGL/paintBrush.png',
      color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      numOf: 10,
      ratio: .556 

    });

    womb.pop = new Text( womb , {

      font: 'Comic Sans MS',
      text: 'POP!',
      color: new THREE.Vector3( 0 , 5 , 0),

    });

    womb.badArt = new Text( womb , {

      //font: 'G,
      text: 'This is Bad Art!',
      color: new THREE.Vector3( 1 , 1 , 0),

    });



    /*
      
       HARD LIFE SCENE
     
     */

    womb.lifeParticles1 = new Random( womb , {

      size: womb.size * 1.5,
      image: '/lib/img/html5_webGL/money.png',
      color: new THREE.Vector3( .5 , .1 , 1.5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      numOf: 20,
      ratio: .5, 
      opacity: .1,
    });

    womb.lifeParticles1.update = function(){

      this.scene.rotation.x -= .001;
      this.scene.rotation.y -= .001;
      this.scene.rotation.z += .001;

    }

    womb.lifeParticles2 = new Random( womb , {

      size: womb.size * 1.5,
      image: '/lib/img/html5_webGL/time.png',
      color: new THREE.Vector3( .5 , 0 , .5 ),
      geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 ),
      numOf: 50,
      ratio: .5,
      opacity: .1,


    });

    womb.lifeParticles2.update = function(){

      this.scene.rotation.x += .001;
      this.scene.rotation.y += .001;
      this.scene.rotation.z += .001;

    }

    womb.lifeIsHard = new Text( womb , {

      //font: 'G,
      text: 'Life Is Hard!',
      color: new THREE.Vector3( 1 , 0 , 3),

    });
  
    womb.lifeIsHard.enter();





  }

  // Set timeout for text loading
  var t = setTimeout( init , 1000 );

  womb.stream.onStreamCreated =  function(){
  
  
  }

  womb.loader.loadBarAdd();
  
  womb.update = function(){

  }

  womb.start = function(){

  }

  womb.raycaster.onMeshHoveredOver = function(){

  }

  womb.raycaster.onMeshHoveredOut = function(){

  }
  

});
