define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');


  var Womb                = require( 'app/Womb'                       );

  var recursiveFunctions  = require( 'app/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );
  var shaderChunks        = require( 'app/shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'app/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );


  function Image( womb , params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    var self = this;
    this.params = _.defaults( params || {} , {

      text: 'HELLO',
      spin: .001,
      color: new THREE.Vector3( .3 , .5 , 1.9 ),
      radius: 10,
      size:   .3,
      modelScale: 1,
      audioPower: 0.5,
      noisePower: 0.1,
      ratio:      1,
      texture:    womb.stream.texture.texture,
      model: '/lib/models/mug_11530_10.obj',
      fragmentAudio: false,
      vertexAudio:    true,
      geo: new THREE.CubeGeometry( 1 , 1 , 1 , 10 , 10 ,10 ),
      numOf: 50

    });

    var self = this

    womb.modelLoader.loadFile( 'OBJ' , '/lib/models/mug_11530_10.obj' , function( object ){

      if( object[0] instanceof THREE.Mesh ){
      }

      if( object[0] instanceof THREE.Geometry ){

        womb.geo = object[0];
        womb.geo.computeFaceNormals();
        womb.geo.computeVertexNormals();
        
        womb.modelLoader.assignUVs( womb.geo );
       
        self.onMugLoad( womb.geo );
      }

    });

    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;

    this.onMugLoad = function(geo){

      var material = new THREE.MeshNormalMaterial({
       
        shading: THREE.SmoothShading
        
      });
      this.mugMesh = new THREE.Mesh( geo , material );

      this.mugMesh.scale.multiplyScalar( 200 );
      this.mugMesh.rotation.x = Math.PI/2;
      this.mugMesh.position.y = -50
      this.scene.add( this.mugMesh );


    }

    womb.modelLoader.loadFile( 'OBJ' , '/lib/models/mug_11530_10.obj' , function( object ){

      if( object[0] instanceof THREE.Mesh ){
      }

      if( object[0] instanceof THREE.Geometry ){

        womb.geo = object[0];
        womb.geo.computeFaceNormals();
        womb.geo.computeVertexNormals();
        
        womb.modelLoader.assignUVs( womb.geo );
       
        self.onMugLoad( womb.geo );
      }

    });


     
    this.womb.loader.loadBarAdd();

    //this.world.update = this.update.bind( this );

  }


   

  Image.prototype.enter = function(){
    //this.audio.turnOnFilter();
    this.world.enter();
  }

  Image.prototype.exit = function(){
     
    this.world.exit();
  
  }

  module.exports = Image;

});
