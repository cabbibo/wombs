define(function(require, exports, module) {

  require( 'lib/three.min'                  );
  require( 'controls/MomentumOrbitControls' );
  require( 'controls/OrbitControls'         );
  require( 'controls/MomentumFlyControls'   );
  require( 'controls/FlyControls'           );
  require( 'controls/LeapPaddleControls'    );
  require( 'controls/LeapSpringControls'    );
  require( 'controls/LeapFlyControls'       );

  var LeapController = require('app/utils/LeapController'    );

  function CameraController( world , params ){

    this.world = world;
    this.womb  = this.world.womb;

    if( this.womb.params.cameraController == 'OrbitControls' ){
      
      this.controls = new THREE.OrbitControls( this.world.camera , params );
    
    }else if( this.womb.params.cameraController == 'MomentumOrbitControls' ){
      
      this.controls = new THREE.MomentumOrbitControls( this.world.camera , params );
    
    }else if( this.womb.params.cameraController == 'FlyControls' ){
    
      this.controls = new THREE.FlyControls( this.world.camera , params );
    
    }else if( this.womb.params.cameraController == 'MomentumFlyControls' ){
    
      this.controls = new THREE.MomentumFlyControls( this.world.camera , params );
    
    }else if( this.womb.params.cameraController == 'LeapPaddleControls' ){

      if( !this.womb.leapController ){
        this.womb.leapController       = LeapController;
        this.womb.leapController.size  = this.world.size;
      }

      this.controls = new THREE.LeapPaddleControls( this.world.camera , this.womb.leapController , params );

    }else if( this.womb.params.cameraController == 'LeapSpringControls' ){

      if( !this.womb.leapController ){
        this.womb.leapController       = LeapController;
        this.womb.leapController.size  = this.world.size;
      }


      this.controls = new THREE.LeapSpringControls( 
        this.world.camera, 
        this.womb.leapController , 
        this.world.scene , 
        params 
      );

    }else if( this.womb.params.cameraController == 'LeapFlyControls' ){

      if( !this.womb.leapController ){
        this.womb.leapController       = LeapController;
        this.womb.leapController.size  = this.world.size;
      }


      this.controls = new THREE.LeapFlyControls( 
        this.world.camera, 
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
