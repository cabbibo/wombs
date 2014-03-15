define(function(require, exports, module) {

  require( 'lib/three.min' );


  function Defaults( params ){

    for(var propt in params){

      this[propt] = params[propt];

    }

  }



  module.exports = Defaults;

});
