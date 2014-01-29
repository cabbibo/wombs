/**
 * @author cabbibo / http://cabbibo.com
 *
 *  Move your hand like a paddle
 *
 */
define(function(require, exports, module) {

  require( 'lib/three.min' );

  THREE.LeapDragControls = function ( object , controller , params, domElement ) {

    this.object     = object;
    this.controller = controller;
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    // API
    
    this.enable = true;

    this.velocity = new THREE.Vector3();

    this.dampening = ( object.dampening !== undefined ) ? object.dampening : .95;

    this.weakDampening = .99;
    this.strongDampening = .9;

    this.size = this.controller.size;

    this.speed = .01;
  
    this.returnSpeed = .01;

    this.lookAtTarget = new THREE.Vector3();
    this.returnTarget = new THREE.Vector3( 0 , 0 , this.size );

    this.dampening = this.strongDampening;

    
    this.update = function(){

      var frame = this.controller.frame();

      if( frame.valid == false ){

        this.controller.connect();
        frame = this.controller.frame();

      }
      //console.log( frame );

      if( frame ){


        if( frame.hands.length ){

          var position   = this.controller.leapToScene( frame , frame.hands[0].palmPosition );

          var dif = position.clone();

          dif.sub( this.object.position );

          dif.multiplyScalar( this.speed );

          this.object.position.add( dif );

        }
      
      }

      var dif = this.returnTarget.clone();
      dif.sub( this.object.position );

      dif.multiplyScalar( this.returnSpeed );
      this.object.position.add( dif );

      this.object.lookAt( this.lookAtTarget );

    }


    
  }




 module.exports =  THREE.LeapDragControls;

});
