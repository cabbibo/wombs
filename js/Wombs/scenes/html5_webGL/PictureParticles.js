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
  var physicsParticles     = require( 'wombs/shaders/physicsParticles'     );


  var helperFunctions   = require( 'wombs/utils/helperFunctions'      );

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
      fragmentAudio: false,
      vertexAudio:    true,
      geo: new THREE.CubeGeometry( 1 , 1 , 1 , 10 , 10 ,10 ),
      numOf: 50,

      particles: physicsParticles.basicPicture,
      
      particleParams:   {
        size: 25,
        sizeAttenuation: true,
        blending: THREE.NormalBlending,
        depthWrite: false,
        transparent: true,
        fog: true, 
        map: THREE.ImageUtils.loadTexture( '../lib/img/particles/lensFlare.png' ),
        opacity:    1.0,
      }

    });

    this.world = this.womb.sceneController.createScene();

    this.numOf = this.params.numOf;
    this.numberOfParticles = this.numOf * this.numOf;

    this.scene = this.world.scene;

    this.texture = this.params.texture;

    if( this.params.audio )
      this.audio = this.params.audio;

    var self = this;

    this.geo = this.params.geo;

    if( !this.params.image )
      this.image = this.generatePositionTexture();
    else
      this.image = womb.imageLoader.load( this.params.image );

    var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry( 100 , 100  ),
        new THREE.MeshBasicMaterial({ map: this.image })
        //new THREE.MeshNormalMaterial({ map: this.image })
    );

    this.scene.add( mesh );

    this.particleGeometry = this.getBufferParticleGeometry();
 
    this.particles = this.params.particles

    this.particleMaterial = new THREE.ShaderMaterial({

      uniforms: this.particles.uniforms,
      vertexShader: this.particles.vertexShader,
      fragmentShader: this.particles.fragmentShader,

      color: true,
      blending:     this.params.particleParams.blending,
      transparent:  this.params.particleParams.transparent,
      depthWrite:   this.params.particleParams.depthWrite,
      fog:          this.params.particleParams.fog,

    });

    helperFunctions.setMaterialUniforms( this.particleMaterial , this.params.particleParams );

    //this.particleMaterial.uniforms.audioTexture.value = womb.stream.texture.texture;
    this.particleMaterial.uniforms.lookup.value = this.image;

    this.particleSystem = new THREE.ParticleSystem(
      this.particleGeometry,
      this.particleMaterial
    );

    this.particleSystem.scale.multiplyScalar( 100 );
 
    this.scene.add( this.particleSystem );
  
    this.womb.loader.loadBarAdd();

    //this.world.update = this.update.bind( this );

  }


  Image.prototype.generatePositionTexture = function(){

    var x, y, z;

    var a = new Float32Array( this.numberOfParticles * 4 );

    for (var k = 0; k < this.numberOfParticles ; k++) {

      x = 2 * Math.random() - 1;     
      y = 2 * Math.random() - 1;     
      z = 2 * Math.random() - 1;     


      a[ k*4 + 0 ] = x 
      a[ k*4 + 1 ] = y 
      a[ k*4 + 2 ] = z 
      a[ k*4 + 3 ] = 1 

    }

    var texture = new THREE.DataTexture( 
      a, 
      this.numOf, 
      this.numOf, 
      THREE.RGBAFormat, 
      THREE.FloatType 
    );

    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    texture.flipY = false;

    return texture;

  };

  Image.prototype.getBufferParticleGeometry = function(){

    var particles = this.numberOfParticles;
    
    var geometry = new THREE.BufferGeometry();
    geometry.attributes = {

      position: {
          itemSize: 3,
          array: new Float32Array( particles * 3 ),
          numItems: particles * 3
      },
      color: {
          itemSize: 3,
          array: new Float32Array( particles * 3 ),
          numItems: particles * 3
      }

    }

    var positions = geometry.attributes.position.array;

    var colors = geometry.attributes.color.array;

    var color = new THREE.Color();

    var n = 1000, n2 = n / 2; // particles spread in the cube

    for ( var i = 0; i < positions.length; i += 3 ) {
      var j = ~~(i / 3);

      // positions

      var x = ( j % this.numOf ) / this.numOf  ;
      var y = Math.floor( j / this.numOf  ) / this.numOf ;
      var z = Math.random() * n - n2;

      positions[ i ]     = x;
      positions[ i + 1 ] = y;
      positions[ i + 2 ] = z;

    }

    geometry.computeBoundingSphere();
    return geometry;


  }


  Image.prototype.enter = function(){

    if( this.audio ){
      this.audio.play();
      this.audio.gain.gain.value = 0.0
      this.audio.fadeIn( 1 );
    }
    //this.audio.turnOnFilter();
    this.world.enter();
  }

  Image.prototype.exit = function(){
   
    if( this.audio ){
      this.audio.fadeOut();
    }
  
    this.world.exit();
  
  }

  module.exports = Image;

});
