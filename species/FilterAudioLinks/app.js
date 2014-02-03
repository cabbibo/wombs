define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                  );
  var FilterAudioLinks    = require( 'Species/FilterAudioLinks'  );

  
  /*
   
     Create our womb

  */
  var link = 'https://github.com/mrdoob/sporel';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    title:            'FilterAudioLinks',
    link:             link, 
    summary:          info,
    stats:            true,
    color:            '#000000',
    failureVideo:     84019684,
    size:             400,
  });

  womb.filterAudioLinks = new FilterAudioLinks( womb );

  womb.loader.loadBarAdd();

 // womb.filterAudioLinks = new FilterAudioLinks( womb );


  womb.update = function(){

  }

  womb.start = function(){

    womb.filterAudioLinks.enter();

  }

});
