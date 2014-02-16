define(function(require, exports, module) {

  require( 'lib/three.min' );

  function remove(){

    if( this.being ){

    this.being.removeFromScene( this );
    for( var i = 0; i < this.being.meshes.length; i++ ){

      if( this.being.meshes[i] == this ){
        this.being.meshes.splice( i , 1 );
      }

    }

    }else{
      console.log( 'The following particles has no being:' );
      console.log( this );

    }

  }

  function add(){

    if( this.being ){

      console.log( 'add to Being' );
      console.log( this.being );
      this.being.addToScene( this );
      this.being.meshes.push( this );

    }else{

      console.log( 'The following particles has no being:' );
      console.log( this );

    }

  }

  function Particles( being , parameters ){

    params = _.defaults( parameters || {} , {

      geometry: being.womb.defaults.geometry,
      material: being.womb.defaults.material

    });

    var particles = new THREE.ParticleSystem( params.geometry , params.material );


    particles.being  = being;
    particles.params = params;

    particles.add = add.bind( particles );
    particles.remove = remove.bind( particles );

    return particles

  }

  
  module.exports = Particles;


});
