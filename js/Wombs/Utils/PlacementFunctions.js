define(function(require, exports, module) {

  var M = require( 'Utils/Math' );


  var PlacementFunctions = {};

  PlacementFunctions.ring = function( length , size ){

    var positions = [];
    var rotations = [];
    
    for( var i = 0; i < length; i++ ){

      var theta = 2 * Math.PI * i / length;
      var phi   = 0;


      rotations.push( new THREE.Euler( 0 , 0 , -Math.PI/2 - theta ) );

      var pos = Math.toCart( size , theta, phi )

      positions.push( new THREE.Vector3( pos.x, pos.z , pos.y ) );

    }

    return { positions : positions , rotations : rotations }

  }

  PlacementFunctions.randomShell = function( length , size ){

    var positions = [];
    var rotations = [];

    for( var i = 0; i < objectList.length; i ++ ){

      var object = objectList[i];

      var theta = 2 * Math.PI * Math.random();
      var phi   = 2 * Math.PI * ( Math.random() - .5 );

      var position = M.toCart( size , theta, phi  );

      positions.push( position );

      var pNorm = positions.clone().normalize();

      var rotation = new THREE.Euler();
      rotation.x = pNorm.x * 2 * Math.PI;
      rotation.y = pNorm.y * 2 * Math.PI;
      rotation.z = pNorm.z * 2 * Math.PI;

      rotations.push( rotation ); 

    }

    return { positions : positions , rotations : rotations }

  }

  PlacementFunctions.randomSphere = function( objectList , size ){

    for( var i = 0; i < objectList.length; i ++ ){

      var object = objectList[i];

      var theta   = 2 * Math.PI * Math.random();
      var phi     = 2 * Math.PI * ( Math.random() - .5 );
      var radius  = size * Math.random();

      object.position = M.toCart( radius , theta, phi );

    }

  }

  PlacementFunctions.random = PlacementFunctions.randomSphere;

  PlacementFunctions.randomCube = function( objectList , size ){

    for( var i = 0; i < objectList.length; i ++ ){

      var object = objectList[i];

      var theta = 2 * Math.PI * Math.random();
      var phi   = 2 * Math.PI * ( Math.random() - .5 );

      object.position = M.toCart( size , theta, phi );

    }

  }


  module.exports = PlacementFunctions;

});
