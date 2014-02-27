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
      image: '/lib/img/centerLogoWhite.png',
      fragmentAudio: true,
      vertexAudio:    true,
      geo: new THREE.CubeGeometry( 1 , 1 , 1 , 10 , 10 ,10 ),
      numOf: 50

    });

    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;


    this.material = new THREE.MeshLambertMaterial({
      map: THREE.ImageUtils.loadTexture( '/lib/img/textures/land_ocean_ice_cloud_2048.jpg' )
    })


    var light = new THREE.AmbientLight();
    this.scene.add( light );
    this.mesh = new THREE.Mesh( 
        new THREE.SphereGeometry( 50 , 20 , 20 ),
        this.material 
    );

    this.light = new THREE.DirectionalLight( 0xffffcc , 1 );
    this.light.position.set( 0 , 0 , 1 );

    this.scene.add( this.mesh );
    this.scene.add( this.light );



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
