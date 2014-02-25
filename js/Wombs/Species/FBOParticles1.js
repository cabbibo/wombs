/*
 
   New Species:

   Testing space for new Species

   Notes:
   
  Ways in which you can help the Fractal Combo can grow:

*/

define(function(require, exports, module) {

                            require( 'lib/three.min'              );
  var Womb                = require( 'Womb/Womb'                  );

  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var physicsParticles    = require( 'Shaders/physicsParticles'   );
  
  var FBOShaders          = require( 'Shaders/FBOShaders'         );
  //var FBOParticleMaterial = require( 'Species/Materials/FBO'      );
  var Particles           = require( 'Components/Particles'       );

  var FBOUtils            = require( 'Utils/FBOUtils'             );
  var helperFunctions     = require( 'Utils/helperFunctions'      );
  var m                   = require( 'Utils/Math'                 );


  function FBOParticles( parameters ){


    womb.loader.addToLoadBar();

     
    var params = _.defaults( parameters || {} , {

      numberOfParticles: 1000,  // Should be a square Number
      simulationShader:FBOShaders.fragment.positionVelocity,

      geometry: womb.defaults.geometry,
      map:      womb.defaults.texture

    });
 
    

    var width = Math.floor( Math.sqrt( params.numberOfParticles ) );
    var height = width;

    // Reassigning, because it'll be close enough!
    params.amountOfParticles = width * height;

    console.log( THREE );
    var data = new Float32Array( width * height * 3 );

    
    var geometry    = params.geometry;
    var facesLength = geometry.faces.length;
    var point       = new THREE.Vector3();

    for ( var i = 0, l = data.length; i < l; i += 3 ) {

      var face = geometry.faces[ Math.floor( Math.random() * facesLength ) ];

      var vertex1 = geometry.vertices[ face.a ];
      var vertex2 = geometry.vertices[ Math.random() > 0.5 ? face.b : face.c ];

      point.subVectors( vertex2, vertex1 );
      point.multiplyScalar( Math.random() );
      point.add( vertex1 );

      data[ i ] = point.x;
      data[ i + 1 ] = point.y;
      data[ i + 2 ] = point.z;

    }
    
    var originsTexture = new THREE.DataTexture(

        data ,
        width , 
        height , 
        THREE.RGBFormat,
        THREE.FloatType

    );

    originsTexture.minFilter = THREE.NearestFilter;
    originsTexture.magFilter = THREE.NearestFilter;
    originsTexture.generateMipmaps = false;
    originsTexture.needsUpdate = true;

   
    var positionsTexture = originsTexture.clone();


    var rtTexturePos = new THREE.WebGLRenderTarget( width, height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type:THREE.FloatType,
      stencilBuffer: false
    });

    var rtTexturePos2 = rtTexturePos.clone();

    simulationShader = new THREE.ShaderMaterial({

      uniforms:{
        tPositions: { type: "t", value: positionsTexture },
        tOrigins: { type: "t", value: originsTexture },
        opacity: { type: "f", value: 1.0 },
        time:     womb.time
      },      
      vertexShader:   FBOShaders.vertex.basic,
      fragmentShader: params.simulationShader
    });


    FBORenderer = new FBOUtils( width, womb.renderer, simulationShader );
    FBORenderer.renderToTexture( rtTexturePos, rtTexturePos2 );

    FBORenderer.in = rtTexturePos;
    FBORenderer.out = rtTexturePos2;

    var  geometry = new THREE.Geometry();

    for ( var i = 0, l = width * height; i < l; i ++ ) {

      var vertex = new THREE.Vector3();
      vertex.x = ( i % width ) / width ;
      vertex.y = Math.floor( i / width ) / height;
      geometry.vertices.push( vertex );

    } 

    var particleMaterial = new THREE.ShaderMaterial( {

      uniforms:       physicsParticles.uniforms.audio,
      vertexShader:   physicsParticles.vertex.audio,
      fragmentShader: physicsParticles.fragment.audio,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true

    });



    particleMaterial.FBORenderer = FBORenderer;
    particleMaterial.simulationShader = simulationShader;
    console.log( particleMaterial );
    if( params.audioTexture ){
      console.log('hello' );
      console.log( params.audioTexture );
      console.log( particleMaterial );
      particleMaterial.uniforms.audioTexture.value = params.audioTexture;
    }

    particleMaterial._update = update.bind( particleMaterial );



    var particles = new THREE.ParticleSystem( geometry , particleMaterial );

    particles.material.uniforms.map.value = params.map;
    
    var being = womb.creator.createBeing();
 
    being.addMesh( particles ); 
    being.particles = particles;

    womb.loader.loadBarAdd();

    return being;

  }

  function update(){

    var tmp = this.FBORenderer.in;
    this.FBORenderer.in = this.FBORenderer.out;
    this.FBORenderer.out = tmp;

    this.simulationShader.uniforms.tPositions.value = this.FBORenderer.in;
    this.FBORenderer.simulate( this.FBORenderer.out );

    this.uniforms.lookup.value = this.FBORenderer.out;

  }
 
  module.exports = FBOParticles;

});
