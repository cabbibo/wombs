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
 
  var placementFunctions  = require( 'Utils/PlacementFunctions'       );
  var Mesh                = require( 'Components/Mesh'                );
  var Duplicator          = require( 'Components/Duplicator'          );
  var FractalCombo        = require( 'Species/Materials/FractalCombo' );
  
  function FractalBeing( womb , parameters ){

    womb.loader.addToLoadBar();

    var params = _.defaults( parameters || {} , {
 
      geometry:        new THREE.IcosahedronGeometry( 50 , 5 ),
      size:             1, 
 
      numOf:            10,
      placementFunction:        placementFunctions.ring,
      placementSize:             womb.size / 4

    });
   
    var being = womb.creator.createBeing();


    // THIS! is where the sexiness comes from!
    // making sure to pass through parameters
    var fractalMaterial = new FractalCombo( womb , params ); 

    var fractalMesh = new Mesh( being , {
      geometry: params.geometry,
      material: fractalMaterial
    });

    fractalMesh.scale.multiplyScalar( params.size );
    
    var duplicator = new Duplicator(  fractalMesh , being , {
     
      numOf:              params.numOf,
      placementFunction:  params.placementFunction,
      size:               params.placementSize

    });

    duplicator.addAll();
    duplicator.placeAll();

    being.fractal = fractalMesh;
    being.duplicator = duplicator;

    womb.loader.loadBarAdd();

    return being;

  }

  module.exports = FractalBeing;

});
