define(function(require, exports, module) {

  /*
     CONSTRUCTOR
  */

  function Spring( controller , params ){

    this.controller = controller;
    this.womb       = this.controller.womb;

    // If this is the first spring created, make sure that the controller has 
    // spring id
    if( !this.controller.springId ) this.controller.springId = 0;
    this.id = this.controller.springId;
    this.controller.springId ++;

    this.params = _.defaults( params || {}, {
   
      k:            1,
      l:            this.womb.world.size/10,
      flatten:      false,
      color:        0xaaaaaa,
      linewidth:    10,
      snapStrength: 100,
      showSpring:   true,
      scene:        this.womb.world.scene
    
    });

    this.m1         = this.params.m1;                     // Mass 1
    this.m2         = this.params.m2;                     // Mass 2

    this.k          = this.params.k;                      // Spring Constant
    this.l          = this.params.l;                      // Static Length
    this.flatten    = this.params.flatten;                // flattens


    this.scene      = this.params.scene;
    if( this.params.showSpring ){

      this.geometry   = new THREE.Geometry();

      this.geometry.vertices.push( new THREE.Vector3() );
      this.geometry.vertices.push( new THREE.Vector3() );

      this.material   = new THREE.LineBasicMaterial({ 
        color:      this.params.color, 
        linewidth:  this.params.linewidth, 
      });

      this.scene.add( this.line );

    }

    // Makes sure we know the springs that each mass has
    this.m1.springs.push( this );
    this.m2.springs.push( this );

  }




  /*

     PROTOTYPE
  
  */
  Spring.prototype.update = function(){

    this.geometry.vertices[0] = this.m1.position;
    this.geometry.vertices[1] = this.m2.position;
    
    this.geometry.verticesNeedUpdate = true;
    
    this.applyForce();

    // If Dudes need to be flattened,
    // flatten them!
    if( this.flatten ){

      this.m1.flatten();
      this.m2.flatten();
    
    }

  };


  Spring.prototype.getDistance = function(){

    var d = new THREE.Vector3();
    d.subVectors( this.m1.position,  this.m2.position );

    return d

  };

  Spring.prototype.getX = function( d ){

    var x = d.length() - this.l;

    return x;

  };


  Spring.prototype.getForce = function(){

    var d = this.getDistance(); 

    var x = this.getX( d );


    // Get the with the proper direction
    var F = d.normalize().multiplyScalar( x ).multiplyScalar( this.k );

    // Multiply by Spring Constant
   // F.multiplyScalar( this.k );

    return F;


  };

  // Hooke's law !
  Spring.prototype.applyForce = function(){

    var F = this.getForce();

    this.m1.totalForce.sub( F );
    this.m2.totalForce.add( F );

    
  },


  Spring.prototype.destroy = function(){

    // Removes the spring from the scene
    this.scene.remove( this.line );
    

    // Faking a massive spring getting cut
    var F = this.getForce();

    F.multiplyScalar( -this.params.snapStrength / this.m1.controller.friction );

    this.m1.totalForce = F;
    this.m2.totalForce = F;

    this.m1.update();
    this.m2.update();



    var i = this.controller.springs.indexOf( this );
    this.controller.springs.splice( i , 1 );

    var i = this.m1.springs.indexOf( this );
    this.m1.springs.splice( i , 1 );

    var i = this.m2.springs.indexOf( this );
    this.m2.springs.splice( i , 1 );



  };


  Spring.prototype.makeFlat = function(){

    this.flatten = true;

  };




  // Checks to see if this spring has been cut
  Spring.prototype.checkIfCut = function( pos , oPos ){


    var dif1 = new THREE.Vector3().subVectors( 
      this.geometry.vertices[1],
      this.geometry.vertices[0]
    );

    var dif2 = dif1.clone();

    var dot1 = dif1.dot( pos );
    var dot2 = dif2.dot( oPos );

    //console.log( dot1 + " , " + dot2 );

    var sign1 = dot1 > 0;
    var sign2 = dot2 > 0;

    var dif  =  sign1 && !sign2;
    var dif2 = !sign1 &&  sign2;

    if( dif || dif2 )
      this.destroy();

  }

  module.exports = Spring;

});





