define(function(require, exports, module) {

  var m                   = require( 'Utils/Math'                 );

  var Womb                = require( 'Womb/Womb'                  );
  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var physicsParticles    = require( 'Shaders/physicsParticles'   );
  
  var FBOShaders          = require( 'Shaders/FBOShaders'         );

  var FBOUtils            = require( 'Utils/FBOUtils'             );
  var helperFunctions     = require( 'Utils/helperFunctions'      );
  var m                   = require( 'Utils/Math'                 );

  var Mesh                = require( 'Components/Mesh'            );
  var FBOParticles        = require( 'Species/FBOParticles'       );
  
  //var shaderCreator       = require( 'Shaders/ShaderCreator' );
  /*
   
     Create our womb

  */


  womb = new Womb({
    stats:            true,
  });

   
   var audio = womb.audioController.createStream( '/lib/audio/tracks/weddingBellsLoop.wav' );

   console.log( audio );
  particles = new FBOParticles({
    numberOfParticles: 1000000,
  });


  /*var uniforms = shaderCreator.parse( 'uniform', FBOShaders.fragment.displaceSphere );
  var varyings = shaderCreator.parse( 'varying', FBOShaders.fragment.displaceSphere );

  console.log( uniforms );
  console.log( varyings );*/


  womb.loader.loadBarAdd();


  womb.start = function(){
    audio.play();

    particles.enter();

  }

});
