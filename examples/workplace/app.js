define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                          );
  
  var UserMediaTexture    = require( 'Womb/Textures/UserMediaTexture'     );
  var physicsParticles    = require( 'Shaders/PhysicsParticles'           );
  var TextureParticles    = require( 'Species/Materials/TextureParticles' );
  var shaderChunks    = require( 'Shaders/ShaderChunks'               );

  var MeshEmitter     = require( 'Components/MeshEmitter' );
  var Mesh            = require( 'Components/Mesh' );
 
  var ShaderCreator       = require( 'Shaders/ShaderCreator' );

  /*
   Create our womb

  */
  
  var womb = new Womb({
    stats: true,
  });

  vertexChunk = [

    "vec3 offset;",
    "offset.x = nPos.x + cos( Time / 100.0 );",
    "offset.y = nPos.y + sin( Time / 100.0 );",
    "offset.z = nPos.z;", //+ tan( time / 100.0 );",
    "offset *= .01;",
    "float dNoise = snoise3( offset );",
    "pos += vec3( uv.x , uv.y , 0.0 );" 

  ]

  fragmentChunk = [
    "color = abs( nPos );"
  ];

  womb.shader = new ShaderCreator({

    vertexChunk:   vertexChunk,
    fragmentChunk: fragmentChunk,
    uniforms:{
      Time: womb.time
    },

    transparent:  true,
    blending:     THREE.AdditiveBlending

  });

  womb.shader.material.blending = THREE.AdditiveBlending;
  womb.shader.material.transparent = true;

  console.log( THREE.AdditiveBlending );
  console.log('sd');

  var mesh = new THREE.Mesh(
    womb.defaults.geometry,
    womb.shader.material
  );

  womb.scene.add( mesh );
  womb.loader.loadBarAdd();
  
  console.log( womb.shader );



  womb.update = function(){
  
  }

  womb.start = function(){
  
  }


});
