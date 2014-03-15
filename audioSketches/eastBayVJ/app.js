define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'              );

   var m                   = require( 'Utils/Math'                 );
  var recursiveFunctions  = require( 'Utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var physicsParticles    = require( 'Shaders/physicsParticles'   );
  
  var PhysicsSimulator    = require( 'Species/PhysicsSimulator'   );


  var ShaderCreator       = require( 'Shaders/ShaderCreator'  );

  var Mesh                = require( 'Components/Mesh'                );
  var Duplicator          = require( 'Components/Duplicator'          );

  var placementFunctions  = require( 'Utils/PlacementFunctions'       );

  var link = 'https://soundcloud.com/disclosuremusic';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  var womb = new Womb({
    //title:    'Tenderly - Disclosure',
    //link:     link,
    //summary:  info,
    //stats:    true,
  });

  var file  = '/lib/audio/tracks/tenderly.mp3' ;
  //var audio = womb.audioController.createStream( file );

  var audio = womb.audioController.createUserAudio();
  womb.audioController.gain.gain.value = 0;

  var vjObjs = [];

  /*
   
     TENDERLY

  */
  vertexChunk = [

    "vec2 v2 = vec2(  abs( uv.x  - .5 )  , 0.0 );",
    "float a = texture2D( AudioTexture , v2).r;",
    
    "float r = a * a* a * 20.;",
    "float t = 3.14159  * ( 1. + a + uv.x );",
    "float p = 3.14159 * 2. *  (a + uv.y );",
    
    "vec3 newP = cart( vec3( r , t , p ) );",
    
    "pos += newP;",
    
    "vDisplacement = length( newP );",

  ];

  fragmentChunk = [
    "color = Color * (vDisplacement / 20. );",
    "color.x = 10. / polar( vPos ).x;",
  ];

  womb.shader = new ShaderCreator({
    vertexChunk:   vertexChunk,
    fragmentChunk: fragmentChunk,
    uniforms:{ 
     
      Time:         womb.time,
      Color:        { type:"v3" , value: new THREE.Vector3( .7 , .8 , 1.0 ) },
      AudioTexture: { type:"t"  , value: audio.texture },
    
    },
  });

  var TENDERLY = womb.creator.createBeing();

  var mesh = new Mesh( TENDERLY , {
      geometry: new THREE.IcosahedronGeometry( womb.size/20.0 , 4 ),
      material: womb.shader.material
  });

  //console.log(
  TENDERLY.body.scale.multiplyScalar( .1 );
    
  var duplicator = new Duplicator(  mesh , TENDERLY , {
     
      numOf:              10,
      placementFunction:  placementFunctions.ring,
      size:               womb.size / 10
  
  });
  duplicator.addAll();
  duplicator.placeAll();

  vjObjs.push( TENDERLY );


  /*
  
     FADE

  */
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

  ];

  fragmentChunk = [

    "color = abs( Color +.3 * abs(normalize(vPos_MV ))  + abs(nPos) + vDisplacement);",
    "vec3 normalColor = normalize( color );",
    "color += .1 * kali3( nPos , -1. * normalColor );",
    "color = normalize( color ) * vDisplacement;",

  ];

  fadeShader = new ShaderCreator({
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
  
  var FADE = womb.creator.createBeing();

  var mesh = new Mesh( FADE , {
      geometry:  new THREE.SphereGeometry( womb.size / 4 , 3 , 1000 ),
      material: fadeShader.material
  });

  mesh.add();

  vjObjs.push( FADE );


  /*
   
     WE OVER

  */
  womb.ps = new PhysicsSimulator( womb , {

    textureWidth: 300,
    debug: false,
    velocityShader: physicsShaders.velocity.curl,
    velocityStartingRange:.0000,
    startingPositionRange:[1 , .000002, 0 ],
    positionShader: physicsShaders.positionAudio_4,
    particlesUniforms:        physicsParticles.uniforms.audio,
    particlesVertexShader:    physicsParticles.vertex.audio,
    particlesFragmentShader:  physicsParticles.fragment.audio,

    bounds: 100,
    speed: .1,
    particleParams:   {
        size: 25,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        fog: true, 
        map: THREE.ImageUtils.loadTexture( '/lib/img/particles/lensFlare.png' ),
        opacity:    1,
      }, 
    audio: audio
  });


  vjObjs.push( womb.ps );


  womb.vjObjs = vjObjs;
  womb.loader.loadBarAdd();

  womb.start = function(){

    //FADE.enter();
    //TENDERLY.enter();
   // audio.play();

  }

});
