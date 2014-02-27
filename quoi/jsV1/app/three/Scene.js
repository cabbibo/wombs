define(function(require, exports, module) {


  var Tweener = require( 'app/utils/Tweener' );

  function Scene( womb , params ){
  
    this.womb = womb;

    this.params = _.defaults( params || {} , {
     
      scene:                    this,
      transition:            'scale',
      transitionTime:              1,
      enterStart:       function(){},
      enterFinish:      function(){},
      exitStart:        function(){},
      exitFinish:       function(){},
      
    });


    /* Assigning in and out target based on the transition type */
    
    var s = this.womb.size;

    if( !this.params.inTarget ){

      if( this.params.transition == 'position' )
        this.params.inTarget = new THREE.Vector3( 0 , 0 , 0 );
      else if( this.params.transition == 'scale' )
        this.params.inTarget = new THREE.Vector3( 1 , 1 , 1 );
      
    }

    var vs = 0.000001; // Very small number, so scale is non zero
    if( !this.params.outTarget ){

      if( this.params.transition == 'position' )
        this.params.outTarget = new THREE.Vector3(  s ,  s ,  s );
      else if( this.params.transition == 'scale' )
        this.params.outTarget = new THREE.Vector3( vs , vs , vs );

    }

    // Only updates if active
    this.active = false;

    this.scene = new THREE.Object3D();

    // Makes sure that we start in the right place
    if( this.params.transition == 'position' ){

      this.scene.position = this.params.outTarget.clone();

    }else if( this.params.transition == 'scale' ){

      this.scene.scale = this.params.outTarget.clone();
  
    }


    this.onEnter = function(){

      var s = this.params.scene;
      s.params.enterFinish();

    }

    this.transitionIn = this.womb.tweener.createTween({
    
      scene:                          this,
      object:                   this.scene,
      target:         this.params.inTarget,
      type:         this.params.transition,
      time:     this.params.transitionTime,
      callback:               this.onEnter
    
    });

    // Makes sure that when a scene is finished,
    // it will ALWAYS be removed from the womb
    // Notice that this is calling 'this' from the tween 
    // it is part of.
    this.onExit = function(){
      var o = this.params.scene;       // Getting 'this' of scene
      o.active = false;                // No longer update after it has left
      o.params.exitFinish();           // Call the exit functino passed through
      o.womb.scene.remove( o.scene ); // Remove it from our world
    }

    this.transitionOut = this.womb.tweener.createTween({

      scene:                          this,
      object:                   this.scene,
      target:        this.params.outTarget,
      type:         this.params.transition,
      time:     this.params.transitionTime,
      callback:                 this.onExit

    });


  }

  Scene.prototype.enter = function(){

   
    this.womb.scene.add( this.scene );
    this.active = true;

    this.params.enterStart();

    // makes sure that we set the initial every time
    // because if we tween in and out, our initials
    // will remain the same, and make the tween not move
    this.transitionIn.initial.x = this.params.outTarget.x;
    this.transitionIn.initial.y = this.params.outTarget.y;
    this.transitionIn.initial.z = this.params.outTarget.z;
   
    this.transitionIn.start();

  }

  Scene.prototype.exit = function(){

    this.params.exitStart();
    
    // makes sure that we set the initial every time
    // because if we tween in and out, our initials
    // will remain the same, and make the tween not move
    if( this.params.transition == 'position' ){
      this.transitionOut.initial.x = this.scene.position.x;
      this.transitionOut.initial.y = this.scene.position.y;
      this.transitionOut.initial.z = this.scene.position.z;
    }else if( this.params.transition == 'scale' ){
      this.transitionOut.initial.x = this.scene.scale.x;
      this.transitionOut.initial.y = this.scene.scale.y;
      this.transitionOut.initial.z = this.scene.scale.z;
    }
   
    this.transitionOut.start();

  }

  Scene.prototype.update = function(){

  }

  module.exports = Scene;


});

