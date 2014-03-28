define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'              );
  var ShaderCreator       = require( 'Shaders/ShaderCreator'  );
  var womb = new Womb();

   womb.audio = womb.audioController.createNote( '/lib/audio/tracks/secondChance.mp3' );

  
  vertexChunk = [  
    "vPos = aColor;",
  ];

  fragmentChunk = [
    "color = vPos;",
  ];

  var shader = new ShaderCreator({
    vertexChunk:   vertexChunk,
    fragmentChunk: fragmentChunk,
    uniforms:{ 
      Time:         womb.time,
      Color:        { type:"v3" , value: new THREE.Vector3(1.1 , .1 , .9 ) },
      AudioTexture: { type:"t"  , value: womb.audio.texture },
    },
  });
 
  womb.audioController.gain.gain.value = 0;
  var geo = new THREE.CubeGeometry( 10 , 10 , 10 , 20 , 20 , 20 );

  shader.assignAttributes( 'aColor' , geo , function(i , vert){
    return vert.clone().normalize();
  });

  var material = shader.material;
  var mesh = new THREE.Mesh( geo , material  );

  womb.scene.add( mesh );
 
  womb.loader.loadBarAdd();
  womb.start = function(){


    womb.audio.play();
  
  }

});
