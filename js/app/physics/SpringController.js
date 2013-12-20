define(function(require, exports, module) {

  var Spring = require( 'app/physics/Spring' );

   /*
   
     CONSTRUCTOR

  */

  function SpringController( womb, massController , params ){


    this.womb = womb;

    this.params = _.defaults( params || {}, {
      massController:     massController,
      staticLength:       this.womb.size / 4,
      springColor:        0xaaaaaa,
      flatten:            false
    });


    this.springs  = [];
    this.masses   = [];

    // Making the two can communicate to each other
    this.massController = this.womb.massController;

    // Lets us know if these springs should flatten the system
    this.flatten        = this.params.flatten;

    // Making some frequently used variables easier to access
    this.masses         = this.womb.massController.masses;

  }


  /*
   
     PROTOTYPE

  */
  
  SpringController.prototype._update = function(){

    for( var i = 0 ; i < this.springs.length; i ++ ){

      this.springs[i].update();

    }

    this.update();

  }

  SpringController.prototype.update = function(){};


  SpringController.prototype.createSpring = function( mass1 , mass2 , k , l ){

    if( !k ) k = 2;
    if( !l ) l = this.params.staticLength;

    var spring = new Spring( this , {

      m1:mass1,
      m2:mass2,
      k:k,
      l:l

    });

    this.springs.push( spring );

  }

  SpringController.prototype.createSpringsToMass = function( mass , masses , params ){

    var params = _.defaults( params || {}, {

      staticLength: this.params.staticLength,
      color:        this.params.springColor,
      flatten:      this.params.flatten,
      position:     this.params.position,
      k:            1

    });

    for( var i = 0; i < masses.length; i++ ){

      var spring = new Spring( 
          this,
          {
            m1:           mass,
            m2:           masses[i],
            k:            params.k,
            l:            params.staticLength,
            color:        0xaa0000,
          }
      );


      this.springs.push( spring );

    }



  }


  SpringController.prototype.createSpringWeb = function( masses , params ){

    var params = _.defaults( params || {}, {

      staticLength: this.params.staticLength,
      color:        this.params.springColor,
      flatten:      this.params.flatten,
      position:     this.params.position,
      k:            1

    });

    for( var i = 0; i < masses.length; i++ ){

      var m1 = masses[i];

      for( var j = i; j < masses.length; j++ ){

        var m2 = masses[j];

        var spring = new Spring(
          this,
          {
            m1:           m1,
            m2:           m2,
            k:            params.k,
            l:            params.staticLength,
            color:        0xaa0000,
          }
        );


        this.springs.push( spring );


      }

    }

  };

  SpringController.prototype.flattenSpring = function( i ) {

    this.springs[i].makeFlat();

  };


  SpringController.prototype.flattenAllSprings = function(){

    for( var i = 0; i < this.springs.length; i ++ ){

      this.flattenSpring( i );

    }

  };


  SpringController.prototype.destroyAllSprings = function(){

    // Creates a temporary array of all the springs
    // so we can loop through it instead of our spring array
    // TODO: Figure out if this is the right way to do it
    var tempArray = [];

    for( var i = 0; i < this.springs.length; i++ ){
      tempArray.push( this.springs[i] );
    }

    for( var i = 0; i < tempArray.length; i++ ){
      tempArray[i].destroy();
    }

    //this.springs = [];

  };


  SpringController.prototype.destroySpring = function( i ){

    this.springs[ i ].destroy();

  };


    // Checks for cut springs by seen if they have been crossed
  SpringController.prototype.checkCutSprings = function( pos , oPos ){

    for( var i = 0 ; i < this.springs.length; i ++){

      this.springs[i].checkIfCut( pos , oPos );

    }

  }


  module.exports = SpringController;

});
