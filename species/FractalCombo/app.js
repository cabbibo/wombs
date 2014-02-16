define(function(require, exports, module) {

  var Womb      = require( 'Womb/Womb'                      );
 
  var Material  = require( 'Species/Materials/FractalCombo' );
  var Mesh      = require( 'Components/Mesh'                );

  
  /*
   
     Create our womb

  */
  var link = 'https://github.com/mrdoob/sporel';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    stats:            true,
  });

  being = womb.creator.createBeing();

  var file = '/lib/audio/tracks/weddingBellsLoop.wav'
  var audio = womb.audioController.createLoop( file );
  material = new Material( womb , {
  
    //noisePower:0,
    //texturePower:5
    texture: audio.texture.texture
    
  });
  
  fractalCombo = new Mesh( being , {
    geometry: new THREE.IcosahedronGeometry( womb.size / 10 , 7 ),
    material: material,
  });

  fractalCombo.add();

 /* womb.scene.add( new THREE.AmbientLight( 0xc0ffee ) );
  var mesh = new THREE.Mesh( 
      womb.defaults.geometry , 
     material 
  );

 womb.scene.add( mesh )
  console.log( fractalCombo );*/

  womb.loader.loadBarAdd();

  womb.update = function(){

  }

  womb.start = function(){

    audio.play();
    being.enter();
    console.log( fractalCombo );
    fractalCombo.material.updateSeed = true;

  }

});
