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


  function Ring( womb , params ){

    
    this.womb = womb;

    this.womb.loader.addToLoadBar();

    var self = this;
    this.params = _.defaults( params || {} , {

      spin: .001,
      color: new THREE.Vector3( .3 , .5 , 1.9 ),
      radius: 10,
      modelScale: .1,
      audioPower: 0.5,
      noisePower: 0.1,
      texture: self.womb.stream.texture.texture,
      geo: new THREE.CubeGeometry( self.womb.size , self.womb.size , self.womb.size ),
      numOf: 20

    });
    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;

    this.texture = this.params.texture;

    var self = this;

    this.geo = this.params.geo 

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
    this.uniforms.pow_noise.value  = this.params.noisePower;
    this.uniforms.pow_audio.value  = this.params.audioPower;

    this.material = new THREE.ShaderMaterial( {
      uniforms:       this.uniforms, 
      vertexShader:   vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.image.sample_pos_diamond,
      transparent:    true,
      fog:            true,
      blending:       THREE.AdditiveBlending,
      opacity:        0.1,
      depthWrite:     false
    });



    this.size = this.womb.size / 50;
 
    var numOf = this.params.numOf;


    this.geo.boundingSphere.radius *= 3;
    this.meshes = [];
    for( var i = 0; i < numOf;  i++ ){
      var mesh = new THREE.Mesh( this.geo , this.material );

      var angle = 2 * Math.PI * i / numOf;
  
      mesh.rotation.y = angle;
      mesh.position = Math.toCart( this.params.radius ,  angle , 0 );
     
      
      mesh.scale.multiplyScalar( this.params.modelScale );
      
        
      mesh.geometry.computeBoundingBox();

      this.scene.add( mesh );

      this.meshes.push( mesh );

    }

  

    //this.mesh = new THREE.Mesh( this.fullFullGeo , this.material );
    //this.scene.add( this.mesh );

    var self = this;
    this.world.update = function(){
      self.update();
    }

    womb.loader.loadBarAdd();

  }



  Ring.prototype.update = function(){

  }

  Ring.prototype.enter = function(){
    this.world.enter();
  }

  Ring.prototype.exit = function(){
    this.world.exit();
  }

  module.exports = Ring;

});
