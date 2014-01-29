define(function(require, exports, module) {


  var M                   = require('app/utils/Math'                );
  var AudioGeometry       = require('app/three/AudioGeometry'       );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions'  );
  var PlacementFunctions  = require('app/utils/PlacementFunctions'  );


  function RingGeometry( womb , geometry , audio , params ){


    this.womb     = womb;
    this.geometry = geometry;
    this.audio    = audio;

    this.world    = womb.world.sceneControll

    this.params   = _.defaults( params || {} ,{

      radius:             womb.world.size / 2,
      size:               womb.world.size / 50,
      color:              0xffaaaa,
      specular:           0x99afaa,
      emmissive:          0x00ccff,
      lightColor:         0xcccccc,
      lightPosition:      [ 0 , 1 , 0 ],
      lightIntensity:     .3,
      shininess:          100,
      range:              2 * Math.PI,
      scene:              womb.world.scene,
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


    this.scale = this.size / this.geometry.boundingSphere.radius ;

    //this.scale = this.geometry.boundingSphere.radius / this.size;
    //this.scale = 100;
    console.log( this.scale );
    
    this.audioGeometry = new AudioGeometry(
      this.geometry,
      this.audio,
      {
        analyzingFunction : this.params.analyzingFunction
      }
    );

  /*  var testMesh = new THREE.Mesh( 
        new THREE.CubeGeometry( this.size , this.size , this.size ),
        new THREE.MeshNormalMaterial()
    );*/

    //this.scene.scene.add( testMesh );

    for( var i = 0; i < this.params.numberOf; i++ ){

      var mesh = new THREE.Mesh( 
          new THREE.CubeGeometry( this.size , this.size , this.size ),
          this.material
      );

      var mesh = new THREE.Mesh( this.audioGeometry.geometry , this.material );

      mesh.scale.multiplyScalar( this.scale );

      var angle = this.params.range * ( i / this.params.numberOf );
      console.log( angle );

      var pos = M.toCart( this.radius , -angle , 0 );

      mesh.position.x = pos.x;
      mesh.position.y = pos.z;
      mesh.position.z = pos.y;

      mesh.rotation.z = angle; 

      this.scene.scene.add( mesh );

    }

    this.scene.audioGeometry = this.audioGeometry;
    
    this.scene.update = function(){

      this.audioGeometry.update();

    }

  }


  RingGeometry.prototype.enter = function(){

    this.scene.enter();

  }

  RingGeometry.prototype.exit = function(){

    this.scene.exit();

  }

  module.exports = RingGeometry;


});

