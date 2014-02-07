/*
 
   Fractal Combo:

   What a delightfully organic species the Fractal Combo is. 
   
   Its delicately textured skin has been said to cure diseases at a mere glance.
   Although it can get relatively chaotic in its temperment, changing its SPEED
   parameter will calm it down to whatever level of intensity you enjoy.

   Changing the COMPLEXITY parameter will tell you how deep into the mind of 
   the fractal beast you will see, whereas the VARIANCE will determine how much
   its skin crawls if it is being updated. INFLUENCE directs the proportion of 
   how much is the original color, and how much is the fractal color.

   Notes:
   
   -  The Fractal Combo is quite a complex beast, thus make sure it 
      remains relatively small, or your GPU will hate you. Covering 
      the screen with a Fractal Combo is NOT recommended.

  Ways in which you can help the Fractal Combo can grow:

  - a 'numOfFractals' parameter may be added, so it could be the 
    combination of 1-100 fractals

  - the vertex shader should be able to be passed in, making the
    body of the beast variable,but the skin still fractal as FUK.

*/

define(function(require, exports, module) {
 
  var placementFunctions  = require( 'Utils/PlacementFunctions'   );
  var Duplicator          = require( 'Components/Duplicator'      );
  var FractalCombo        = require( 'Species/Meshes/FractalCombo');
  
  function FractalBeing( womb , parameters ){

    womb.loader.addToLoadBar();

    var params = _.defaults( parameters || {} , {

      
      spin:       .001,
      
      color:      new THREE.Vector3( 0.5 , 0.0 , 1.5 ),
      
      seed:       new THREE.Vector3( -0.7 , -0.8 ,  -0.9),
      seed1:      new THREE.Vector3( -0.7 , -0.6 ,  -0.5),
      seed2:      new THREE.Vector3( -0.6 , -0.6 ,  -0.6),
      seed3:      new THREE.Vector3( -0.9 , -0.6 ,  -0.8),
      seed4:      new THREE.Vector3( -0.6 , -0.8 ,  -0.7),
      
      speed:       10,
      lightness:   .9,
      radius:      10,

      audioPower: 0.8,
      noisePower: 0.4,
      opacity:      1,
      complexity:   5,
      variance:    .5,
      influence:    3,

      size: .1,

      numOf:                                   5,
      placementFunction: placementFunctions.ring,
      placementSize:               womb.size / 4,

      audio:      womb.audioController.createLoop( '/lib/audio/loops/dontReallyCare/1.mp3' ),
      additive:   false, 
 
      geo:        new THREE.IcosahedronGeometry( 50 , 5 ),
 
    });
   
    var being = womb.creator.createBeing();

    console.log( being );
    var fractalMesh = new FractalCombo( being , params ); 

    var duplicator = new Duplicator( fractalMesh , {
     
      numOf:              params.numOf,
      placementFunction:  params.placementFunction,
      size:               params.placementSize

    });

    duplicator.addAll();
    duplicator.placeAll();

    being.mesh = fractalMesh;
    being.duplicator = duplicator;

    womb.loader.loadBarAdd();

    return being;

  }

  module.exports = FractalBeing;

});
