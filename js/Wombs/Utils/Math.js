define(function(require, exports, module) {

  require( 'lib/three.min' );

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
    return Math.random() * Math.PI * 2;
  }
  // centers the random across 0
  M.randomRange = function(size){
    return ( Math.random() - .5) * size;
  }

  M.randomRangePos = function( high , low){

    if( low ){

      var range = high - low;
      var num = Math.random() * range;
      return low + num;

    } else {
    
      return Math.random() * high;

    }
  }

  M.randomFromArray = function(array){
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


  M.randomPosition = function( size , low ){

    var x = M.randomRange( size );
    var y = M.randomRange( size );
    var z = M.randomRange( size );

    return new THREE.Vector3( x , y , z );

  },

  // Gives random spherical position,  
  // can choose theta and phi distrubtions
  M.randomSpherePosition = function( size , theta , phi ){

    var r = M.randomRangePos( size );
    var t;
    var p;

    if( theta ) t = M.randomRangePos( theta );
    else        t = M.randomRangePos( Math.PI * 2 );

    if( phi )   p = M.randomRange( phi );
    else        p = M.randomRange( Math.PI * 2 );
   
    return M.toCart( r , t , p );


  }


  // Making a setter, to keep the same vector throughout
  M.setRandomVector = function( vector , high , low ){

    if( typeof low !== 'undefined' ){

      console.log(high , low );
      vector.x = M.randomRangePos( high , low );
      vector.y = M.randomRangePos( high , low );
      vector.z = M.randomRangePos( high , low );

    }else{

      var h = high || 1 ;

      vector.x = M.randomRange( h );
      vector.y = M.randomRange( h );
      vector.z = M.randomRange( h );

    }

    return vector;

  }


  // Making a setter, to keep the same vector throughout
  M.setRandomPosition = function( position , size, low ){

    position.x = M.randomRange( size );
    position.y = M.randomRange( size );
    position.z = M.randomRange( size );

    return position;

  }

  // Gives random spherical position,  
  // can choose theta and phi distrubtions
  M.randomSpherePosition = function( position ,  size , theta , phi ){

      var r = M.randomRangePos( size );
      var t;
      var p;

      if( theta ) t = M.randomRangePos( theta );
      else        t = M.randomRangePos( Math.PI * 2 );

      if( phi )   p = M.randomRange( phi );
      else        p = M.randomRange( Math.PI * 2 );
     
      position = M.toCart( r , t , p );

      return position
  }



  // Need to set because would have to be changing quaternion
  M.setRandomRotation = function( rotation ){

    rotation.x = M.randomRangePos( 2 * Math.PI );
    rotation.y = M.randomRangePos( 2 * Math.PI );
    rotation.z = M.randomRangePos( 2 * Math.PI );

    return rotation;

  }






  module.exports = M;

});
