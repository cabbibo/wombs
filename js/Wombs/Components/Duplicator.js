define(function(require, exports, module) {

                           require( 'lib/three.min' );
  var placementFunctions = require( 'Utils/PlacementFunctions' );


  // Adds All of the Meshes to the being
  // they are part of
  function addAll(){

    this.mainMesh.add();
    for( var i = 0; i < this.meshes.length; i++ ){

      this.being.addToScene( this.meshes[i] );

    }

  }

  function removeAll(){

    this.mainMesh.remove();

    for( var i = 0; i < this.meshes.length; i++ ){

      this.being.removeFromScene( this.meshes[i] );

    }

  }

  function placeAll(){

    for( var i = 0; i < this.meshes.length; i++ ){

      this.meshes[i].position = this.placements.positions[i];
      var r = this.placements.rotations[i];
      this.meshes[i].rotation.set( r.x , r.y , r.z );

    }

  }

  function tweenAll(){


  }

  function returnAll(){


  }

  function Duplicator( mesh , parameters ){

    params = _.defaults( parameters || {} , {

      numOf: 10,
      placementFunction: placementFunctions.ring,
      size: mesh.being.womb.size / 4

    });

    var meshes = [];
    
    // Make sure we add the original to the 
    // duplicator, for the sake of removal
    meshes.push( mesh );
    
    for( i = 1; i< params.numOf; i++ ){  
      meshes.push( mesh.clone() );
    }

    var duplicator = {};

    duplicator.mainMesh           = mesh;
    duplicator.being              = mesh.being;
    duplicator.meshes             = meshes;
    duplicator.placementFunction  = params.placementFunction;
    duplicator.size               = params.size;
   
    duplicator.addAll     = addAll.bind(    duplicator );
    duplicator.removeAll  = removeAll.bind( duplicator );
    duplicator.placeAll   = placeAll.bind(  duplicator );
    duplicator.tweenAll   = tweenAll.bind(  duplicator );
    duplicator.returnAll  = returnAll.bind( duplicator );

    duplicator.placements = duplicator.placementFunction( params.numOf , params.size 
  );   
 
    return duplicator;

  }

  
  module.exports = Duplicator;


});
