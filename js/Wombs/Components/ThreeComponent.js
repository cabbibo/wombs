define(function(require, exports, module) {

  var Component   = require( 'Components/Component' );

  ThreeComponent.prototype = new Component();

  function ThreeComponent(){

    Component.call( this );

  }

  ThreeComponent.prototype.getThree = function(){

    return  this._three;

  }

  ThreeComponent.prototype.add = function( obj ){
    this._three.add( obj );
  }

  Three.Component.prototype.remove = function( obj ){
    this._three.remove( obj );
  }

  module.exports = ThreeComponent;

});

