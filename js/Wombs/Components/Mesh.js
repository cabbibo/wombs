define(function(require, exports, module) {

  require( 'lib/three.min' );
  var Component = require( 'Components/Component' );

  function Mesh( being , parameters ){

    params = _.defaults( parameters || {} , {

      geometry: being.womb.defaults.geometry,
      material: being.womb.defaults.material

    });

    THREE.Mesh.call( params.geometry , params.material );
    this.params = params;

    this.add = add.bind( mesh );
    this.remove = remove.bind( mesh );

  }

  Mesh.prototype = new Component();

  Mesh.prototype.add = function(){

    if( this.parent ){

      this.parent.addToScene( this );
      this.parent.meshes.push( this );

    }else{

      console.log( 'The following mesh has no being:' );
      console.log( this );

    }



  }

  Mesh.prototype.remove = function(){

    if( this.parent ){

      this.parent.removeFromScene( this );
      for( var i = 0; i < this.being.meshes.length; i++ ){

        if( this.parent.meshes[i] == this ){
          this.parent.meshes.splice( i , 1 );
        }

      }

    }else{
      console.log( 'The following mesh has no being:' );
      console.log( this );
    }


  }


  
  module.exports = Mesh;


});
