define(function(require, exports, module) {

  var a               = require('js/lib/three.min.js');
  var OrbitControls   = require('lib/OrbitControls');
  
  function CameraController( world , params ){

    this.world = world;
    this.controls = new THREE.OrbitControls( this.world.camera );

  }

  CameraController.prototype._update = function(){

    this.controls.update();
    this.update();

  }

  CameraController.prototype.update = function(){

  }


  return CameraController

});
