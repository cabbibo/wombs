define(function(require, exports, module) {


  var Tweener = require( 'Womb/Tweener' );
  
  
  function Being( params ){
  
    this.womb = womb;

    this.params = _.defaults( params || {} , {
    
      parent:                   womb,
      transition:            'scale',
      transitionTime:              1,

      mass:                        1,
      dampening:                 .99,
      position:  new THREE.Vector3(),
      velocity:  new THREE.Vector3(),


      
      
      enterStart:       function(){},
      enterFinish:      function(){},
      exitStart:        function(){},
      exitFinish:       function(){},
     
    });


    this.parent = this.params.parent;



    this.updateArray = [];


    this.meshes      = [];
    
    
    this.body           = new THREE.Object3D();

       
    // Physics
    this.body.position  = this.params.position;
    this.body.velocity  = this.params.velocity;

    this.body.mass      = this.params.mass;
    this.body.dampening = this.params.dampening;

    this.forces         = [];
    this.totalForce     = new THREE.Vector3();



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
      this.active = false;                // No longer update after it has left
      this.params.exitFinish();           // Call the exit functino passed through
      this.parent.body.remove( this.body ); // Remove it from our world
    }

    this.transitionOut = this.womb.tweener.createTween({

      body:                          this,
      object:                   this.body,
      target:        this.params.outTarget,
      type:         this.params.transition,
      time:     this.params.transitionTime,
      callback:   this.onExit.bind( this )

    });


  }

  Being.prototype.enter = function(){

   
    this.parent.body.add( this.body );
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


  Being.prototype._update = function(){

    //console.log( this.updateArray.length );
    for( var i = 0; i < this.updateArray.length; i++ ){

      //console.log( 'WHO' );
      this.updateArray[i]();

    }

    this.totalForce.set( 0 , 0 , 0 );

    for( var i = 0; i < this.forces.length; i++ ){

      this.totalForce.add( this.forces[i] );

    }
    // Dealing with forces
    this.body.position.add( this.body.velocity );
    this.body.velocity.multiplyScalar( this.body.dampening );
    this.body.acceleration = this.totalForce.multiplyScalar( this.body.mass );
    this.body.velocity.add( this.body.acceleration );
    

    this.update();

  }

  Being.prototype.update = function(){

  }

  Being.prototype.addToUpdateArray =function( callback ){

    this.updateArray.push( callback );

  }

  Being.prototype.removeMesh = function( mesh ){

    mesh.being = null;

    this.removeFromScene( mesh );
    for( var i = 0; i < this.meshes.length; i++ ){


    }

  }


  Being.prototype.addMesh = function( mesh ){
   
    // Assign this to the meshes being 
    // so we can easily keep track of it
    mesh.being = this;

    this.addToScene( mesh );
    this.meshes.push( mesh );

    if( mesh.geometry._update ){
      this.addToUpdateArray( mesh.geometry._update );
    }
    
    if( mesh.material._update ){
      console.log('CORRECT' );
      this.addToUpdateArray( mesh.material._update );
    }


  }

  Being.prototype.addToScene = function( object ){
    this.body.add( object );
  }

  Being.prototype.removeFromScene = function( object ){
    this.body.remove( object );
  }


  module.exports = Being;


});

