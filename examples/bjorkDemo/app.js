define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'              );
  var ShaderCreator       = require( 'Shaders/ShaderCreator'  );

  var Being                = require( 'Being/Being'            );
  var Mesh                = require( 'Components/Mesh'                );
  var Duplicator          = require( 'Components/Duplicator'          );
  var Clickable           = require( 'Components/Clickable'          );
  var Emitter          = require( 'Components/MeshEmitter'          );

  var placementFunctions  = require( 'Utils/PlacementFunctions'       );

  var link = 'https://soundcloud.com/disclosuremusic';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  var womb = new Womb({
  
    /*title:    'Tenderly - Disclosure',
    link:     link,
    summary:  info,*/
    stats:    true,
  
  });

 
  
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

  var cube = new THREE.CubeGeometry( 10 , 10 , 10 );

  var rockTexture = womb.imageLoader.load( '/lib/img/textures/disturb.jpg' );
  

  var activeShader = new ShaderCreator({
    //vertexChunk:   vertexChunk,
    //fragmentChunk: fragmentChunk,
    uniforms:{   
      Time:         womb.time,
      Color:        { type:"v3" , value: new THREE.Vector3(.1 , .1 , .6 ) },
      AudioTexture: { type:"t"  , value: womb.audioController.texture },
    },
  });

  var mesh = new THREE.Mesh( cube , activeShader.material );
  womb.scene.add( mesh );

  womb.loader.loadBarAdd();

  womb.start = function(){

  }

});
