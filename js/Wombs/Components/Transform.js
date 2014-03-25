define(function(require, exports, module) {

  require( 'lib/three.min' );
  var SceneComponent = require( 'Components/SceneComponent' );

  Mesh.prototype = new SceneComponent();
  
  function Mesh( geometry , material ){

    this.geometry = geometry;
    this.material = material;
    this.body = new THREE.Mesh( geometry , material );
    this.position = this.body.position;



    // Initializing neccesary prototype objects 
    this._init();
    console.log( this );
    
    
  }


  Mesh.prototype.onAdd = function(){

    this.add();

  }

  Mesh.prototype.add = function(){

    console.log( 
    if( this.parent ){
      this.parent.addToBody( this.body );
    }else{
      console.log( 'The following mesh has no being:' );
      console.log( this );
    }


  }

  Mesh.prototype.remove = function(){

    if( this.parent ){

      this.parent.removeFromBody( this.body );
      

    }else{
      console.log( 'The following mesh has no being:' );
      console.log( this );
    }

  }

  Mesh.prototype.translate = function(x,y,z){

      this.position.add( new THREE.Vector3( x , y , z ) );

  }

  
  module.exports = Mesh;


});
