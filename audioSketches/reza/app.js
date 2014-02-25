define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                    );
  
  var FractalBeing        = require( 'Species/Beings/FractalBeing'  );

  var m                   = require( 'Utils/Math'                   );
  var Mesh                = require( 'Components/Mesh'              );
  var Clickable           = require( 'Components/Clickable'         );
  var MeshEmitter         = require( 'Components/MeshEmitter'       );
  var Duplicator          = require( 'Components/Duplicator'        );

  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'Species/PhysicsSimulator'   );
  var FBOParticles        = require( 'Species/FBOParticles'       );
  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var physicsParticles    = require( 'Shaders/physicsParticles'   );

  var TEXT = require('


  /*
   
     Create our womb

  */
  var link = 'https://soundcloud.com/cashmerecat/';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    //stats: true
  });

  /*
   
     Variables:

  */
  var numOfClickables = 20;
  var round           = 0;  // Which round of filled objects we have done
  var emissionRandomness = .3; // How random the direction is

  var hoverColor = new THREE.Vector3( 1.4 , .9 , .7 );
  var neutralColor = new THREE.Vector3( 1.9 , .4 , .5 );
  var selectedColor = new THREE.Vector3( .9 , 1.1 , .9 );
  var selectedHoverColor = new THREE.Vector3( 1.9 , 1.6 , .9 );

  var file = '/lib/audio/tracks/mutualCore.mp3';

  womb.audio = womb.audioController.createStream( file  );
  //womb.audioController.gain.gain.value = 0;

  /*
  
    SETTING UP OBJECTS!

  */

  height = 20,
  size = 70,
  hover = 30,

  curveSegments = 4,

  bevelThickness = 2,
  bevelSize = 1.5,
  bevelSegments = 3,
  bevelEnabled = true,

  font = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
  weight = "bold", // normal bold
  style = "normal"; // normal italic

  var geo = new THREE.TextGeometry( 'REZA' , {

    size: 10,
    height: 10,
    curveSegments: 10,

    font: "helvetiker",
    weight: 'regular'
    //font: font,
    //weight: weight,
    //style: style,

    //bevelThickness: bevelThickness,
    //bevelSize: bevelSize,
    //bevelEnabled: bevelEnabled,

    //material: 0,
    //extrudeMaterial: 1

  });

  console.log( geo );
  geo.computeFaceNormals();
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  geo.computeBoundingBox();
  
  geo.verticesNeedUpdate = true;
        //THREE.GeometryUtils.center(geo);
        
  womb.modelLoader.assignUVs( geo );
  
  womb.reza = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
    color:0x000000,
  }));
 
  womb.fboParticles = new FBOParticles({
    audioTexture: womb.audio.texture,
    numberOfParticles:1000000,
    geometry: geo
  });

        console.log( womb.fboParticles );
  womb.fboParticles.particles.scale.multiplyScalar( .05 );

  womb.fboParticles.body.add( reza );

  
  womb.looper = womb.audioController.createLooper( womb.audio , {
    beatsPerMinute: 150.1 
  });


  womb.loader.loadBarAdd();

  womb.update = function(){

  }

  womb.start = function(){

    womb.reza.enter();

  }

});
