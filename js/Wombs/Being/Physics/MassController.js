define(function(require, exports, module) {

  var Mass = require( 'wombs/physics/Mass' );

  function MassController( womb , params  ){

    this.params = _.defaults( params || {}, {
      friction:       .98,
      flatten:        false,
    });

    this.womb     = womb;
    this.friction = this.params.friction;
    this.masses   = [];

  }



  MassController.prototype.createMass = function( scene , object , params ){


    var mass = new Mass( this , scene , object , params );
    this.masses.push( mass );

    return mass;



  }


  MassController.prototype.flattenMasses = function(){

    for( var i = 0 ; i < this.masses.length; i ++ ){

      this.masses[i].flattenAllSprings();

    }

  };

  MassController.prototype.destroyMasses = function(){

    this.masses = [];

  };

  
  MassController.prototype._update = function(){

    for( var i = 0 ; i < this.masses.length; i++ ){
      this.masses[i]._update();
    }

    this.update();

  };

  MassController.prototype.update = function(){}


  module.exports = MassController;

});
