define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'              );
  var ShaderCreator       = require( 'Shaders/ShaderCreator'  );
  var womb = new Womb();

   womb.audio = womb.audioController.createNote( '/lib/audio/tracks/secondChance.mp3' );

  
  vertexChunk = [ 
    "pos += aColor;",
    "vec2 u = vec2( uv.x , 0 );",
    "vec4 a = texture2D( AudioTexture , u );",
    "vPos = aColor * a.rgb;",
    "pos += vPos;"
  ];

  fragmentChunk = [
    "color = Color + reflect( nPos , vPos);",
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
 
  //var geo = new THREE.CubeGeometry( 10 , 10 , 1 , 100 , 2 , 100 );
  var geo = new THREE.SphereGeometry( 10 , 20 ,1000);
  //var geo = new THREE.IcosahedronGeometry( 10 , 6 );
  shader.assignAttributes('aColor' , geo , function(i , vert , geo){
    var x = Math.sin( i / geo.vertices.length  * Math.PI );
    var y = Math.sin( i );
    var z = Math.cos(i );
    return new THREE.Vector3( 
      x,
      y,
      z 
    );
  });

  var material = shader.material;
  var mesh = new THREE.Mesh( geo , material  );
  womb.scene.add( mesh );
 
  womb.loader.loadBarAdd();
  womb.start = function(){


    womb.audio.play();
  
  }

});
