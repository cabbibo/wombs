define(function(require, exports, module) {

  var M = Math;

  M.toCart = function( r , t , p ){

    var x = r *(Math.sin(t))*(Math.cos(p));
    var y = r *(Math.sin(t))*(Math.sin(p));
    var z = r * (Math.cos(t));
    return new THREE.Vector3(x,y,z);

  }

  M.toPolar = function(x,y,z){

    var squared = (x*x)+(y*y)+(z*z);
    var radius = Math.pow(squared,.5);
    var theta = Math.acos(z/radius);
    var phi = Math.atan2(y,x);
    return new THREE.Vector3( radius , theta , phi )

  }

  M.randomRad = function (){
    return Math.random() * Math.PI * 2
  }
  // centers the random across 0
  M.randomRange = function(size){
    return ( Math.random() - .5) * size
  }

  M.randomRangePos = function(size){
    return Math.random() * size
  }

  M.getRandomFromArray = function(array){
    var i = Math.floor( Math.random() * array.length );
    return array[i];
  }

  M.arraysEqual = function(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  module.exports = M;

});
