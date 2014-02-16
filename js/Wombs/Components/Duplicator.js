/*

   DUPLICATOR:

   A duplicator will take a mesh and create multiople copies of it,
   however, its main mesh will be the only one doing the updating,
   so that we don't have excess updates.

   Additionally, it will only add the main mesh to the meshes
   of the being, because we will only do things to the main mesh,
   all the other meshes will reflect these changes, but we only need
   to be altering a single mesh!


*/

define(function(require, exports, module) {

                           require( 'lib/three.min'             );
  var placementFunctions = require( 'Utils/PlacementFunctions'  );


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

    for( var i = 0; i < this.meshes.length; i++ ){
  
      var t = womb.tweener.createTween({
        object: this.meshes[i],
        target: this.placements[i].position,
        type: 'position'
      });

      t.start();

    }

  }

  function loopThroughMeshes( callback ){

    for( var i = 0; i < this.meshes.length; i++ ){
      callback( this.meshes[i] );
    }

  }
  function returnAll(){



  }

  function Duplicator( mesh , being ,  parameters ){

    params = _.defaults( parameters || {} , {

      numOf: 10,
      placementFunction: placementFunctions.ring,
      size: being.womb.size / 4

    });

    var meshes = [];
    
    // Make sure we add the original to the 
    // duplicator, for the sake of removal
    for( i = 0; i < params.numOf; i++ ){ 

      if( i == 0 )
        meshes.push( mesh );
      else
        meshes.push( new THREE.Mesh(  mesh.geometry , mesh.material ));
    
    }

    var duplicator = {};

    duplicator.mainMesh           = mesh;
    duplicator.being              = being;
    duplicator.meshes             = meshes;
    duplicator.placementFunction  = params.placementFunction;
    duplicator.size               = params.size;
   
    duplicator.addAll     = addAll.bind(    duplicator );
    duplicator.removeAll  = removeAll.bind( duplicator );
    duplicator.placeAll   = placeAll.bind(  duplicator );
    duplicator.tweenAll   = tweenAll.bind(  duplicator );
    duplicator.returnAll  = returnAll.bind( duplicator );

    duplicator.loopThroughMeshes = loopThroughMeshes.bind( duplicator);

    duplicator.placements = duplicator.placementFunction( params.numOf , params.size );  
    console.log( duplicator.placements );
 
    return duplicator;

  }

  
  module.exports = Duplicator;


});
