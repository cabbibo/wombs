define( function( require , exports , module ){

  var a = require( 'lib/leap.min' );

  var LeapController = new Leap.Controller({enableGestures:true});


  LeapController.start = function(){

    this.connect();

  }

  LeapController.leapToScreen = function( frame , position , clamp ){

    var iBox = frame.interactionBox;

    var left = iBox.center[0] - iBox.size[0]/2;
    var top = iBox.center[1] + iBox.size[1]/2;

    var x = position[0] - left;
    var y = position[1] - top;

    x /= iBox.size[0];
    y /= iBox.size[1];

    x *= window.innerWidth;
    y *= window.innerHeight;

    if( clamp ){

      if( x > window.innerWidth )   x = window.innerWidth;
      if( x < 0 )                   x = window.innerWidth;

      if( y > window.innerHeight )  y = window.innerHeight;
      if( y < 0 )                   y = window.innerHeight;

    }

    return [ x , -y ];

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

    if( this.offset ){

      x += this.offset.x;
      y += this.offset.y;
      z += this.offset.z;

    }

    return new THREE.Vector3( x , y , z );

  }


  module.exports = LeapController;

});
