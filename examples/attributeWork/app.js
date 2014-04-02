define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'              );
  var ShaderCreator       = require( 'Shaders/ShaderCreator'  );
  var womb = new Womb();

   //womb.audio = womb.audioController.createNote( '/lib/audio/tracks/wanted.mp3' );

  womb.audio = womb.audioController.createUserAudio();
  womb.audioController.gain.gain.value = 0;
  vertexChunk = [ 
    "pos *= aColor;",
    "vec2 u = vec2( uv.x , 0 );",
    "vec4 a = texture2D( AudioTexture , u );",
    "vPos = aColor * a.rgb;",
    "pos *= vPos;"
  ];

  fragmentChunk = [
    "color =  .6 * normalize( Color + normalize(reflect( nPos , vPos )) );",
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

  console.log( 'LOADED' );

  womb.modelLoader.loadFile( 'OBJ' , '/lib/models/leeperrysmith/leeperrysmith.obj', function( geo ){ 
  
    console.log( geo );
    var g = geo[0];
  
    var g = new THREE.IcosahedronGeometry( 10 , 5 );
    womb.g = g;
    g.computeFaceNormals();
    g.computeVertexNormals();
    
    g.verticesNeedUpdate = true;

    womb.modelLoader.assignUVs( g );
   
    shader.assignAttributes('aColor' , g , function(i , vert , geo){
      var x = Math.abs( Math.sin( i / geo.vertices.length  * Math.PI ) );
      var y = .1 * Math.sin( i );
      var z = Math.cos(i );
      return new THREE.Vector3( 
        x,
        y,

        1.0 
      );
    });

    var material = shader.material;
    var mesh = new THREE.Mesh( g , material  );
    mesh.scale.multiplyScalar( 50 );
    womb.scene.add( mesh );

  });
  womb.loader.loadBarAdd();
  womb.update = function(){

    var t = womb.time.value;

    var t1 = Math.sin( t * .5 );
    var t2 = Math.cos( t );
    shader.assignAttributes('aColor' , womb.g , function(i , vert , geo){
      var x = Math.abs( Math.sin( i / geo.vertices.length  * Math.PI ) );
      var y = .1 * Math.sin( i );
      return new THREE.Vector3( 
        1.0 + .1 * t1 * x,
        1.0 + .1 * t2 * y,

        1.0
      );
    });


  }
  womb.start = function(){


   // womb.audio.play();
  
  }

});
