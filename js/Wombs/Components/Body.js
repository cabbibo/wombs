define(function(require, exports, module) {

  var Component = require( 'Components/Component' );

  Body.prototype = new Component();
  
  function Body( params ){

    this.backup = new THREE.Object3D();

    this.combine( this.backup );

    this._init();
    
  }


  module.exports = Body;

});
