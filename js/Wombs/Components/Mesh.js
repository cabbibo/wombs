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
      console.log( 'The following mesh has no being:' );
      console.log( this );

    }

  }

  function add(){

    if( this.being ){

      this.being.addToScene( this );
      this.being.meshes.push( this );

    }else{

      console.log( 'The following mesh has no being:' );
      console.log( this );

    }

  }

  function Mesh( being , parameters ){

    params = _.defaults( parameters || {} , {

      geometry: being.womb.defaults.geometry,
      material: being.womb.defaults.material

    });

    var mesh = new THREE.Mesh( params.geometry , params.material );


    mesh.being  = being;
    mesh.params = params;

    mesh.add = add.bind( mesh );
    mesh.remove = remove.bind( mesh );

    return mesh

  }

  
  module.exports = Mesh;


});
