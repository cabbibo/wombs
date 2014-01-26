define( function( require , exports , module) {

  function GameObject( womb , params ){


    this.womb       = womb;
    this.womb.world = womb.world;


    this.params = _.defaults( params || {} , {
     
      intersector:  false,
      mass:         false,
      spring:       false,
      gravity:      false,
      test:         false,
      

    });

    // TODO: Create intersector, which uses raycastt
    // to fire an event on hover over , on over out, and on click
    if( this.params.intersector ){
      this.intersector = new Intersector( this );
    }

    // TODO: create mass controller
    this.mass = new Mass( this );

    this.scene = new THREE.Object3D();



  }

  GameObject.prototype.addToScene = function(){

    this.world.scene.add( this.scene );

  }

  GameObject.prototype.removeFromScene = function(){

    this.world.scene.remove( this.scene );

  }



  module.exports = GameObject

});
