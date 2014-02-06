define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'             );
  var NewSpecies       = require( 'Species/NewSpecies'  );

  
  /*
   
     Create our womb

  */
  var link = 'https://github.com/mrdoob/sporel';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    title:            'FractalCombo',
    link:             link, 
    summary:          info,
    stats:            true,
    color:            '#000000',
    failureVideo:     84019684,
    size:             400
  });

  console.log( 'WHOA' );
  womb.newSpecies  = new NewSpecies( womb );

  womb.loader.loadBarAdd();

  womb.update = function(){

  }

  womb.start = function(){

    womb.newSpecies.enter();

  }

});
