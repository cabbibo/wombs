define(function(require, exports, module) {

  var a = require( 'js/lib/three.min.js'  ),
      b = require( 'js/lib/underscore.js' ),
      c = require( 'js/lib/stats.min.js'  );


  //var math      = require( 'app/utils/math.js'      );
  var loader            = require( 'app/utils/loader'          );
  var animator          = require( 'app/utils/animator'        );
  var AudioController   = require( 'app/audio/AudioController' );
  var World             = require( 'app/world'                 );
  var CameraController  = require( 'app/CameraController'      );
  
  function Toolbelt(){

    //this.math       = new math();
    this.loader           = new loader( this );
    this.animator         = new animator( this );
    this.audioController  = new AudioController( this );
    this.world            = new World( this );
    this.cameraController = new CameraController( this );


  }


  // This is what will be called in our loaded
  Toolbelt.prototype._start = function(){
    this.animator.start();
    this.start();
  }

  Toolbelt.prototype.start = function(){

  }

  Toolbelt.prototype._update = function(){

    this.update();

    this.audioController._update();
    this.world._update();

    this.world.render();

  }

  Toolbelt.prototype.update = function(){

  }

  return Toolbelt

});
