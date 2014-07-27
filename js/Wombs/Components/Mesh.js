define(function(require, exports, module) {

  require( 'lib/three.min' );
  var Component = require( 'Components/Component' );

  Mesh.prototype = new Component();
  
  function Mesh( geometry , material ){
    
    this._three = new THREE.Mesh( geometry , material );
   
  }

  module.exports = Mesh;


});
