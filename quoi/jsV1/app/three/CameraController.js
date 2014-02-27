define(function(require, exports, module) {

  require( 'lib/three.min'                  );
 
  var MomentumOrbitControls = require( 'controls/MomentumOrbitControls' );
  var OrbitControls         = require( 'controls/OrbitControls'         );
  var TrackballControls     = require( 'controls/TrackballControls'     );
  var MouseMoveControls     = require( 'controls/MouseMoveControls'     );
  var MomentumFlyControls   = require( 'controls/MomentumFlyControls'   );
  var FlyControls           = require( 'controls/FlyControls'           );
  var LeapPaddleControls    = require( 'controls/LeapPaddleControls'    );
  var LeapSpringControls    = require( 'controls/LeapSpringControls'    );
  var LeapFlyControls       = require( 'controls/LeapFlyControls'       );
  var LeapDragControls      = require( 'controls/LeapDragControls'      );

  var LeapController = require('app/utils/LeapController'    );

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
    
    }else if( type == 'LeapPaddleControls' ){

      if( !this.womb.leapController ){
        this.womb.leapController       = LeapController;
        this.womb.leapController.size  = this.womb.size;
      }

      this.controls = new LeapPaddleControls( this.womb.camera , this.womb.leapController , params );

    }else if( type == 'LeapDragControls' ){

      if( !this.womb.leapController ){
        this.womb.leapController       = LeapController;
        this.womb.leapController.size  = this.womb.size;
      }

      this.controls = new LeapDragControls( this.womb.camera , this.womb.leapController , params );

    }else if( type == 'LeapSpringControls' ){

      if( !this.womb.leapController ){
        this.womb.leapController       = LeapController;
        this.womb.leapController.size  = this.womb.size;
      }


      this.controls = new LeapSpringControls( 
        this.womb.camera, 
        this.womb.leapController , 
        this.womb.scene, 
        params 
      );

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
