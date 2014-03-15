define(function(require, exports, module) {

  var Being = require( 'Being/Being' );


  function Creator( womb , params ){
    
    this.womb  = womb;

    this.beings = [];

  }

  Creator.prototype.createBeing = function( params ){
    
    var being = new Being( params );
    this.beings.push( being );

    return being; 

  }


  Creator.prototype.updateBeings = function(){

    for( var i = 0; i < this.beings.length; i++ ){

      var being = this.beings[i];
      
      if( being.active ){

        being._update();

      }

    }

  }

  Creator.prototype._update = function(){

    this.updateBeings();
    this.update();

  }

  Creator.prototype.update = function(){};

  module.exports = Creator;

});
