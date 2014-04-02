define(function(require, exports, module) {

  require( 'lib/three.min' );
  var ThreeComponent = require( 'Components/ThreeComponent' );

  Mesh.prototype = new ThreeComponent();
  
  function Mesh( geometry , material ){

    ThreeComponent.call( this );
    
    this._three = new THREE.Mesh( geometry , material );
   

  }

  module.exports = Mesh;


});
