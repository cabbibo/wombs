/*
 
   New Species:

   Testing space for new Species

   Notes:
   
  Ways in which you can help the Fractal Combo can grow:

*/

define(function(require, exports, module) {
 
  var Womb                = require( 'Womb/Womb'                  );

  var recursiveFunctions  = require( 'Utils/RecursiveFunctions'   );
  var m                   = require( 'Utils/Math'                 );

  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );


  function updateGeo(){

    
    for( var i = 0; i < this.vertices.length; i ++ ){


    }

    this.verticesNeedUpdate = true;


  }

  function NewSpecies( womb , parameters ){

    var womb = womb;


    var geometry, material, being;

    womb.loader.addToLoadBar();

     
    params = _.defaults( parameters || {} , {



    });
   

    var being   = womb.creator.createBeing();
  
    var geo = new THREE.CubeGeometry( womb.size , womb.size , womb.size );
    geo._update = updateGeo;
    var geo1 = new THREE.IcosahedronGeometry( womb.size/ 10.0 , 2 );
    geo1._update = updateGeo;

    var material = new THREE.MeshNormalMaterial({ wireframe: true });

    var mesh1 = being.addMesh( geo , material );
    var mesh2 = being.addMesh( geo1 , material );



    womb.loader.loadBarAdd();

    return being;

  }

  NewSpecies.prototype.update = function(){

  }

  NewSpecies.prototype.startSeedUpdate = function(){
    this.updateSeed = true;
  }

  NewSpecies.prototype.stopSeedUpdate = function(){
    this.updateSeed = false;
  }



  NewSpecies.prototype.enter = function(){
    this.being.enter();
  }

  NewSpecies.prototype.exit = function(){
    this.being.exit();
  }

  module.exports = NewSpecies;

});
