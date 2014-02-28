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

  ];

  fragmentChunk = [



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
    new THREE.CubeGeometry( womb.size/ 4 , womb.size/ 4 , womb.size/4, 100 , 100 , 100 ),
    womb.shader.material
  );

  womb.scene.add( mesh );
  womb.loader.loadBarAdd();

  womb.start = function(){

    audio.play();

  }

});
