define(function(require, exports, module) {

  require( 'lib/three.min'                  );
 
  var MomentumOrbitControls = require( 'Womb/Camera/Controls/MomentumOrbitControls' );
  var OrbitControls         = require( 'Womb/Camera/Controls/OrbitControls'         );
  var TrackballControls     = require( 'Womb/Camera/Controls/TrackballControls'     );
  var MouseMoveControls     = require( 'Womb/Camera/Controls/MouseMoveControls'     );
  var MomentumFlyControls   = require( 'Womb/Camera/Controls/MomentumFlyControls'   );
  var FlyControls           = require( 'Womb/Camera/Controls/FlyControls'           );
  var LeapFlyControls       = require( 'Womb/Camera/Controls/LeapFlyControls'       );
  var LeapDragControls      = require( 'Womb/Camera/Controls/LeapDragControls'      );

  var LeapController        = require( 'Utils/LeapController'                       );

  function CameraController( womb , type , params ){

    this.womb  = womb;
    this.type  = type;

    if( type == 'OrbitControls' ){
      
      this.controls = new OrbitControls( this.womb.camera , this.womb.renderer.domElement , params );
    
    }else if( type == 'TrackballControls' ){
      
      this.controls = new TrackballControls( this.womb.camera , this.womb.renderer.domElement , params );
    
    }else if( type == 'MomentumOrbitControls' ){
      
      this.controls = new MomentumOrbitControls( this.womb.camera, this.womb.renderer.domElement  , params );
    
    }else if( type == 'FlyControls' ){
    
      this.controls = new FlyControls( this.womb.camera, this.womb.renderer.domElement  , params );
    
    }else if( type == 'MomentumFlyControls' ){
    
      this.controls = new MomentumFlyControls( this.womb.camera, this.womb.renderer.domElement  , params );
    
    }else if( type == 'MouseMoveControls' ){
    
      this.controls = new MouseMoveControls( this.womb.camera, this.womb.renderer.domElement  , params );
    
    }else if( type == 'LeapDragControls' ){

      if( !this.womb.leapController ){
        this.womb.leapController       = LeapController;
        this.womb.leapController.size  = this.womb.size;
      }

      this.controls = new LeapDragControls( this.womb.camera , this.womb.leapController , params );

    }else if( type == 'LeapFlyControls' ){

      if( !this.womb.leapController ){
        this.womb.leapController       = LeapController;
        this.womb.leapController.size  = this.womb.size;
      }


      this.controls = new LeapFlyControls( 
        this.womb.camera, 
        this.womb.leapController , 
        params 
      );

    }


  }

  CameraController.prototype._update = function( delta ){

    this.controls.update( delta );
    this.update();

  }

  CameraController.prototype.update = function(){

  }


  return CameraController

});
