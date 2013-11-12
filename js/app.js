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
    cameraController: 'LeapSpringControls',
    objLoader:        true,
    massController:   true,
    springController: true,
    //effectComposer:   true,
  });
    
  var m = require('app/utils/Math');

  var LeapController = require( 'app/utils/LeapController' );
  //womb.stream = womb.audioController.createUserAudio();


  // Hack to keep from starting multiple time
  // TODO: Clean
  //womb.loader.numberToLoad ++;
  /*womb.stream = womb.audioController.userAudio;
  womb.audioController.userAudio.onStreamCreated = function(){
    womb.loader.loadBarAdd();
  }

  womb.audioController.gain.gain.value = 1;
*/

  womb.leapController = LeapController;

  womb.testScene = womb.world.sceneController.createScene({
    transition:'scale' 
  });


  for( var i = 0; i < 100; i ++ ){

    var testMesh = new THREE.Mesh( 
        new THREE.CubeGeometry( womb.world.size / 20 ,  womb.world.size / 20 , womb.world.size / 20 ) ,
        new THREE.MeshNormalMaterial()
    );

    testMesh.position = Math.THREE.randomPosition( 3*womb.world.size );
    Math.THREE.setRandomRotation( testMesh.rotation );

    womb.testScene.scene.add( testMesh );

  }


  womb.loader.loadBarAdd();
  womb.update = function(){

   
    //console.log( this.leapController );
    /*this.f = LeapController.frame();

    if( !this.oF ) this.oF = this.f;

    if( !this.oF.hands.length && this.f.hands.length ){

    }else if( this.oF.hands.length && !this.f.hands.length ){

     // womb.triggerEvent();
    }

    this.oF = this.f;*/

  }


  womb.start = function(){
    womb.leapController.start();
    womb.testScene.enter();
  }


});

