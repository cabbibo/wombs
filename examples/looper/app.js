define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb' );
  var Mesh                = require( 'Components/Mesh' );
  
  var SingleFractal       = require( 'Species/Materials/SingleFractal' );
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



  womb.being = womb.creator.createBeing();

  fractal = new SingleFractal({
    texture: womb.audio.texture 
  });
  mesh = new Mesh(womb.being , {
    

    material: fractal
  });
  womb.being.addMesh( mesh );


  womb.looper = womb.audioController.createLooper( womb.audio , {
    
    
  });


  womb.looper.addHit( function(){

  } );

  womb.loader.loadBarAdd();

  womb.update = function(){


  }

  womb.start = function(){

    console.log( womb.being );
    womb.being.enter();
    womb.audio.play();

  }


});
