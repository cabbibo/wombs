define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                  );
  
  var FractalBeing       = require( 'Species/Beings/FractalBeing');

  var m                   = require( 'Utils/Math'                 );
  
  var Mesh                = require( 'Components/Mesh' );
  var Clickable           = require( 'Components/Clickable' );
  var Duplicator          = require( 'Components/Duplicator' );
  
  /*
   
     Create our womb

  */
  var link = 'https://soundcloud.com/cashmerecat/';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  var womb = new Womb({
    title:            'Wedding Bells - Cashmere Cat',
    link:             link, 
    summary:          info,
    stats: true
  });


  var file = '/lib/audio/tracks/weddingBellsLoop.wav';

  womb.audio = womb.audioController.createLoop( file  );
  //womb.audioController.gain.gain.value = 0;


  var being = womb.creator.createBeing();

  var mesh = new Mesh( being );
  //mesh.add();

  var duplicator = Duplicator( mesh );

  duplicator.addAll();


  Clickable( mesh , womb ,  {
    
    
  });


  

  womb.loader.loadBarAdd();

  womb.update = function(){

  }

  womb.start = function(){

    being.enter();
   
  }


});
