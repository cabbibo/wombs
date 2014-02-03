define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb' );
  /*
   
     Create our womb

  */
  var link = 'http://robbietilton.com';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    title:            'Looper',
    stats:            true,
  });


  womb.audioController.gain.gain.value = 0;

  womb.audio = womb.audioController.createLoop( 
    '/lib/audio/loops/dontReallyCare/1.mp3' 
  );

  womb.looper = womb.audioController.createLooper( womb.audio );

  womb.loader.loadBarAdd();

  womb.update = function(){


  }

  womb.start = function(){

    womb.audio.play();

  }


});
