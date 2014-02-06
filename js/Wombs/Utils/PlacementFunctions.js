define(function(require, exports, module) {

  var M = require( 'Utils/Math' );


  var PlacementFunctions = {};

  PlacementFunctions.rings = function( objectList , size ){

    for( var i = 0; i < objectList.length; i ++ ){

      var object = objectList[i];

      var theta = 2 * Math.PI * i / objectList.length;
      var phi   = 0;

      object.position = Math.toCart( size , theta, phi );

    }

  }

  PlacementFunctions.randomShell = function( objectList , size ){

    for( var i = 0; i < objectList.length; i ++ ){

      var object = objectList[i];

      var theta = 2 * Math.PI * Math.random();
      var phi   = 2 * Math.PI * ( Math.random() - .5 );

      object.position = M.toCart( size , theta, phi );

    }

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
