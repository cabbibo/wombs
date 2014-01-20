define(function(require, exports, module) {

  var Womb                = require( 'app/Womb'                       );

  var Ring                = require( 'app/scenes/html5_webGL/Ring'    );
  var Text                = require( 'app/scenes/html5_webGL/Text'    );
  var Image               = require( 'app/scenes/html5_webGL/Image'   );


  /*
   
     Create our womb

  */
  var link = 'http://soundcloud.com/';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    modelLoader:      true,
    textCreator:      true,
    raycaster:        true,
    title:            'Turbulence: Finding and Making your Happy Place',
    link:             link, 
    summary:          info,
    gui:              true,
    imageLoader:      true,
    stats:            true,
    color:            '#000000',
    failureVideo:     84019684,
    test: true,
    size:             400
  });

  womb.stream = womb.audioController.createUserAudio();

  womb.modelLoader.loadFile( 'OBJ' , '/lib/models/mug_11530_10.obj' , function( object ){

      if( object[0] instanceof THREE.Geometry ){

        womb.geo = object[0];
        womb.geo.computeFaceNormals();
        womb.geo.computeVertexNormals();
        
        womb.modelLoader.assignUVs( womb.geo );
       
        womb.onMugLoad( womb.geo );
      }

  });

  womb.onMugLoad = function( geo ){

   /* womb.voicePulser1  = new Ring( womb , {
      radius: womb.size / 5,
      geo:geo,    
      color: new THREE.Vector3( .9 , .4 , .0 ),
      numOf: 30
    });*/

   // womb.

  }

  console.log( womb.size );
  womb.voicePulser1  = new Ring( womb , {
    radius: womb.size / 5,
    //geo:geo,    
    color: new THREE.Vector3( .9 , .4 , .0 ),
    numOf: 1,
    opacity: 1

  });

  womb.happy = new Text( womb , {

    text: 'HAPPY',
    color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),

  });


  womb.wizard = new Image( womb , {

    image: '/lib/img/html5_webGL/wizardHat.png',
    color: new THREE.Vector3( 1.5 , 1.5 , 3.5 ),
    geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 )

  });

  womb.superman = new Image( womb , {

    image: '/lib/img/html5_webGL/supermanLogo.png',
    color: new THREE.Vector3( 1.5 , 1.5 , 1.5 ),
    geo: new THREE.PlaneGeometry( 100 , 100 , 50 , 50 )

  });

  womb.superman.enter();

  womb.stream.onStreamCreated =  function(){
  
  
  }

  womb.loader.loadBarAdd();
  
  womb.update = function(){

  }

  womb.start = function(){

  }

  womb.raycaster.onMeshHoveredOver = function(){

  }

  womb.raycaster.onMeshHoveredOut = function(){

  }
  

});
