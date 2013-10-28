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
    

  var AudioGeometry = require('app/three/AudioGeometry');

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

  womb.scene = womb.world.sceneController.createScene();
  womb.scene.filterMeshes = [];

  var text = womb.world.textCreator.createMesh( 'TESSST' );
  text.position.y = womb.world.size / 4;
  womb.scene.scene.add( text );




  //TODO:
  //
  // Create 'Loop object' 
  // Need to make sure that we search through all of the children objects
  // too see if this object is hovered over!
  for( var i = 0; i < loopsArray.length; i ++ ){

    var loop      = womb.audioController.createLoop( loopsArray[i] );
    var geometry  = new AudioGeometry( geo , loop );
    var mesh      = new THREE.Mesh( geometry.geometry , mat );

    mesh.audioGeometry = geometry;
    mesh.loop     = loop;

    mesh.position.x = (i / loopsArray.length ) * womb.world.size;
    womb.scene.scene.add( mesh );

    womb.scene.filterMeshes.push( mesh );

  }



  womb.world.raycaster.onMeshHoveredOver = function( object ){

    for( var i =0; i < womb.scene.filterMeshes.length; i ++ ){

      if( object === womb.scene.filterMeshes[i] ){
        womb.scene.filterMeshes[i].loop.turnOffFilter();
      }
    }

  }

  womb.world.raycaster.onMeshHoveredOut = function( object ){

    for( var i =0; i < womb.scene.filterMeshes.length; i ++ ){

      if( object === womb.scene.filterMeshes[i] ){
        womb.scene.filterMeshes[i].loop.turnOnFilter();
      }
    }


  }

  womb.world.raycaster.onMeshSwitched = function( object , oObject ){

    for( var i =0; i < womb.scene.filterMeshes.length; i ++ ){

      if( object === womb.scene.filterMeshes[i] ){
        womb.scene.filterMeshes[i].loop.turnOffFilter();
      }

      if( oObject === womb.scene.filterMeshes[i] ){
        womb.scene.filterMeshes[i].loop.turnOnFilter();
      }

    }


  }




  womb.scene.update = function(){

    //console.log('aas');
    var fM = womb.scene.filterMeshes;
    for( var i =0; i < womb.scene.filterMeshes.length; i++ ){

      fM[i].audioGeometry.update();
      fM[i].geometry = fM[i].audioGeometry.geometry;
      fM[i].geometry.verticesNeedUpdate = true;

    }

    //console.log( womb.scene.filterMeshes[0].geometry.vertices[0] );
    //console.log( womb.scene.filterMeshes[0].audioGeometry.geometry.vertices[0] );
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

