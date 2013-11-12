define(function(require, exports, module) {

  require('js/lib/three.min.js');
  require('lib/OrbitControls');
  require('lib/PaddleControls');
  require('lib/LeapSpringControls');

  var LeapController      = require('app/utils/LeapController'    );

  function CameraController( world , params ){

    this.world = world;
    this.womb  = this.world.womb;

    if( this.womb.params.cameraController == 'OrbitControls' ){
      console.log('checks');
      this.controls = new THREE.OrbitControls( this.world.camera , params );
    }else if( this.womb.params.cameraController == 'PaddleControls' ){

      if( !this.womb.leapController ){
        this.womb.leapController       = LeapController;
        this.womb.leapController.size  = this.world.size;
      }

      this.controls = new THREE.PaddleControls( this.world.camera , this.womb.leapController , params );

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

    }

  }

  CameraController.prototype._update = function(){

    this.controls.update();
    this.update();

  }

  CameraController.prototype.update = function(){

  }


  return CameraController

});
