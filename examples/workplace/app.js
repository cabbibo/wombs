define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'              );
  var ShaderCreator       = require( 'Shaders/ShaderCreator'  );

  var womb = new Womb({
    stats: true,
  });

  var file  = '/lib/audio/tracks/weddingBellsLoop.wav' ;
  var audio = womb.audioController.createLoop( file );

  console.log( audio );
  vertexChunk = [
    "nPos = normalize(pos);",
    "vec3 offset;",
    "offset.x = nPos.x + Time * .3;",
    "offset.y = nPos.y + Time * .2;",
    "offset.z = nPos.z + Time * .24;",
    "vec2 a = vec2( abs( nPos.x ) , 0.0 );",
    "float audio = texture2D( AudioTexture , a).r;",
    "vDisplacement = .5 * snoise3( offset ) * audio * audio;",
    "pos *= abs( vDisplacement + 3.0 );",

  ];

  fragmentChunk = [
    "color = abs( nPos + vDisplacement);" 
  ];

  womb.shader = new ShaderCreator({
    vertexChunk:   vertexChunk,
    fragmentChunk: fragmentChunk,
    uniforms:{ 
      Time:         womb.time,
      AudioTexture: {type:"t" , value:audio.texture}
    
    },
  });

  var mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry( womb.size / 4  , 5 ),
    womb.shader.material
  );

  womb.scene.add( mesh );
  womb.loader.loadBarAdd();

  womb.start = function(){

    audio.play();

  }

});
