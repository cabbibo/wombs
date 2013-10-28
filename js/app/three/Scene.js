define(function(require, exports, module) {


  var Tweener = require( 'app/utils/Tweener' );

  function Scene( world , params ){
  
    this.world = world;
    this.womb = this.world.womb;

    var s = this.world.size * 10;
    console.log( s );

    this.params = _.defaults( params || {} , {

      transition:                                         'position',
      transitionTime:                                              1,
      inTarget:                       new THREE.Vector3( 0 , 0 , 0 ),
      outTarget:                      new THREE.Vector3( s , s , s ),
      onEnter: function(){ console.log('Transition In  Finished'); },
      onExit:  function(){ console.log('Transition Out Finished'); },

    });

    // Only updates if active
    this.active = false;

    this.scene = new THREE.Object3D();

    // Makes sure that we start in the right place
    if( this.params.transition == 'position' ){

      this.scene.position = this.params.outTarget.clone();

    }else if( this.params.transition == 'scale' ){

      this.scene.scale = this.params.outTarget.clone();
  
    }

    this.transitionIn = this.womb.tweener.createTween({

      object:                   this.scene,
      target:         this.params.inTarget,
      type:         this.params.transition,
      time:     this.params.transitionTime,
      callback:         this.params.onEnter
    });

    // Makes sure that when a scene is finished,
    // it will ALWAYS be removed from the womb
    // Notice that this is calling 'this' from the tween 
    // it is part of.
    this.onExit = function(){
      var s = this.params.scene;       // Getting 'this' of scene
      s.active = false;                // No longer update after it has left
      s.params.onExit();               // Call the exit functino passed through
      s.world.scene.remove( s.scene ); // Remove it from our world
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

    this.world.scene.add( this.scene );
    this.active = true;

    // makes sure that we set the initial every time
    // because if we tween in and out, our initials
    // will remain the same, and make the tween not move
    this.transitionIn.initial.x = this.params.outTarget.x;
    this.transitionIn.initial.y = this.params.outTarget.y;
    this.transitionIn.initial.z = this.params.outTarget.z;
    
    this.transitionIn.start();

  }

  Scene.prototype.exit = function(){
    
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

