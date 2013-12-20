define(function(require, exports, module) {

  require( 'lib/three.min'                  );
  require( 'controls/MomentumOrbitControls' );
  require( 'controls/OrbitControls'         );
  require( 'controls/TrackballControls'     );
  require( 'controls/MomentumFlyControls'   );
  require( 'controls/FlyControls'           );
  require( 'controls/LeapPaddleControls'    );
  require( 'controls/LeapSpringControls'    );
  require( 'controls/LeapFlyControls'       );

  var LeapController = require('app/utils/LeapController'    );

  function CameraController( womb , type , params ){

    this.womb  = womb;
    this.type  = type;

    if( type == 'OrbitControls' ){
      
      this.controls = new THREE.OrbitControls( this.womb.camera , this.womb.renderer.domElement , params );
    
    }else if( type == 'TrackballControls' ){
      
      this.controls = new THREE.TrackballControls( this.womb.camera , this.womb.renderer.domElement , params );
    
    }else if( type == 'MomentumOrbitControls' ){
      
      this.controls = new THREE.MomentumOrbitControls( this.womb.camera, this.womb.renderer.domElement  , params );
    
    }else if( type == 'FlyControls' ){
    
      this.controls = new THREE.FlyControls( this.womb.camera, this.womb.renderer.domElement  , params );
    
    }else if( type == 'MomentumFlyControls' ){
    
      this.controls = new THREE.MomentumFlyControls( this.womb.camera, this.womb.renderer.domElement  , params );
    
    }else if( type == 'LeapPaddleControls' ){

      if( !this.womb.leapController ){
        this.womb.leapController       = LeapController;
        this.womb.leapController.size  = this.womb.size;
      }

      this.controls = new THREE.LeapPaddleControls( this.womb.camera , this.womb.leapController , params );

    }else if( type == 'LeapSpringControls' ){

      if( !this.womb.leapController ){
        this.womb.leapController       = LeapController;
        this.womb.leapController.size  = this.womb.size;
      }


      this.controls = new THREE.LeapSpringControls( 
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


      this.controls = new THREE.LeapFlyControls( 
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
