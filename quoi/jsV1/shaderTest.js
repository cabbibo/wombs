define(function(require, exports, module) {

  var m                   = require( 'app/utils/Math'                 );
  var AudioGeometry       = require( 'app/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'app/utils/AnalyzingFunctions'   );

  var ShaderMaterial      = require( 'app/utils/ShaderMaterial'       );

  var Womb                = require( 'app/Womb'                       );
  

  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );

  var fragmentShader = [

    "uniform sampler2D  texture;",
    "uniform vec3 color;",
    "varying vec2 vUv;",

    "void main( void ) {",

        "float audio = texture2D( texture , vec2( vUv.x , 0.0 ) ).g;",
        "gl_FragColor = vec4( audio * color.r , audio * color.g , audio * color.b , 1.0 );",

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
    cameraController: 'LeapFlyControls',
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

    
    var r = Math.random();
    var g = Math.random();
    var b = Math.random();

    var uniforms = {
      texture: { type: "t", value: womb.stream.texture.texture },
      color:{ type: "v3" , value: new THREE.Vector3( r , g , b ) }
    };

    womb.material = new THREE.ShaderMaterial( {

      uniforms: uniforms,
      vertexShader: vertexShaders.audio.uv.absPos,
      fragmentShader: fragmentShaders.audio.color.position.absDiamond,
      side: THREE.DoubleSide,

    } );


    var numOf = 500;

    for( var i = 0; i < numOf; i++ ){
      
      var sphere = new THREE.Mesh( 
        new THREE.SphereGeometry( womb.world.size / 10 , 30 , 30 ),
        womb.material
      );

      var x = (Math.random() - .5 ) * womb.world.size;
      var y = (Math.random() - .5 ) * womb.world.size;
      var z = (Math.random() - .5 ) * womb.world.size;

      var pos = new THREE.Vector3( x , y , z );

      var x = Math.random() * Math.PI * 2;
      var y = Math.random() * Math.PI * 2;
      var z = Math.random() * Math.PI * 2;

      var rot = new THREE.Vector3( x , y, z );
     //var pos = m.toCart( womb.world.size / 4 ,  Math.PI * 2 * ( i / numOf ) , 0 );
     console.log( pos );
      sphere.position = pos;
      sphere.rotation.x = Math.randomRad();
      sphere.rotation.y = Math.randomRad();
      sphere.rotation.z = Math.randomRad();

      womb.scene.add( sphere );

    }
  
    womb.world.onWindowResize();

    womb.loader.loadBarAdd();
  };
 
  //womb.stream = womb.audioController.createStream( '../audio/quoi.mp3' );
 
  //womb.stream.play();

  womb.audioController.gain.gain.value = 0;

//  womb.world.objLoader.loadFile( 'js/lib/models/tree.obj' , function(geo){



  womb.loader.loadBarAdd();

  womb.update = function(){

    

  }

  womb.start = function(){


  }


});
