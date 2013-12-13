define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');

  var ShaderMaterial       = require( 'app/utils/ShaderMaterial' );

  var Womb                = require('app/Womb');

  var fragmentShader = [

    "uniform float      time;",
    "uniform vec2       resolution;",
    "uniform sampler2D  texture;",
    "uniform float      textureSize;",

    "varying vec2 vUv;",

    "float getAudio( float coord ){",
    
      "float index = coord * textureSize;",
      "int rIndex = int( mod( coord , 4.0 ) );",

      "vec2 audioCoord = vec2( index , 0.0 );",

      "float audioValue = 0.0;",
      
      "if( rIndex == 0 ){",
        "audioValue = texture2D( texture , audioCoord ).r;",
      "}else if( rIndex == 1 ){",
        "audioValue = texture2D( texture , audioCoord ).g;",
      "}else if( rIndex == 2 ){",
        "audioValue = texture2D( texture , audioCoord ).b;",
      "}else if( rIndex == 3 ){",
        "audioValue = texture2D( texture , audioCoord ).a;",
      "}",


      "return audioValue;",
    
    "}",

    "void main( void ) {",

        "vec2 position = -1.0 + 2.0 * vUv;",
//        "float audioX = getAudio( vUv.x );",
        //"float audioY = getAudio( vUv.y );",

        "float audio = texture2D( texture , vec2( vUv.x , 0.0 ) ).g;",
        "float red = abs( sin( position.x * position.y + time / 5.0 ) );",
        "float green = abs( sin( position.x * position.y + time / 4.0 ) );",
        "float blue = abs( sin( position.x * position.y + time / 3.0 ) );",
        "gl_FragColor = vec4( audio * 1.0 , 0.1 , 0.1 , 1.0 );",

    "}"

  ].join( "\n" );


  var vertexShader = [

    "varying vec2 vUv;",
    "uniform sampler2D  texture;",
    "uniform float      textureSize;",


    "void main() {",
        "vUv = uv;",
        "vec3 nPos = normalize(position) * 1.0;",
        "nPos.x *=  texture2D( texture , vec2( abs(nPos.x) , 0.0 ) ).g;",
        "nPos.y *=  texture2D( texture , vec2( abs(nPos.y) , 0.0 ) ).g;",
        "nPos.z *=  texture2D( texture , vec2( abs(nPos.z) , 0.0 ) ).g;",
        "vec3 newPos = abs(nPos) * position;",
        "vec4 mvPosition = modelViewMatrix * vec4( newPos , 1.0 );",
        "gl_Position = projectionMatrix * mvPosition;",
    "}"

  ].join( "\n" );

  womb = new Womb({
    cameraController: 'OrbitControls',
    objLoader:        true,
    massController:   true,
    springController: true,
    test:             true, 
    //effectComposer:   true
  });
  
  womb.scene = womb.world.scene;
   
  womb.stream = womb.audioController.createUserAudio();
  /* womb.stream = womb.audioController.createStream( '../audio/quoi.mp3' );

  womb.stream.play();
  var s = womb.world.size / 10 ;
  var sphere = new THREE.Mesh( 
    new THREE.CubeGeometry( s , s , s ),
    material
  );
  womb.scene.add( sphere );
*/

  womb.stream.onStreamCreated = function(){ 
    
    var light = new THREE.AmbientLight( 0x404040 );


    var uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2( window.innerWidth , window.innerHeight ) },
      texture: { type: "t", value: womb.stream.texture.texture },
      textureSize: { type: "float" , value: womb.stream.texture.pixels }
    };

  womb.material = new THREE.ShaderMaterial( {

    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide

  } );


  for( var i = 0; i < 2; i++ ){
    
    var sphere = new THREE.Mesh( 
      //new THREE.CubeGeometry( womb.world.size / 10 , womb.world.size / 10   , womb.world.size / 10 , 20 , 20 , 20  ),
      //new THREE.SphereGeometry( womb.world.size / 10 , 30 , 30 ),
      new THREE.IcosahedronGeometry( womb.world.size / (i+1), 5 ),
      womb.material
    );

   // var pos = m.toCart( womb.world.size / 4 , 0, 2* Math.PI * (i / 2)  );
    sphere.position.x = womb.world.size/4 * i;

    womb.scene.add( sphere );

  }

    womb.loader.loadBarAdd();
  };
 
  //womb.stream = womb.audioController.createStream( '../audio/quoi.mp3' );
 
  //womb.stream.play();

  womb.audioController.gain.gain.value = 0;

//  womb.world.objLoader.loadFile( 'js/lib/models/tree.obj' , function(geo){



  womb.loader.loadBarAdd();

  womb.update = function(){

    
    womb.material.uniforms.time.value += 1.0;

  }

  womb.start = function(){


  }


});
