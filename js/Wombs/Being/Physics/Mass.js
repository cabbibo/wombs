define(function(require, exports, module) {

  var M = require('wombs/utils/Math');

  function Mass( controller , scene , object , params ){

    this.params = _.defaults( params || {}, {
      mass:           100,
    });

    this.parentScene  = scene;
    this.controller   = controller;
    this.womb         = this.controller.womb;
    this.object       = object;

    this.mass         = this.params.mass;
    this.totalForce   = new THREE.Vector3();

    this.position     = new THREE.Vector3();
    this.velocity     = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();

    this.scene        = new THREE.Object3D();
    this.springs      = [];

    this.scene.add( object );
    this.parentScene.add( this.scene );

  }



  Mass.prototype.randomPosition = function( size ){

    this.position.x = Math.randomRange( size );
    this.position.y = Math.randomRange( size );
    this.position.z = Math.randomRange( size );
    this.updatePosition();

  },

  Mass.prototype.updatePosition = function(){

    this.scene.position = this.position;

  },

  Mass.prototype._update = function(){

    this.acceleration = this.totalForce.multiplyScalar( 1 / this.mass );
    this.velocity.add( this.acceleration );
    
    //friction
    this.velocity.multiplyScalar( this.controller.friction );

    this.position.add( this.velocity );

    this.updatePosition();

    this.update();

  }

  Mass.prototype.update = function(){}


  Mass.prototype.destroySprings = function(){

    for( var i = 0; i < this.springs.length; i ++ ){

      this.springs[i].destroy();

    }

  };


  // TODO: Update this so it will always be infront of camera
  Mass.prototype.placeInFrontOfCamera = function(){

    this.position.x = this.womb.camera.position.x;
    this.position.y = this.womb.camera.position.y;
    this.position.z = this.womb.camera.position.z -  this.womb.world.size;

    this.updatePosition();

  }











  module.exports = Mass;

});
