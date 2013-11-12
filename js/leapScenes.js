/*
 
   TODO:

    - Figure out how to connect shaders
    - Figure out how to pass audio as attributes to shader
    - Figure out how to tell if any of the children of a 'Loop Object' 
       have been hovered over
   
    - Build in tween system
    - Build in a loop object which has score, fade in and fade out properties
    - Add in fade out and fade in functions to the Audio.js

    - configure paths

*/
define(function(require, exports, module) {

  
  var Womb    = require('app/Womb');
  womb        = new Womb({
    cameraController: 'OrbitControls',
    objLoader:        true,
    massController:   true,
    springController: true,
    effectComposer:   true,
    //userMediaTexture: true
  });
    

 
  var LeapController      = require('app/utils/LeapController'    );

  s1          = require( 'app/scenes/s1'        );
  s2          = require( 'app/scenes/s2'        );
  s3          = require( 'app/scenes/s3'        );
  s4          = require( 'app/scenes/s4'        );
  s5          = require( 'app/scenes/s5'        );
  s6          = require( 'app/scenes/s6'        );
  s7          = require( 'app/scenes/s7'        );
  s8          = require( 'app/scenes/s8'        );
  s9          = require( 'app/scenes/s9'        );
  cP1         = require( 'app/scenes/cP1'       );
  cP2         = require( 'app/scenes/cP2'       );
  cP3         = require( 'app/scenes/cP3'       );
  stars1      = require( 'app/scenes/stars1'    );
  stars2      = require( 'app/scenes/stars2'    );
  stars3      = require( 'app/scenes/stars3'    );
  stars4      = require( 'app/scenes/stars4'    );
  stars5      = require( 'app/scenes/stars5'    );
  stars6      = require( 'app/scenes/stars6'    );
  mandala1    = require( 'app/scenes/mandala1'  );
  mandala2    = require( 'app/scenes/mandala2'  );
  mandala3    = require( 'app/scenes/mandala3'  );
  lurker1     = require( 'app/scenes/lurker1'   );

  womb.stream = womb.audioController.createUserAudio();

  LeapController.size   = womb.world.size;
  LeapController.offset = new THREE.Vector3( 0 , 0 , - womb.world.size * 1.5 );

  // Hack to keep from starting multiple time
  // TODO: Clean
  //womb.loader.numberToLoad ++;
  womb.stream = womb.audioController.userAudio;
  womb.audioController.userAudio.onStreamCreated = function(){
    womb.leapScenes = [];
    womb.prettyScenes = [];
    
    s1.init(womb);
    s2.init(womb);
    s3.init(womb);
    s4.init(womb);
    s5.init(womb);
    s6.init(womb);
    s7.init(womb);
    s8.init(womb);
    s9.init(womb);
    
    cP1.init(womb);
    cP2.init(womb);
    cP3.init(womb);
    stars1.init(womb);
    stars2.init(womb);
    stars3.init(womb);
    stars4.init(womb);
    stars5.init(womb);
    stars6.init(womb);
    mandala1.init(womb);
    mandala2.init(womb);
    mandala3.init(womb);
    lurker1.init(womb);

    womb.leapScenes.push( womb.s1 );
    womb.leapScenes.push( womb.s2 );
    womb.leapScenes.push( womb.s3 );
    womb.leapScenes.push( womb.s4 );
    womb.leapScenes.push( womb.s5 );
    womb.leapScenes.push( womb.s6 );
    womb.leapScenes.push( womb.s7 );
    womb.leapScenes.push( womb.s8 );
    womb.leapScenes.push( womb.s9 );
   
    console.log('WOMB');
    console.log( womb.stars2 );
    womb.prettyScenes.push( womb.cP1 );
    womb.prettyScenes.push( womb.cP2 );
    womb.prettyScenes.push( womb.cP3 );
    womb.prettyScenes.push( womb.stars1 );
    womb.prettyScenes.push( womb.stars2 );
    womb.prettyScenes.push( womb.stars3 );
    womb.prettyScenes.push( womb.stars4 );
    womb.prettyScenes.push( womb.stars5 );
    womb.prettyScenes.push( womb.stars6 );
    womb.prettyScenes.push( womb.mandala1 );
    womb.prettyScenes.push( womb.mandala2 );
    womb.prettyScenes.push( womb.mandala3 );
    womb.prettyScenes.push( womb.lurker1 );
    
    
    womb.loader.loadBarAdd();
  }

  womb.audioController.gain.gain.value = 0;

  womb.sceneArray = [];

  womb.sceneCall = 0;

  womb.update = function(){

    this.f = LeapController.frame();
    if( !this.oF ) this.oF = this.f;

    if( !this.oF.hands.length && this.f.hands.length ){

    }else if( this.oF.hands.length && !this.f.hands.length ){
      
      womb.triggerEvent(); // TODO, set timeout dfor this

    }




    this.oF = this.f;

  }



  womb.getEnterEvent = function( array ){

    var s = Math.randomFromArray( array );

    if( s.active == false ){
      s.enter();
    }else{
      this.getEnterEvent( array );
    }

  }


  womb.getExitEvent = function( array ){


    for( var i =0; i< array.length; i++ ){

      s = array[i];
      if( s.active == true ){

        console.log( 'exit' );
        s.exit();

      }

    }
  }


  womb.triggerEvent = function(){

    this.getExitEvent(    womb.leapScenes );
    this.getEnterEvent(   womb.leapScenes );
    this.getExitEvent(  womb.prettyScenes );
    this.getEnterEvent( womb.prettyScenes );
  
  
  }

  womb.start = function(){

    // this.getEnterEvent(   womb.leapScenes );
    // this.getEnterEvent( womb.prettyScenes );
    

    womb.s3.enter();
    womb.s5.enter();
    womb.s6.enter();
    womb.s7.enter();
    womb.s8.enter();
    womb.mandala1.enter();


    LeapController.start();
    //womb.stream.play();
  }


});

