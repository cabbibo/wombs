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
    cameraController: true,
    objLoader:        true,
    massController:   true,
    springController: true,
    //effectComposer:   true,
   //<D-r> userMediaTexture: true
  });
    

 
  var LeapController      = require('app/utils/LeapController'    );

  s1          = require( 'app/scenes/s1'        );
  s2          = require( 'app/scenes/s2'        );
  s3          = require( 'app/scenes/s3'        );
  s4          = require( 'app/scenes/s4'        );
  cP1         = require( 'app/scenes/cP1'       );
  stars1      = require( 'app/scenes/stars1'    );
  mandala1    = require( 'app/scenes/mandala1'  );
  lurker1     = require( 'app/scenes/lurker1'   );

  womb.stream = womb.audioController.createUserAudio();

  LeapController.size   = womb.world.size;
  LeapController.offset = new THREE.Vector3( 0 , 0 , - womb.world.size * 1.5 );

  // Hack to keep from starting multiple time
  // TODO: Clean
  //womb.loader.numberToLoad ++;
  womb.stream = womb.audioController.userAudio;
  womb.audioController.userAudio.onStreamCreated = function(){
    s1.init(womb);
    s2.init(womb);
    s3.init(womb);
    s4.init(womb);
    cP1.init(womb);
    stars1.init(womb);
    mandala1.init(womb);
    lurker1.init(womb);
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

      womb.triggerEvent();
    }




    this.oF = this.f;

  }

  womb.triggerEvent = function(){

    console.log( womb.sceneCall );
    womb.sceneArray[womb.sceneCall]();
    womb.sceneCall ++;
    if( womb.sceneCall == womb.sceneArray.length )
      womb.sceneCall = 0;

  }

  womb.start = function(){

 
    console.log('START' );
    var event1 = function(){
      womb.s4.enter();
      womb.cP1.enter();
      //womb.lurker1.enter();
      womb.stars1.enter();
      womb.mandala1.enter();
    }

    var event2 = function(){

      womb.s2.exit();
      womb.s3.enter();

    }

    var event3 = function(){
      womb.s1.enter();
      womb.s3.exit();
    }

    var event4 = function(){

      womb.s1.exit();
      womb.s2.enter();

    }

    womb.sceneArray.push( event1 );
    womb.sceneArray.push( event2 );
    womb.sceneArray.push( event3 );
    womb.sceneArray.push( event4 );

  
    LeapController.start();
    //womb.stream.play();
  }


});

