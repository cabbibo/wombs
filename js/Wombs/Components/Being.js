define(function(require, exports, module) {


  var Component   = require( 'Components/Component' );
 
  Being.prototype = new Component();
  
  function Being( parent ){
 
    if( !parent ) parent = womb;
    this.parent = parent;
    
    this._init();

    this.body = new THREE.Object3D(); 

    this.mesh = new mesh();

    this.mesh.getMesh();

  }


  module.exports = Being;


});


