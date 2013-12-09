define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');


  var Womb                = require('app/Womb');

  womb = new Womb({
    cameraController: 'OrbitControls',
    objLoader:        true,
    massController:   true,
    springController: true,
    test:             true, 
    effectComposer:   true
  });
  
  womb.scene = womb.world.scene;
   
  womb.stream = womb.audioController.createUserAudio();
  womb.stream.onStreamCreated = function(){ 
    
    var light = new THREE.AmbientLight( 0x404040 );
    var mat   = new THREE.MeshPhongMaterial({
      color: 0xaaeebb,
      specular: 0xaaffcc,
      shininess:100,
      map: womb.stream.texture
    });

    var sphere = new THREE.Mesh( 
      new THREE.SphereGeometry( womb.size / 20 , 50 , 50 ), 
      mat 
    );


    womb.scene.add( sphere );

    womb.loader.loadBarAdd();
  };
 
  //womb.stream = womb.audioController.createStream( '../audio/quoi.mp3' );
 
  //womb.stream.play();

  womb.audioController.gain.gain.value = 0;

//  womb.world.objLoader.loadFile( 'js/lib/models/tree.obj' , function(geo){



  womb.loader.loadBarAdd();

  womb.start = function(){


  }


});
