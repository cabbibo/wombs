define(function(require, exports, module) {

  var m                   = require('wombs/utils/Math'              );
  var AudioGeometry       = require('wombs/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('wombs/utils/AnalyzingFunctions');


  var Womb                = require( 'wombs/Womb'                       );

  var recursiveFunctions  = require( 'wombs/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'wombs/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'wombs/shaders/vertexShaders'      );
  var physicsShaders      = require( 'wombs/shaders/physicsShaders'     );
  var shaderChunks        = require( 'wombs/shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'wombs/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'wombs/shaders/physicsShaders'     );


  function AntiSerpenski1( womb , params ){

    
    this.womb = womb;

    this.womb.loader.addToLoadBar();

    this.params = _.defaults( params || {} , {

      spin: .001,
      color: new THREE.Vector3( .3 , .5 , 1.9 ),
      radius: 10,
      geo: new THREE.CubeGeometry( 1 , 1 , 1 )

    });

    this.fullGeo = this.params.geo;
    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;

    this.size = this.womb.size / 8.0;


    this.texture = this.womb.imageLoader.load( '../lib/img/moon_1024.jpg' );

    this.u = {

      texture:    { type: "t", value: womb.stream.texture.texture },
      image:      { type: "t", value: womb.stream.texture.texture },

      color:      { type: "v3", value: this.params.color },
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
      blending:       THREE.AdditiveBlending,
      opacity:        0.3,
      depthWrite:     false
    });


    numOf = 4;


    for( var i = 0; i < numOf;  i++ ){
  
      var mesh = new THREE.Mesh( this.fullGeo , this.material );

      var angle = 2 * Math.PI * i / numOf;

      mesh.rotation.y = angle;

      mesh.position = Math.toCart( this.size * this.params.radius ,  angle , 0 );
      mesh.scale.multiplyScalar( .8 );

      //THREE.GeometryUtils.merge( this.fullFullGeo , mesh );
      this.scene.add( mesh );

    }

    //this.mesh = new THREE.Mesh( this.fullFullGeo , this.material );
    //this.scene.add( this.mesh );

    var self = this;
    this.world.update = function(){
      
      self.scene.rotation.y += self.params.spin;
    
    
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
