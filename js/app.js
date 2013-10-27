/*
 
   TODO:

    - Figure out how to connect shaders
    - Figure out how to pass audio as attributes to shader
    - Figure out how to tell if any of the children of a 'Loop Object' 
       have been hovered over
   
    - Build in tween system
    - Build in a loop object which has score, fade in and fade out properties
    - Add in fade out and fade in functions to the Audio.js

*/


define(function(require, exports, module) {
    
  var Womb    = require('app/Womb');
  womb        = new Womb();
    
  var loopsArray  = [

    "audio/loops/1.mp3",
    "audio/loops/2.mp3",
    "audio/loops/3.mp3",
    "audio/loops/4.mp3",
    "audio/loops/5.mp3",
    "audio/loops/6.mp3",
    "audio/loops/7.mp3"

  ]

  womb.loader.numberToLoad = loopsArray.length;
  
  //womb.audioController.createStream( 'audio/dontReallyCare.mp3' );
  //womb.audioController.stream.play();

  var geo = new THREE.IcosahedronGeometry( womb.world.size/20 , 2);
  var data = geo.clone();
  var mat = new THREE.MeshNormalMaterial();

  var filterMeshes = [];


  womb.scene = womb.world.sceneCreator.createScene();

  var text = womb.world.textCreator.createMesh( 'TESSST' );
  text.position.y = womb.world.size / 4;
  womb.scene.scene.add( text );


  //TODO:
  //
  // Create 'Loop object' 
  // Need to make sure that we search through all of the children objects
  // too see if this object is hovered over!
  for( var i = 0; i < loopsArray.length; i ++ ){

    var mesh = new THREE.Mesh( geo , mat );
    mesh.position.x = (i / loopsArray.length ) * womb.world.size;
    womb.scene.scene.add( mesh );

    mesh.loop = womb.audioController.createLoop( loopsArray[i] );

    filterMeshes.push( mesh );

  }



  womb.world.raycaster.onMeshHoveredOver = function( object ){

    for( var i =0; i < filterMeshes.length; i ++ ){

      if( object === filterMeshes[i] ){
        filterMeshes[i].loop.turnOffFilter();
      }
    }

  }

  womb.world.raycaster.onMeshHoveredOut = function( object ){

    for( var i =0; i < filterMeshes.length; i ++ ){

      if( object === filterMeshes[i] ){
        filterMeshes[i].loop.turnOnFilter();
      }
    }


  }

  womb.world.raycaster.onMeshSwitched = function( object , oObject ){

    for( var i =0; i < filterMeshes.length; i ++ ){

      if( object === filterMeshes[i] ){
        filterMeshes[i].loop.turnOffFilter();
      }

      if( oObject === filterMeshes[i] ){
        filterMeshes[i].loop.turnOnFilter();
      }

    }


  }




  womb.update = function(){

    //console.log( 'whoaaaa');

  }


  womb.start = function(){

    womb.audioController.playAllLoops();
    //womb.audioController.fadeOutLoops();
    //womb.audioController.stream.play();
  }

  womb.loader.loadBarAdd();

  /*womb.loader.onStart = function(){
    womb.animator.start();
  }*/
  
});

