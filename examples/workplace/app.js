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
    
    "vec2 a = vec2( abs( nPos.y ) , 0.0 );",
    
    "float audio = texture2D( AudioTexture , a).r;",
    "vDisplacement = NoisePower * snoise3( offset );",
    "vDisplacement += AudioPower * audio * audio;",
   
    "pos *= .1 * abs( vDisplacement + 3.0 );",

    //"pos = normalize( pos );",
  ];

  fragmentChunk = [

    "color = abs( Color +.3 * abs(normalize(vPos_MV ))  + abs(nPos) + vDisplacement);",
    "vec3 normalColor = normalize( color );",
    "color += kali3( nPos , -1. * normalColor );",
    "color = normalize( color ) * vDisplacement;",

  ];

  womb.shader = new ShaderCreator({
    vertexChunk:   vertexChunk,
    fragmentChunk: fragmentChunk,
    uniforms:{ 
     
      Time:         womb.time,
      Color:        { type:"v3" , value: new THREE.Vector3( -.7 , -.8 , -.3 ) },
      AudioTexture: { type:"t"  , value: audio.texture },
      NoisePower:   { type:"f"  , value: .9 },
      AudioPower:   { type:"f"  , value: 1.4 }
    
    },
  });

  var mesh = new THREE.Mesh(
    new THREE.CubeGeometry( 100 ,100 , womb.size / 4, 100 , 100 , 100 ),
    womb.shader.material
  );

  womb.scene.add( mesh );
  womb.loader.loadBarAdd();

  womb.start = function(){

    audio.play();

  }

});
