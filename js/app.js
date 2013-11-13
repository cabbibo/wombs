/*
 
   TODO:

    - Figure out how to connect shaders
    - Figure out how to pass audio as attributes to shader
    - Figure out how to tell if any of the children of a 'Loop Object' 
       have been hovered over
   
    - Build in tween system
    - Build in a loop object which has score, fade in and fade out properties
    - Add in fade out and fade in functions to the Audio.js

    - configure paths

*/
define(function(require, exports, module) {

  
  var Womb    = require('app/Womb');
  womb        = new Womb({
    cameraController: 'LeapSpringControls',
    objLoader:        true,
    massController:   true,
    springController: true,
    //effectComposer:   true,
  });
    
  var m = require('app/utils/Math');

  var LeapController = require( 'app/utils/LeapController' );
  //womb.stream = womb.audioController.createUserAudio();


  // Hack to keep from starting multiple time
  // TODO: Clean
  //womb.loader.numberToLoad ++;
  /*womb.stream = womb.audioController.userAudio;
  womb.audioController.userAudio.onStreamCreated = function(){
    womb.loader.loadBarAdd();
  }

  womb.audioController.gain.gain.value = 1;
*/

  womb.leapController = LeapController;

  womb.testScene = womb.world.sceneController.createScene({
    transition:'scale' 
  });

  womb.testScene.lights = [];
  for( var i = 0; i < 3; i++ ){

    color = new THREE.Color();
    color.setHSL( Math.random() , .8 , .8 );

    var hex = color.getHex();
    var light = new THREE.DirectionalLight( hex , .5 );
    var x = Math.randomRange( 2 );
    var y = Math.randomRange( 2 );
    var z = Math.randomRange( 2 );

    light.position.set( x , y , z );
 
    womb.testScene.scene.add( light );
    womb.testScene.lights.push( light );

  }

  var mainGeometry = new THREE.Geometry();
  
  var mat = new THREE.MeshNormalMaterial();
  var geo = new THREE.CubeGeometry( 1 , 1 , 1 );

  womb.clusters = [];

  for( var i = 0; i < 30; i++ ){

    var clusterGeo = new THREE.Geometry();


    for( var j = 0; j < 500; j ++ ){
      
      var testMesh = new THREE.Mesh( geo , mat );
   
      testMesh.position = Math.THREE.randomSpherePosition( womb.world.size );
      Math.THREE.setRandomRotation( testMesh.rotation );

      THREE.GeometryUtils.merge( clusterGeo , testMesh ); 

    }

    var color     = new THREE.Color().setHSL( Math.random() , .5 , .5 );
    var HSL       = color.getHSL();
    var specular  = new THREE.Color().setHSL( HSL.h , .8 , .8 );


    var mat = new THREE.MeshPhongMaterial({
      color:        color,
      specualar: specular,
      //emmisive:  
      shininess:      500
      //shading:        
    });


    var cluster = new THREE.Mesh( clusterGeo , mat );

    cluster.position = Math.THREE.randomPosition( 20 * womb.world.size );
    Math.THREE.setRandomRotation( testMesh.rotation );


    womb.clusters.push( cluster );
    womb.testScene.scene.add( cluster );

  } 

  womb.controls = womb.world.cameraController.controls;

  womb.anchorLight = new THREE.PointLight( 0xffffff , 2 ,  2 * womb.world.size);
  womb.anchorLight.position = womb.controls.anchor.position;
  womb.world.scene.add( womb.anchorLight );

  womb.fingerLight = new THREE.PointLight( 0xffffff , 5 , womb.world.size);
  womb.fingerLight.position = womb.controls.fingerIndicator.position;
  womb.world.scene.add( womb.fingerLight );




  womb.skybox = new THREE.Mesh( 
      new THREE.SphereGeometry( womb.world.size * 999 , 60, 40 ), 
      new THREE.MeshBasicMaterial({ 
        map: THREE.ImageUtils.loadTexture( 'img/starMap.png',{},function(){
          womb.loader.loadBarAdd();
        }),
        side:THREE.BackSide,
        depthWrite:false,
        fog:false
      }) 
  );     
  womb.world.scene.add( womb.skybox );

  womb.world.camera.far = womb.world.size * 999;

  womb.world.scene.fog.far = womb.world.camera.far / 2;
  console.log( womb.world );
  womb.world.camera.updateProjectionMatrix();
  womb.loader.loadBarAdd();
  womb.update = function(){

    womb.skybox.position = womb.world.camera.position;
 
    womb.fingerLight.position = womb.controls.fingerIndicator.position;
    //console.log( womb.fingerLight.position );
    //console.log( this.leapController );
    /*this.f = LeapController.frame();

    if( !this.oF ) this.oF = this.f;

    if( !this.oF.hands.length && this.f.hands.length ){

    }else if( this.oF.hands.length && !this.f.hands.length ){

     // womb.triggerEvent();
    }

    this.oF = this.f;*/

  }


  womb.start = function(){
    womb.leapController.start();
    womb.testScene.enter();
  }


});

