define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'              );
  var ShaderCreator       = require( 'Shaders/ShaderCreator'  );
  var Being               = require( 'Components/Being'       );
  var Mesh                = require( 'Components/Mesh'        );
  
  
  var womb = new Womb();

  womb.audio = womb.audioController.createNote( '/lib/audio/tracks/wanted.mp3' );

  //womb.audio = womb.audioController.createUserAudio();
  womb.audioController.gain.gain.value = 0;
  vertexChunk = [ 
    "vPos = aColor;",
  ];

  fragmentChunk = [
    "color = normalize( vPos );",
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

  
  var g = new THREE.CubeGeometry( 10 , 10 , 10 , 50 , 50 , 50 );
  womb.g = g;
  g.computeFaceNormals();
  g.computeVertexNormals();
  
  g.verticesNeedUpdate = true;
 
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

  var being = new Being();
  var mesh  = new Mesh( g , material );
  being.addComponent( mesh );

  womb.body.add( mesh.backup );
 /// womb.body.add( being.body );

  womb.being = being;
  womb.loader.loadBarAdd();
  womb.update = function(){
    
    var t = womb.time.value;

    var t1 = Math.sin( t );
    var t2 = Math.cos( t );
    var t3 = Math.tan( t );
    shader.assignAttributes('aColor' , womb.g , function(i , vert , geo){
      var x = Math.abs( Math.sin( i / geo.vertices.length  * Math.PI ) );
      var y = Math.abs(Math.sin( i ));
      var z = Math.abs(Math.cos( i ));
      return new THREE.Vector3( 
        Math.abs(t1 * x),
        Math.abs(t2 * y),
        Math.abs(t3 * z)
      );
    });

  }
  womb.start = function(){


   // womb.audio.play();
  
  }

});
