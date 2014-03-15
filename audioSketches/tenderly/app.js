define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'              );
  var ShaderCreator       = require( 'Shaders/ShaderCreator'  );

  var Mesh                = require( 'Components/Mesh'                );
  var Duplicator          = require( 'Components/Duplicator'          );

  var placementFunctions  = require( 'Utils/PlacementFunctions'       );

  var link = 'https://soundcloud.com/disclosuremusic';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  var womb = new Womb({
    title:    'Tenderly - Disclosure',
    link:     link,
    summary:  info,
    stats:    true,
  });

  var file  = '/lib/audio/tracks/tenderly.mp3' ;
  var audio = womb.audioController.createStream( file );

  console.log( audio );
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

  var being = womb.creator.createBeing();

  var mesh = new Mesh( being , {
      geometry: new THREE.IcosahedronGeometry( womb.size/20.0 , 6 ),
      material: womb.shader.material
  });

  //console.log(
  being.body.scale.multiplyScalar( .1 );
    
  var duplicator = new Duplicator(  mesh , being , {
     
      numOf:              10,
      placementFunction:  placementFunctions.ring,
      size:               womb.size / 10
  
  });

  duplicator.addAll();
  //duplicator.placeAll();

  womb.loader.loadBarAdd();

  womb.start = function(){

    being.enter();
    audio.play();

  }

});
