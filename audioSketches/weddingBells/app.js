define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                  );
  
  var FractalBeing       = require( 'Species/Beings/FractalBeing');

  var m                   = require( 'Utils/Math'                 );
  /*
   
     Create our womb

  */
  var link = 'https://soundcloud.com/cashmerecat/';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    title:            'Wedding Bells - Cashmere Cat',
    link:             link, 
    summary:          info,
    stats: true
  });


  var file = '/lib/audio/tracks/weddingBellsLoop.wav';

  womb.audio = womb.audioController.createLoop( file  );
  //womb.audioController.gain.gain.value = 0;


  womb.modelLoader.loadFile( 'OBJ' , '/lib/models/mug_11530_10.obj' , function( object ){

    if( object[0] instanceof THREE.Mesh ){
    }

    if( object[0] instanceof THREE.Geometry ){
      var geo = object[0];
      geo.computeFaceNormals();
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
      geo.computeBoundingBox();
      
      womb.modelLoader.assignUVs( geo );
     
      womb.onMugLoad( geo);
    }

  });

  womb.onMugLoad = function( geo ){


      womb.loader.loadBarAdd();

      console.log( geo );
      womb.fractal1 = new FractalBeing( womb, {

        geometry: geo,
        texture:    womb.audio.texture,
        opacity: .01,
        texturePower:5,
        noisePower:3,
      
        displacementPower: 0.3,
        displacementOffset: 15.0,

        placementSize: womb.size/20,

        numOf: 10,
        color: new THREE.Vector3( 0.5 , 0.0 , 1.5 ),
        influence: 1,

      });

      console.log( womb.fractal1 );
      womb.fractal1.fractal.material.updateSeed();
      
      womb.looper = womb.audioController.createLooper( womb.audio , {
        beatsPerMinute: 150.1 
      });

      

      console.log('HELLO');
      // Flute:
      womb.looper.addSequence( 
      
      function( hitInfo ){
        console.log('HELLO');
        womb.fractal1.body.rotation.z += .5;
        var x = Math.random();
        var y = Math.random();
        var z = Math.random();
        womb.fractal1.fractal.material.uniforms.color.value.set( x * 2 , y / 2 , z ); 
        womb.fractal1.fractal.material.uniforms.opacity.value = Math.random() * .3;
      } , 
      16 , 
      [

        [ 0 , [.4] ],
        [ 1 , [.4] ],
        [ 2 , [.4] ],
        [ 3 , [.4] ],
        
        [ 4 , [.4] ],
        [ 5 , [.4] ],
        [ 6 , [0.0, .25 , .35 , .55 , .85] ],
      

        [ 8 , [.4] ],
        [ 9 , [.4] ],
        [ 11 , [0.0 , .4] ],
        
        [ 12 , [0.0, .25 , .35 , .55 , .85] ],
      ]);


      console.log( womb.looper );

  }



  womb.update = function(){

  }

  womb.start = function(){

    womb.fractal1.enter();
    womb.audio.play();

  }


});
