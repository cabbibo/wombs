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


  function AntiSerpenski1( womb ){

    
    this.womb = womb;

    this.womb.loader.addToLoadBar();

    console.log( womb );
    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;


    this.texture = this.womb.imageLoader.load( '../lib/img/moon_1024.jpg' );

    this.u = {

      texture:    { type: "t", value: womb.stream.texture.texture },
      image:      { type: "t", value: womb.stream.texture.texture },

      color:      { type: "v3", value: new THREE.Vector3( .8 , 1.2 , 1.2 ) },
      time:       womb.time,
      pow_noise:  { type: "f" , value: 0.2 },
      pow_audio:  { type: "f" , value: .3 },

    }

    this.uniforms = THREE.UniformsUtils.merge( [
        THREE.ShaderLib['basic'].uniforms,
        this.u,
    ]);

    this.uniforms.texture.value    = this.womb.stream.texture.texture;
    this.uniforms.image.value      = this.texture;
    this.uniforms.time             = womb.time;
    this.uniforms.pow_noise.value  = .01;
    this.uniforms.pow_audio.value  = .3;

    this.material = new THREE.ShaderMaterial( {
      uniforms:       this.uniforms, 
      vertexShader:   vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.image.sample_pos_diamond,
      transparent:    true,
      fog:            true,
      //blending:       THREE.AdditiveBlending,
      opacity:        0.3,
      //depthWrite:     false
    });


    this.fullGeo = new THREE.Geometry();
    this.size = this.womb.size / 50;
    this.geo = new THREE.CubeGeometry( this.size , this.size , this.size , 10 , 10 , 10 );
    this.basicMaterial = new THREE.MeshBasicMaterial();

    console.log('s');
    console.log( this.basicMaterial );

    var recursiveArray = [];
    
    recursiveFunctions.antiSerpenski( 
      recursiveArray,
      new THREE.Vector3(),
      this.womb.size / 5,
      10,
      2.4,
      this.womb.size / 15
    );


    for( var i  = 0; i < recursiveArray.length; i++ ){

      var mesh = new THREE.Mesh(
        this.geo,
        this.basicMaterial 
      );

      mesh.position = recursiveArray[i][0];
      mesh.scale.multiplyScalar( recursiveArray[i][2] / 10 );

      THREE.GeometryUtils.merge( this.fullGeo , mesh );

    }

    numOf = 5;

    this.fullFullGeo = new THREE.Geometry();

    for( var i = 0; i < numOf;  i++ ){
  
      var mesh = new THREE.Mesh( this.fullGeo , this.basicMaterial );

      mesh.rotation.x = 2 * Math.PI * i / numOf;
      mesh.scale.multiplyScalar( (i+1) / numOf );
  

      THREE.GeometryUtils.merge( this.fullFullGeo , mesh );
      //this.scene.add( this.mesh );

    }

    this.mesh = new THREE.Mesh( this.fullFullGeo , this.material );
    this.scene.add( this.mesh );

    var self = this;
    this.world.update = function(){
      
      self.scene.rotation.y += .001;
    
    
    }

    womb.loader.loadBarAdd();

  }

  AntiSerpenski1.prototype.enter = function(){
    this.world.enter();
  }

  AntiSerpenski1.prototype.exit = function(){
    this.world.exit();
  }

  module.exports = AntiSerpenski1;

});
