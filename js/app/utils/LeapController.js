define( function( require , exports , module ){

  var a = require( 'lib/leap.min' );

  var LeapController = new Leap.Controller({enableGestures:true});


  LeapController.start = function(){

    this.connect();

  }


  LeapController.leapToScene = function( frame , position , size ){

    var x = position[0] - frame.interactionBox.center[0];
    var y = position[1] - frame.interactionBox.center[1];
    var z = position[2] - frame.interactionBox.center[2];
      
    x /= frame.interactionBox.size[0];
    y /= frame.interactionBox.size[1];
    z /= frame.interactionBox.size[2];

    if( size ){
    
      x *= size;
      y *= size;
      z *= size;

    }else{

      x *= this.size;
      y *= this.size;
      z *= this.size;

    }

    return new THREE.Vector3( x , y , z );

  }


  module.exports = LeapController;

});
