/*
 *
 * MUCH THANKS TO: 
 * http://jabtunes.com/labs/3d/gpuflocking/webgl_gpgpu_flocking3.html
 *
 *
 */
define(function(require, exports, module) {

  require( 'lib/three.min'                );
  require( 'lib/underscore'               );


  var SC              = require("app/shaders/shaderChunks");
  var fragmentShaders = require("app/shaders/fragmentShaders");
  var vertexShaders   = require("app/shaders/vertexShaders");
  var tempParticles   = require( 'app/shaders/tempParticles'      );

  var PS = require("app/shaders/physicsShaders");

  var PhysicsSimulator = function( womb , params ){


    this.womb = womb;

    // Getting the context
    this.gl = womb.renderer.getContext();

    // Setting up Params!
    // Make sure particles are 
    this.params = _.defaults( params || {} , {
      textureWidth:     100,
      bounds:           womb.size,
      velocityShader:   PS.velocity.flocking,
      debug:            false
    });

    this.params.textureHeight = this.params.textureWidth;

    this.velocityShader = this.params.velocityShader;


    // Camera and scene for renderering physics texture
    this.camera = new THREE.Camera();
    this.scene  = new THREE.Scene();
    this.camera.position.z = 1;


    this.textureWidth   = this.params.textureWidth;
    this.textureHeight  = this.params.textureHeight;
    
    this.TW             = this.textureWidth;


    // Bounds for physics Parameters requiring bounds
    this.bounds         = this.params.bounds;

    // For the numbe of pixels in the texture,
    // we will have a single particle for each pixel
    this.numberOfParticles = this.TW * this.TW;

    this.data;
    this.texture;

    // TODO: WHAT IS FLIPFLOP
    this.flipflop = true;

    // These are the textures that will 
    this.renderTextures = {
      position1:null,
      position2:null,
      velocity1:null,
      velocity2:null
    }

    this.RT = this.renderTextures;



    /*
    
       TESTING FOR BROWSER COMPATIBILITY

    */

    if( !this.gl.getExtension( "OES_texture_float" )) {
      this.womb.loader.addFailure( "NO FLOAT TEXTURES" , "http://robbieTilton.com" );
      return;
    }

    if( this.gl.getParameter(this.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0) {
      this.womb.loader.addFailure( "NO VERTEX TEXTURES" , "http://robbieTilton.com" );
      return;
    }



    /*

       SETTING UP TEXTURE UNIFORMS
    
    */

    this.textureUniforms = {
      time: this.womb.time,
      resolution: { type: "v2", value: new THREE.Vector2( this.TW , this.TW ) },
      texture: { type: "t", value: null },
      // Inputs
    };
  
    this.textureMaterial = new THREE.ShaderMaterial( {

	  uniforms: this.textureUniforms,
  	  vertexShader: vertexShaders.passThrough_noMV,
  	  fragmentShader: fragmentShaders.texture

    });

    this.textureGeometry = new THREE.PlaneGeometry( 2 , 2  );
    this.textureMesh = new THREE.Mesh( this.textureGeometry , this.textureMaterial );

    this.scene.add( this.textureMesh );




    /*

       SETTING UP POSITION AND VELOCITY SHADERS

    */

    this.positionShader = new THREE.ShaderMaterial({

      uniforms: {
          time: this.womb.time ,
          resolution: { type: "v2", value: new THREE.Vector2(  this.TW , this.TW ) },
          texturePosition: { type: "t", value: null },
          textureVelocity: { type: "t", value: null },
      },
      vertexShader: vertexShaders.passThrough_noMV,
      fragmentShader: PS.position
    
    });

    this.velocityShader = new THREE.ShaderMaterial( {

      uniforms: {
          time: { type: "f", value: 1.0 },
          resolution: { type: "v2", value: new THREE.Vector2( this.TW , this.TW ) },
          texturePosition: { type: "t", value: null },
          textureVelocity: { type: "t", value: null },
          testing: { type: "f", value: 1.0 },
          seperationDistance: { type: "f", value: 200.0 },
          alignmentDistance: { type: "f", value: 150.0 },
          cohesionDistance: { type: "f", value: 30000.0 },
          freedomFactor: { type: "f", value: 0.3 },
      },

      vertexShader: vertexShaders.passThrough_noMV,
      fragmentShader: this.velocityShader 

    });

    /*
    
       Setting up  all the textures, and rendering them
       first time around

    */
    console.log( this );
    this.dtPosition = this.generatePositionTexture();
    this.dtVelocity = this.generateVelocityTexture();

    this.RT.position1 = this.getRenderTarget();
    this.RT.position2 = this.RT.position1.clone();
   
    this.RT.velocity1 = this.RT.position1.clone();
    this.RT.velocity2 = this.RT.position1.clone();

    this.renderTexture( this.dtPosition  , this.RT.position1 );
    this.renderTexture( this.RT.position1 , this.RT.position2 );

    this.renderTexture( this.dtVelocity  , this.RT.velocity1 );
    this.renderTexture( this.RT.velocity1 , this.RT.velocity2 );


    /*
     
       Setting up the particles we will be visualizing

    */

    this.particleGeometry = this.getBufferParticleGeometry();

    this.particleMaterial = new THREE.ParticleBasicMaterial( {
      size: 3, 
      vertexColors: false,
      //map: THREE.ImageUtils.loadTexture( '../lib/img/hnrW.png' ),
      transparent: true,
      blending: THREE.AdditiveBlending,
      //depthWrite: false, depthTest: false,
      uniforms: {
          'color': {}
      },
      opacity: 0.3
    });

    this.particleMaterial = new THREE.ShaderMaterial({

      size: 3,
      vertexColors: false,
      map: THREE.ImageUtils.loadTexture( '../lib/img/hnrW.png' ),
      transparent: true,
      blending: THREE.AdditiveBlending,
      
      uniforms: tempParticles.basicParticle.uniforms,
      vertexShader: tempParticles.basicParticle.vertexShader,
      fragmentShader: tempParticles.basicParticle.fragmentShader,






    });

    this.particleSystem = new THREE.ParticleSystem(
      this.particleGeometry,
      this.particleMaterial
    );
 
    this.womb.scene.add( this.particleSystem );


    if( this.params.debug ){

      this.createDebugTextures();

    }

  }





  /*


     METHODS


  */

  PhysicsSimulator.prototype._update = function(){

    if( this.flipflop ){

      this.renderVelocity( this.RT.position1 , this.RT.velocity1 , this.RT.velocity2 );
      this.renderPosition( this.RT.position1 , this.RT.velocity2 , this.RT.position2 );

      if( this.particleMaterial.uniforms )
        this.particleMaterial.uniforms.lookup.value = this.RT.position2;

    } else {

      this.renderVelocity( this.RT.position2 , this.RT.velocity2 , this.RT.velocity1 );
      this.renderPosition( this.RT.position2 , this.RT.velocity1 , this.RT.position1 );

      if( this.particleMaterial.uniforms )
        this.particleMaterial.uniforms.lookup.value = this.RT.position1;

    }

    this.flipflop = !this.flipflop;


    this.update();

  }

  PhysicsSimulator.prototype.update = function(){}

  PhysicsSimulator.prototype.createDebugTextures = function(){

    this.debugScene = new THREE.Object3D();

    var s = womb.size / 6;
    var geo = new THREE.PlaneGeometry( s , s );

    var mesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
      map: this.dtPosition
    }));

    mesh.position.x = -womb.size / 8;
    this.debugScene.add( mesh );

    var mesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
      map: this.dtVelocity
    }));

    mesh.position.x = womb.size / 8;
    this.debugScene.add( mesh );



    var mesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
      map: this.RT.position1
    }));

    mesh.position.x = -womb.size / 2;
    this.debugScene.add( mesh );

    var mesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
      map: this.RT.position2
    }));

    mesh.position.x = -womb.size / 4;
    this.debugScene.add( mesh );

    var mesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
      map: this.RT.velocity1
    }));

    mesh.position.x = womb.size / 4;
    this.debugScene.add( mesh );

    var mesh = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
      map: this.RT.velocity2
    }));

    mesh.position.x = womb.size / 2;
    this.debugScene.add( mesh );

    this.womb.scene.add( this.debugScene );

  }

  PhysicsSimulator.prototype.getRenderTarget = function(){

    var renderTarget = new THREE.WebGLRenderTarget( this.TW , this.TW , {
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false
    });

    return renderTarget;

  };


  //TODO: Create Placement functions
  //TODO: Create Velocity Creation Functions
  PhysicsSimulator.prototype.generatePositionTexture = function(){

    var x, y, z;

    var a = new Float32Array( this.numberOfParticles * 4 );

    for (var k = 0; k < this.numberOfParticles ; k++) {

      x = Math.random() * this.bounds - this.bounds/2;
      y = Math.random() * this.bounds - this.bounds/2;
      z = Math.random() * this.bounds - this.bounds/2;

      a[ k*4 + 0 ] = x;
      a[ k*4 + 1 ] = y;
      a[ k*4 + 2 ] = z;
      a[ k*4 + 3 ] = 1;

    }

    var texture = new THREE.DataTexture( 
      a, 
      this.TW, 
      this.TW, 
      THREE.RGBAFormat, 
      THREE.FloatType 
    );

    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    texture.flipY = false;

    console.log( texture );

    return texture;

  };
   
  PhysicsSimulator.prototype.generateVelocityTexture = function(){

    var x, y, z;

    var a = new Float32Array( this.numberOfParticles * 4 );

    for ( var k = 0; k < this.numberOfParticles; k++ ) {

      x = Math.random() - 0.5;
      y = Math.random() - 0.5;
      z = Math.random() - 0.5;

      a[ k*4 + 0 ] = x * 100;
      a[ k*4 + 1 ] = y * 100;
      a[ k*4 + 2 ] = z * 100;
      a[ k*4 + 3 ] = 1;

    }

    var texture = new THREE.DataTexture(
      a, 
      this.TW,
      this.TW, 
      THREE.RGBAFormat, 
      THREE.FloatType 
    );

    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    texture.flipY = false;
    
    console.log(texture);

    return texture;



  };

  PhysicsSimulator.prototype.getBufferParticleGeometry = function(){

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

      var x = ( j % this.TW ) / this.TW ;
      var y = Math.floor( j / this.TW ) / this.TW;
      var z = Math.random() * n - n2;

      positions[ i ]     = x;
      positions[ i + 1 ] = y;
      positions[ i + 2 ] = z;
    }

    geometry.computeBoundingSphere();
    return geometry;


  }


  // Renderst a texture to the material, giving the desired output
  PhysicsSimulator.prototype.renderTexture = function( input , output ) {
    this.textureUniforms.texture.value = input;
    this.womb.renderer.render( this.scene, this.camera, output );
    this.output = output;
  }

  // renders the position using 
  PhysicsSimulator.prototype.renderPosition = function( position , velocity , output ) {
    
    this.textureMesh.material = this.positionShader;
    this.positionShader.uniforms.texturePosition.value = position;
    this.positionShader.uniforms.textureVelocity.value = velocity;
    this.womb.renderer.render( this.scene , this.camera , output );
    this.output = output;
  
  }

  PhysicsSimulator.prototype.renderVelocity = function(position, velocity, output) {
    
    this.textureMesh.material = this.velocityShader;
    
    this.velocityShader.uniforms.texturePosition.value = position;
    this.velocityShader.uniforms.textureVelocity.value = velocity;
    this.velocityShader.uniforms.time.value = performance.now();
    
    this.womb.renderer.render( this.scene, this.camera, output);
    this.output = output;

  }








  module.exports = PhysicsSimulator;

});
