

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
    /*var a = require('a'),
        b = require('b');*/

    //var three = require('js/lib/three.min.js');
    var World           = require('app/World');
    var Toolbelt        = require('app/utils/Toolbelt');

    toolbelt = new Toolbelt();
    
    var loopsArray = [

      "audio/loops/1.mp3",
      "audio/loops/2.mp3",
      "audio/loops/3.mp3",
      "audio/loops/4.mp3",
      "audio/loops/5.mp3",
      "audio/loops/6.mp3",
      "audio/loops/7.mp3"

    ]

    toolbelt.loader.numberToLoad = loopsArray.length;
    
   
    console.log( toolbelt.world.size );
    var geo = new THREE.IcosahedronGeometry( toolbelt.world.size/20 , 2);
    var mat = new THREE.MeshNormalMaterial();

    var filterMeshes = [];


    //TODO:
    //
    // Create 'Loop object' 
    // Need to make sure that we search through all of the children objects
    // too see if this object is hovered over!
    for( var i = 0; i < loopsArray.length; i ++ ){

      var mesh = new THREE.Mesh( geo , mat );
      mesh.position.x = (i / loopsArray.length ) * toolbelt.world.size;
      toolbelt.world.scene.add( mesh );

      console.log( mesh );

      mesh.loop = toolbelt.audioController.createLoop( loopsArray[i] );

      filterMeshes.push( mesh );

    }



    toolbelt.world.raycaster.onMeshHoveredOver = function( object ){

      for( var i =0; i < filterMeshes.length; i ++ ){

        if( object === filterMeshes[i] ){
          filterMeshes[i].loop.turnOffFilter();
        }
      }

    }

    toolbelt.world.raycaster.onMeshHoveredOut = function( object ){

      for( var i =0; i < filterMeshes.length; i ++ ){

        if( object === filterMeshes[i] ){
          filterMeshes[i].loop.turnOnFilter();
        }
      }


    }

    toolbelt.world.raycaster.onMeshSwitched = function( object , oObject ){

      for( var i =0; i < filterMeshes.length; i ++ ){

        if( object === filterMeshes[i] ){
          filterMeshes[i].loop.turnOffFilter();
        }

        if( oObject === filterMeshes[i] ){
          filterMeshes[i].loop.turnOnFilter();
        }

      }


    }






    toolbelt.start = function(){

      toolbelt.audioController.playAllLoops();

    }

    toolbelt.loader.loadBarAdd();

    /*toolbelt.loader.onStart = function(){
      toolbelt.animator.start();
    }*/
  
});

