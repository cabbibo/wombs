define(function(require, exports, module) {

  require( 'lib/three.min' );

  function remove(){

    this.being.removeFromScene( this );
    for( var i = 0; i < this.being.meshes.length; i++ ){

      if( this.being.meshes[i] == this ){
        this.beiing.meshes.splice( i , 1 );
      }

    }

  }

  function add(){

    this.being.addToScene( this );
    this.being.meshes.push( this );

  }

  function Mesh( being , parameters ){

    params = _.defaults( parameters || {} , {

      geometry: being.womb.defaults.geometry,
      material: being.womb.defaults.material

    });

    var mesh = new THREE.Mesh( params.geometry , params.material );
    
    if( params.geometry._update ){
      mesh.geometry._update = params.geometry._update.bind( mesh.geometry );
      being.addToUpdateArray( mesh.geometry._update );
    }

    if( params.material._update ){
      mesh.material._update = params.material._update.bind( mesh.material );
      being.addToUpdateArray( mesh.material._update );
    }

    mesh.params = params;
    mesh.being = being;

    mesh.remove = remove.bind( mesh );
    mesh.add    = add.bind( mesh );


    being.meshes.push( mesh );

    return mesh

  }

  
  module.exports = Mesh;


});
