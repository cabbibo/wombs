/*

   DUPLICATOR:

   A emitter will take a mesh and create multiople copies of it,
   however, its main mesh will be the only one doing the updating,
   so that we don't have excess updates.

   Additionally, it will only add the main mesh to the meshes
   of the being, because we will only do things to the main mesh,
   all the other meshes will reflect these changes, but we only need
   to be altering a single mesh!


*/

define(function(require, exports, module) {

                            require( 'lib/three.min'             );
  var M                   = require( 'Utils/Math'  );
  var placementFunctions  = require( 'Utils/PlacementFunctions'  );
  
  function update(){

    this.meshes.length;
    this.timer += this.emissionRate;
    if( this.timer >= 100 ){

      //console.log( 'emit' );
      if( this.emitting )
        this.emit();

      this.timer -= 100;

    }


    for( var i = 0; i < this.meshes.length; i++ ){

      var mesh = this.meshes[i];

      mesh.lifetime ++;

      if( mesh.lifetime > this.lifetime ){
      
        //console.log( 'YO' );
        this.meshes.splice( i , 1 );
        //console.log( this.meshes.length );
        i --; // Makes sure we don't skip a mesh update

        this.remove( mesh );

        continue;
  
      }

      this.updatePerMesh( mesh );
      mesh.position.add( mesh.velocity );
      mesh.velocity.multiplyScalar( this.friction );
      mesh.scale.multiplyScalar( this.decayRate );


    }

  }

  function burst( amountOfParticles ){

    for( var i = 0; i < amountOfParticles; i ++ ){

      if( this.meshes.length < this.maxMeshes ){
        this.emit();
      }

    }

  }

  function emit(){

    // Only emit if we have less than the max meshes
    if( this.meshes.length < this.maxMeshes ){

      var mesh = this.mesh.clone();

      mesh.lifetime = 0;
      mesh.ignoreRaycast = true;
      
      mesh.velocity = this.startingDirection();
      // Getts a starting speed based on our startingSpeed
      // and startingSpeedVariation
      var solid = 1 - this.startingSpeedVariation;
      var speed = this.startingSpeed * Math.random() * this.startingSpeedVariation;
      speed += solid;

      mesh.velocity.multiplyScalar( speed );

      this.meshes.push( mesh  );
      this.add( mesh );

    }

  }

  function end(){

    this.emitting = false

  }

  function begin(){

    this.emitting = true;

  }

  function Emitter( mesh ,  parameters ){

    var params = _.defaults( parameters || {} , {

      startingSpeed:              1,
      startingSpeedVariation:     .5,
      friction:                   1,
      decayRate:                  .9,
      startingDirection:  function(){
        
        var dir = new THREE.Vector3();
        Math.setRandomVector( dir );
        return dir;

      },
      lifetime:                   100,
      maxMeshes:                  100,
      emissionRate:               100,
      updatePerMesh:      function( mesh ){
      
        mesh.rotation.x += mesh.velocity.x / 10;
        mesh.rotation.y += mesh.velocity.y / 10;
        mesh.rotation.z += mesh.velocity.z / 10;

      }
    });


    var meshes = [];
    

    // Creating a place for a particle emitter!
    emitter = new THREE.Object3D();

    emitter.mesh      = mesh;
    emitter.being     = mesh.being;
    emitter.meshes    = meshes;


    //console.log( emitter.being );
    emitter.being.addToScene( emitter );

    emitter.timer     = 0;
    
    // Gives an offset so all emitters start at different times!
    emitter.timer += Math.random() * params.emissionRate;


    // Reassigning ever
    for( propt in params ){
      emitter[ propt ] = params[ propt ];
    }

       
    emitter.update      = update.bind( emitter );
    emitter.emit        = emit.bind( emitter );
    emitter.burst       = burst.bind( emitter );
    
    emitter.begin       = begin.bind( emitter );
    emitter.end         = end.bind( emitter );
    
    emitter.being.addToUpdateArray( emitter.update );


    return emitter;

  }

  
  module.exports = Emitter;


});
