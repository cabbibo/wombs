define(function(require, exports, module) {
  
  require( 'lib/stats.min'  );
  require( 'lib/three.min'  );
  
  function Animator( womb ){

    this.womb = womb;

    this.clock = new THREE.Clock();
    this.clock.autostart = false;

    this.stats = this.womb.interface.stats;
    
    this.requestAnimationFrame = requestAnimationFrame;

    this.delta = 0;


  }

  Animator.prototype.start = function(){
   
    if( !this.running ){
      this.running = true;
      this.clock.start();
      this.animate();
    }
  
  }

  Animator.prototype.stop = function(){

    this.running  = false;
  }

  Animator.prototype.animate = function( ){

    this.delta = this.clock.getDelta();
    this.stats.update();
    this.womb._update();
    this.update();

    if( this.running == true ){ 
      window.requestAnimationFrame( this.animate.bind( this ) );
    }

  }


  // Empty function, because it will be user defined
  Animator.prototype.update = function(){
  
  }

  return Animator

});

