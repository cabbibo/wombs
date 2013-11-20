define(function(require, exports, module) {


  // TODO: Clean UP PATH!
  
  // Gonna use some Weirrrdddd math here
  var M = require('app/utils/Math');

  // i   -> index
  // d   -> Vertices for the data of the geometry
  // gl  -> geometry length ( total number of d's )
  // fbd -> Frequency Byte Data ( the actual audio value )
  // al  -> Audio Length    ( total number of fbd's )

  var AnalyzingFunctions = {};



  AnalyzingFunctions.straightScale = function( scaleFactor ){

    var f = function( i , d , gl , fbd , al ){

      var x = d.x * ( 1 + fbd / scaleFactor );
      var y = d.y * ( 1 + fbd / scaleFactor );
      var z = d.z * ( 1 + fbd / scaleFactor );

      return new THREE.Vector3( x , y , z );

    }

    return f;

  }

  AnalyzingFunctions.straightScaleIn = function( scaleFactor ){

    var f = function( i , d , gl , fbd , al ){

      var x = d.x * ( 1 - fbd / scaleFactor );
      var y = d.y * ( 1 - fbd / scaleFactor );
      var z = d.z * ( 1 - fbd / scaleFactor );

      return new THREE.Vector3( x , y , z );

    }

    return f;

  }

  AnalyzingFunctions.zOnly = function( size , scaleFactor ){

    if( !scaleFactor ) scaleFactor = 256
    var f = function( i , d , gl , fbd , al ){

      var x = d.x
      var y = d.y 
      var z = d.z + size * (1 +fbd/scaleFactor );

      return new THREE.Vector3( x , y , z );

    }

    return f;

  }




  AnalyzingFunctions.vertexDependent = function( scaleFactor ){

    var f =  function( i , d , gl , fbd , al ){

      var r = ( fbd * fbd ) / scaleFactor;
      var t = 2 * Math.PI * ( i  / gl );
      var p = (-Math.PI) + 2 * Math.PI * ( i / gl );

      return  M.toCart( r , t , p );

    }


    return f;

  }

  module.exports = AnalyzingFunctions;

});
