define(function(require, exports, module) {

  var OrbitControls   = require('lib/OrbitControls');
  
  function CameraController( toolbelt , params ){

    this.toolbelt = toolbelt;
    this.controls = new THREE.OrbitControls( this.toolbelt.world.camera );





  }

  CameraController.prototype._update = function(){

    this.controls.update();
    this.update();

  }

  CameraController.prototype.update = function(){

  }


  return CameraController

});
