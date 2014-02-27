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

  
  var Womb    = require( 'app/Womb' );
  womb        = new Womb({
    cameraController: 'LeapFlyControls',
    objLoader:        true,
    massController:   true,
    springController: true,
    //effectComposer:   true,
  });
    
  var m                   = require( 'app/utils/Math'               );
  var AudioGeometry       = require( 'app/three/AudioGeometry'      );
  var LeapController      = require( 'app/utils/LeapController'     );
  var AnalyzingFunctions  = require( 'app/utils/AnalyzingFunctions' );


  // Hack to keep from starting multiple time
  // TODO: Clean
  //womb.loader.numberToLoad ++;
  /*womb.stream = womb.audioController.userAudio;
  womb.audioController.userAudio.onStreamCreated = function(){
    womb.loader.loadBarAdd();
  }

  womb.audioController.gain.gain.value = 1;
*/

  womb.audioController.gain.gain.value = 0;

  womb.leapController = LeapController;

  womb.testScene = womb.world.sceneController.createScene({
    transition:'scale' 
  });

  womb.testScene.lights = [];
  for( var i = 0; i < 3; i++ ){

    color = new THREE.Color();
    color.setHSL( Math.random() , .8 , .8 );

    var hex = color.getHex();
    var light = new THREE.DirectionalLight( hex , .6 );
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
  womb.clusterGeos = [];

  var audioArray = [

    "audio/loops/1.mp3",
    "audio/loops/2.mp3",
    "audio/loops/3.mp3",
    "audio/loops/4.mp3",
    "audio/loops/5.mp3",
    "audio/loops/6.mp3",
    "audio/loops/7.mp3",

  ];


  /*
  

     AAAAAA UU  UU DDDD   II OOOOOO
     AA  AA UU  UU DD  DD II OO  OO
     AAAAAA UU  UU DD  DD II OO  OO
     AA  AA UU  UU DD  DD II OO  OO
     AA  AA UUUUUU DDDD   II OOOOOO

     CCCCCC LL     UU  UU SSSSSS TTTTTT EEEEEE RRRRR
     CC     LL     UU  UU SS       TT   EE     RR  RR
     CC     LL     UU  UU SSSSSS   TT   EEEEEE RRRRR 
     CC     LL     UU  UU     SS   TT   EE     RR RR 
     CCCCCC LLLLLL UUUUUU SSSSSS   TT   EEEEEE RR  RR 


  */

  function AUDIOCLUSTER( loop , color , radius ){

    this.scene = womb.world.sceneController.createScene({
      transition:'scale'
    });

    this.radius = radius;

    console.log( this.radius );

    this.audio = womb.audioController.createLoop( loop , {
     
      onLoad:function( loop ){
        console.log( 'does audio load fire here?' );
        loop.turnOnFilter();
      }

    });

    var geo = new THREE.IcosahedronGeometry( this.radius / 10 , 1 );
    var fullGeo = new THREE.Geometry();

    for( var i = 0 ; i < 30 ; i ++){

      var mesh = new THREE.Mesh( geo , mat );
      mesh.position = Math.THREE.randomSpherePosition( this.radius );
      Math.THREE.setRandomRotation( mesh.rotation );

      THREE.GeometryUtils.merge( fullGeo , mesh ); 

    }


    this.audioGeometry = new AudioGeometry( fullGeo , this.audio , {
      analyzingFunction: AnalyzingFunctions.straightScaleIn( 500 )
    });


    this.color      = color;
    this.hue        = this.color.getHSL().h;
    this.specular   = new THREE.Color().setHSL( this.hue , .8 , .8 );

    this.material = new THREE.MeshPhongMaterial({
      color:             this.color,
      specular:       this.specular,
      emmisive:       this.emmisive,
      shininess:                500,
    });


    this.mesh = new THREE.Mesh( this.audioGeometry.geometry , this.material );

    this.scene.scene.add( this.mesh );

  }

  AUDIOCLUSTER.prototype.onAudioLoad = function(){

    console.log('Does Audio Load fire Here? ');
     this.audio.turnOnFilter();

  }

  AUDIOCLUSTER.prototype.update = function(){

    // Gets the position to the camera
    var cP = womb.world.camera.position;
    var p  = this.scene.scene.position;

    var d  = new THREE.Vector3().subVectors( cP , p );
    var l  = d.length();

    // If we are within the radius of the cluster, 
    // make it so the frequency cutoff
    var scaled = ( this.radius - l  ) / this.radius ;

    if( scaled < 0 ){

      this.audio.filter.frequency.value = this.audio.filter.frequency.minValue * 5;

    }else{

      var newFrequency = scaled * (this.audio.filter.frequency.maxValue/2) + 10;
      this.audio.filter.frequency.value = newFrequency;

    }
   
    this.audioGeometry.update();

  }

  
  //var audioArray
  for( var i = 0; i < audioArray.length; i++ ){

    var loop    = audioArray[i];
    var color   = new THREE.Color().setHSL( Math.random() , .5 , .5 );
    var radius  = Math.randomRangePos( womb.world.size * 2 ) + womb.world.size*2;
    var cluster = new AUDIOCLUSTER( loop , color , radius );

    cluster.scene.scene.position = Math.THREE.randomPosition( 20 * womb.world.size );
    Math.THREE.setRandomRotation( cluster.scene.scene.rotation );

    womb.clusters.push( cluster );

  }


  womb.controls = womb.world.cameraController.controls;

  /*womb.anchorLight = new THREE.PointLight( 0xffaaaa , 2 ,  2 * womb.world.size);
  womb.anchorLight.position = womb.controls.anchor.position;
  womb.world.scene.add( womb.anchorLight );

  womb.fingerLight = new THREE.PointLight( 0xaaaaff , 3 , womb.world.size);
  womb.fingerLight.position = womb.controls.fingerIndicator.position;
  womb.world.scene.add( womb.fingerLight );*/



  womb.loader.numberToLoad ++;

  womb.skybox = new THREE.Mesh( 
      new THREE.SphereGeometry( womb.world.size * 999 , 60, 40 ), 
      new THREE.MeshBasicMaterial({ 
        map: THREE.ImageUtils.loadTexture( 'img/starMap.png',{},function(){
          womb.loader.loadBarAdd();
          console.log('dun');
          womb.world.scene.add( womb.skybox );

        }),
        side:THREE.BackSide,
        depthWrite:false,
        fog:false
      }) 
  );    


  womb.world.camera.far = womb.world.size * 999;

  womb.world.scene.fog.far = womb.world.camera.far / 2;
  womb.world.camera.updateProjectionMatrix();
  womb.loader.loadBarAdd();
  
  womb.update = function(){

    womb.skybox.position = womb.world.camera.position;
 
   // womb.fingerLight.position = womb.controls.fingerIndicator.position;
    //console.log( womb.fingerLight.position );
    //console.log( this.leapController );
    /*this.f = LeapController.frame();

    if( !this.oF ) this.oF = this.f;

    if( !this.oF.hands.length && this.f.hands.length ){

    }else if( this.oF.hands.length && !this.f.hands.length ){

     // womb.triggerEvent();
    }

    this.oF = this.f;*/

    for( var i = 0; i < this.clusters.length; i ++ ){

      this.clusters[i].update();

    }

  }


  womb.start = function(){
    this.leapController.start();
    this.testScene.enter();

    for( var i = 0; i < this.clusters.length; i++ ){

      this.clusters[i].scene.enter();
      this.clusters[i].audio.play();

    }
  }


});

