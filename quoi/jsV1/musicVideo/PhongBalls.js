

/*
 
   A distrubition of Phong balls.
   Color, Size of balls, and Distribution may be , and parent Scene may be passed in



   TODO: Organizational Notes:

   womb Should control everyting,

   within a womb, there are different worlds,

   These worlds can have sub worlds,
   
   Basically: 
    Womb = World + ObjectsCurrentlyInWomb
    World = what is currently called 'Scene.js'

  This will allow a scene to be part of a world, not a scene.scene,

  We can harness everything off of just WOMB

  and scenes can scale in and out?


*/ 



// Notes
define(function(require, exports, module) {


  var M                   = require('app/utils/Math'                );
  var AudioGeometry       = require('app/three/AudioGeometry'       );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions'  );
  var PlacementFunctions  = require('app/utils/PlacementFunctions'  );



  function PhongBalls( womb , audio , params ){

    this.womb   = womb;
    this.audio  = audio;

    this.world  = womb.world.sceneControll

    this.params = _.defaults( params || {} ,{

      radius:             womb.world.size / 2,
      size:               womb.world.size / 50,
      color:              0xffaaaa,
      specular:           0x99afaa,
      emmissive:          0x00ccff,
      lightColor:         0x00ff00,
      lightPosition:      [ 0 , 1 , 0 ],
      lightIntensity:     .5,
      shininess:          100,
      scene:              womb.world.scene,
      clusterGeometry:    new THREE.IcosahedronGeometry( 1 , 1 ),
      numberOf:           10,
      analyzingFunction:  new AnalyzingFunctions.straightScale( 256 ),


      //placementFunction:  

    });

    // Creating some easier calls
    this.radius = this.params.radius;
    this.size   = this.params.size;

    // TODO: This should pass in what its parent Scene is!
    this.scene = womb.world.sceneController.createScene({
      transition:'scale'
    });


    this.light = new THREE.DirectionalLight( 
        this.params.lightColor ,
        this.params.lightIntensity
    );
   
    var lP = this.params.lightPosition ;
    
    this.light.position.set( lP[0] , lP[1] , lP[2] );

    this.scene.scene.add( this.light );


    this.material = new THREE.MeshPhongMaterial({

      color: this.params.color,
      specular: this.params.specular,
      emmissive: this.params.emmissive,
      shininess: this.params.shininess

    });


    // Creating an empty geometry to add all of our objects to
    this.geometry = new THREE.Geometry();
    
    for( var i = 0; i < this.params.numberOf; i ++ ){

      var mesh = new THREE.Mesh( this.params.clusterGeometry , this.material );

      mesh.scale.multiplyScalar( this.size );

      // TODO: Clean so these are of the same format!
      mesh.position = Math.THREE.randomSpherePosition( this.radius );
      THREE.setRandomRotation( mesh.rotation );

      THREE.GeometryUtils.merge( this.geometry , mesh );
      
    }


    // Creating Audio Geometry
    this.audioGeometry = new AudioGeometry(
      this.geometry,
      this.audio,
      {
        analyzingFunction : this.params.analyzingFunction
      }
    );

    console.log( this.audioGeometry );

    this.mesh = new THREE.Mesh( this.audioGeometry.geometry , this.material );

    this.scene.scene.add( this.mesh );

   // this.light  = new THREE.DirectionalLight( 0x6666ff , .5 );
    //this.light.position.set( 1 , 0 , 0 );
    //this.scene.scene.add( this.light );


    this.scene.audioGeometry = this.audioGeometry;
    
    this.scene.update = function(){

      this.audioGeometry.update();

    }



  }


  PhongBalls.prototype.update = function(){

  }

  PhongBalls.prototype.enter = function(){

    this.scene.enter();

  }

  PhongBalls.prototype.exit = function(){

    this.scene.exit();

  }


  module.exports = PhongBalls;

});
  

