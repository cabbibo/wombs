define(function(require, exports, module) {

  // d   -> Vertices for the data of the geometry
  // gl  -> geometry length ( total number of d's )
  // fbd -> Frequency Byte Data ( the actual audio value )
  // al  -> Audio Length    ( total number of fbd's )

  var AnalyzingFunctions = {};



  AnalyzingFunctions.straightScale = function( scaleFactor ){

    var f = function( d , gl , fbd , al ){

      var x = d.x * ( 1 + fbd / scaleFactor );
      var y = d.y * ( 1 + fbd / scaleFactor );
      var z = d.z * ( 1 + fbd / scaleFactor );

      return new THREE.Vector3( x , y , z );

    }

    return f;

  }

  module.exports = AnalyzingFunctions;

});
