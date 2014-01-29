define(function(require, exports, module) {


  var Tweener = require( 'Womb/Tweener' );


  function Being( womb , params ){
  
    this.womb = womb;

    this.params = _.defaults( params || {} , {
     
      body:                    this,
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

    this.body = new THREE.Object3D();

    // Makes sure that we start in the right place
    if( this.params.transition == 'position' ){

      this.body.position = this.params.outTarget.clone();

    }else if( this.params.transition == 'scale' ){

      this.body.scale = this.params.outTarget.clone();
  
    }


    this.onEnter = function(){

      var s = this.params.body;
      s.params.enterFinish();

    }

    this.transitionIn = this.womb.tweener.createTween({
    
      body:                          this,
      object:                   this.body,
      target:         this.params.inTarget,
      type:         this.params.transition,
      time:     this.params.transitionTime,
      callback:               this.onEnter
    
    });

    // Makes sure that when a body is finished,
    // it will ALWAYS be removed from the womb
    // Notice that this is calling 'this' from the tween 
    // it is part of.
    this.onExit = function(){
      var o = this.params.body;       // Getting 'this' of body
      o.active = false;                // No longer update after it has left
      o.params.exitFinish();           // Call the exit functino passed through
      o.womb.body.remove( o.body ); // Remove it from our world
    }

    this.transitionOut = this.womb.tweener.createTween({

      body:                          this,
      object:                   this.body,
      target:        this.params.outTarget,
      type:         this.params.transition,
      time:     this.params.transitionTime,
      callback:                 this.onExit

    });


  }

  Being.prototype.enter = function(){

   
    this.womb.scene.add( this.body );
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

  Being.prototype.exit = function(){

    this.params.exitStart();
    
    // makes sure that we set the initial every time
    // because if we tween in and out, our initials
    // will remain the same, and make the tween not move
    if( this.params.transition == 'position' ){
      this.transitionOut.initial.x = this.body.position.x;
      this.transitionOut.initial.y = this.body.position.y;
      this.transitionOut.initial.z = this.body.position.z;
    }else if( this.params.transition == 'scale' ){
      this.transitionOut.initial.x = this.body.scale.x;
      this.transitionOut.initial.y = this.body.scale.y;
      this.transitionOut.initial.z = this.body.scale.z;
    }
   
    this.transitionOut.start();

  }


  // Just incase you wanna feel more god like
  Being.prototype.live  = Being.prototype.enter;
  Being.prototype.die   = Being.prototype.exit;

  Being.prototype.update = function(){

  }

  module.exports = Being;


});

