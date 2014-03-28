define(function(require, exports, module) {

  require( 'lib/three.min' );
  var SceneComponent = require( 'Components/SceneComponent' );

  Mesh.prototype = new SceneComponent();
  
  function Mesh( geometry , material ){

    this.body = new THREE.Mesh( geometry , material );

    this.combine( this.body );
    console.log( 'THIS' );
    console.log( this );

    //THREE.Mesh.apply( this ,  [ geometry , material ] );


    // Initializing neccesary prototype objects 
    this._init();
    console.log( this );
    
    
  }

  //Mesh.prototype = new SceneComponent();



  Mesh.prototype.onAdd = function(){

    this.addToBody();

  }

  Mesh.prototype.addToBody = function(){

    if( this.parent ){
      this.parent.addToBody( this.body );
    }else{
      console.log( 'The following mesh has no being:' );
      console.log( this );
    }


  }

  Mesh.prototype.removeFromBody = function(){

    if( this.parent ){

      this.parent.removeFromBody( this.body );
      

    }else{
      console.log( 'The following mesh has no being:' );
      console.log( this );
    }

  }

  /*Mesh.prototype.translate = function(x,y,z){

      this.body.position.add( new THREE.Vector3( x , y , z ) );

  }*/

  
  module.exports = Mesh;


});
