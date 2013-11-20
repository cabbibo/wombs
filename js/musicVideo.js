
define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');

  var RingGeometry        = require( 'musicVideo/RingGeometry'    );
  var PhongBalls          = require( 'musicVideo/PhongBalls'      );



  var ColorList = {


    primary:        [ 0xFF9000 , 0xBF8130 , 0xA65E00 , 0xFFAC40 , 0xFFC273 ],
    secondaryA:     [ 0xFFBE00 , 0xBF9B30 , 0xA67B00 , 0xFFCE40 , 0xFFDB73 ],
    secondaryB:     [ 0xFF4500 , 0xBF5730 , 0xA62D00 , 0xFF7340 , 0xFF9973 ],
    complementary : [ 0x0A64A4 , 0x24577B , 0x03406A , 0x3E94D1 , 0x65A5D1 ]

  }
  // TODO:
  // app/utils/Vectors.js

  var Womb    = require('app/Womb');
  womb        = new Womb({
    cameraController: 'OrbitControls',
    objLoader:        true,
    massController:   true,
    springController: true,
   // effectComposer:   true,
  });
    
  var LeapController      = require('app/utils/LeapController'    );

//  womb.stream = womb.audioController.createStream( '../audio/quoi.mp3' );
//  console.log( womb.stream );
  womb.stream = womb.audioController.createUserAudio();
  womb.stream.onStreamCreated = function(){ womb.loader.loadBarAdd() };
  womb.audioController.gain.gain.value = 0;


  LeapController.size   = womb.world.size;
  LeapController.offset = new THREE.Vector3( 0 , 0 , - womb.world.size * 1.5 );
  

  /*
   
     Phong Balls

  */
 
  womb.phongBalls = [];
  for( var i = 0; i < 4; i++ ){
 
    var params = {

      lightColor: ColorList.primary[i],
      lightPosition: [ 
        Math.random() - .5 , 
        Math.random() - .5 ,
        Math.random() - .5 
      ],

      color: ColorList.secondaryA[i],
      specular: ColorList.secondaryB[i+1],
      emmisive: ColorList.complementary[i]

    }
    var pB = new PhongBalls( womb , womb.stream , params );
    pB.scene.index = i;
    pB.scene.update = function(){
  
      this.scene.rotation.x += this.index * .0005;
      this.scene.rotation.y += Math.sin( this.index ) * .005;
      this.audioGeometry.update();

    }
    womb.phongBalls.push( pB );

  }


  
  /*
  
     Mandala Scene 1

  */

  womb.mandalaScene1 = womb.world.sceneController.createScene({
    transition:'scale' 
  });

  womb.mandalaScene1.light = new THREE.DirectionalLight( 
      ColorList.complementary[4] , 
      .5 
  );
  womb.mandalaScene1.light.position.set( 0 , 1 , 0 );
  womb.mandalaScene1.scene.add( womb.mandalaScene1.light );

  womb.rings = [];

  womb.world.objLoader.loadFile( 'js/lib/models/tree.obj' , function(geo){


    for( var i = 0; i < 10; i ++ ){

      var params  = { 
        
        radius:       womb.world.size / ( 5 * i ),
        size:         womb.world.size / ( i + 10),
        lightColor:   ColorList.primary[i%4],
        lightPosition: [ 
          Math.random() - .5 , 
          Math.random() - .5 ,
          Math.random() - .5 
        ],

        color: ColorList.complementary[i%4],
        specular: ColorList.complementary[(i+1)%4],
        emmisive: ColorList.secondaryA[i%4]
      }

      ring = new RingGeometry( womb, geo[0] , womb.stream , params );
      womb.rings.push( ring );

    }

    womb.mandalaScene1.audioGeo = new AudioGeometry( geo[0] , womb.stream ,{
      analyzingFunction: AnalyzingFunctions.straightScale( 256 ) 
    });

    for( var i = 0; i < 10; i ++ ){

      var obj = new THREE.Mesh( 
        womb.mandalaScene1.audioGeo.geometry, 
        womb.mandalaScene1.material
      );
      obj.rotation.z = 2 * Math.PI * i / 10;
      
      womb.mandalaScene1.scene.add( obj );

    }

  });

  womb.mandalaScene1.geo = new THREE.IcosahedronGeometry( womb.world.size/20 , 2 );
  womb.mandalaScene1.material = new THREE.MeshPhongMaterial({
      color:        0x440077,
      emissive:     0x008877,
      specular:     0x440077,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  
  
  womb.mandalaScene1.update = function(){
    this.audioGeo.update();
  }


   /*
  
     Mandala Scene 2

  */

  womb.mandalaScene2 = womb.world.sceneController.createScene({
    transition:'scale' 
  });

  var light = new THREE.DirectionalLight( 0xfffff , .5 );
  light.position.set( 0 , -1 , 0 );
  womb.mandalaScene2.scene.add( light );
  
  var geo = new THREE.SphereGeometry( womb.world.size/10 , 20 , 5 );
  
  var material = new THREE.MeshPhongMaterial({
      color:        0x44aa77,
      emissive:     0xaa4477,
      specular:     0x44aa77,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  
  
  womb.mandalaScene2.audioGeo = new AudioGeometry( geo , womb.stream );

  womb.mandalaScene2.objects = [];

  for( var i = 0; i < 10; i ++ ){

    var r = womb.world.size / 5; 
    var t = 2*Math.PI * i / 10 ;
    var p = 0;

    var pos = Math.toCart( r , t , p );


    var obj = new THREE.Mesh( womb.mandalaScene2.audioGeo.geometry , material );
    obj.rotation.z = 2 * Math.PI * i / 10;

    obj.position = pos;
    obj.position.y = obj.position.z;
    //obj.position.z = -womb.world.size/5;

    womb.mandalaScene2.objects.push( obj );

    womb.mandalaScene2.scene.add( obj );

  }

  womb.mandalaScene2.update = function(){

    this.audioGeo.update();

    this.scene.rotation.z += .005;

    for( var i = 0; i < this.objects.length; i++ ){


      this.objects[i].rotation.y += (i+1) * .0005;

    }



  }


   /*
  
     Mandala Scene 3

  */

  womb.mandalaScene3 = womb.world.sceneController.createScene({
 
  });

  var light = new THREE.DirectionalLight( 0x00ffff , .5 );
  light.position.set( 1 , 0 , 0 );
  womb.mandalaScene3.scene.add( light );
  
  var geo = new THREE.CubeGeometry( womb.world.size/10 , womb.world.size/10, womb.world.size/10, 5  , 5 ,5 );
  
  var material = new THREE.MeshPhongMaterial({
      color:        0x3355aa,
      emissive:     0x005588,
      specular:     0x3355ff,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      side:         THREE.DoubleSide,
      opacity:      .5,
      wireframe:    true,
      transparent:  true
  });  
  
  womb.mandalaScene3.audioGeo = new AudioGeometry( geo , womb.stream , {
   
    analyzingFunction: AnalyzingFunctions.straightScale( 128 )
    
  });

  
  for( var i = 0; i < 10; i ++ ){

    var r = womb.world.size / 2; 
    var t = Math.PI * i / 10 ;
    var p = 0;

    var pos = Math.toCart( r , t , p );

    var obj = new THREE.Mesh( womb.mandalaScene3.audioGeo.geometry , material );
    obj.rotation.z = 2 * Math.PI * i / 10;

    obj.position = pos;

    womb.mandalaScene3.scene.add( obj );

  }

  womb.mandalaScene3.update = function(){

    this.scene.rotation.y += .005;
    this.scene.rotation.x += .002;
    this.audioGeo.update();

  }


    /*
  
     Mandala Scene 4

  */

  womb.mandalaScene4 = womb.world.sceneController.createScene({
    transition:'position' 
  });

  var light = new THREE.DirectionalLight( 0xffffff , .5 );
  light.position.set( -1 , 0 , 0 );
  womb.mandalaScene4.scene.add( light );
  
  var geo = new THREE.SphereGeometry( womb.world.size/10 , 10 , 10 , 10 );
  
  var material = new THREE.MeshPhongMaterial({
      color:        0xaaaa55,
      emissive:     0xaa6666,
      specular:     0xaaaa55,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  
  
  womb.mandalaScene4.audioGeo = new AudioGeometry( geo , womb.stream );

  
  for( var i = 0; i < 10; i ++ ){

    var r = womb.world.size / 2; 
    var t = Math.PI + Math.PI * i / 10 ;
    var p = 0;

    var pos = Math.toCart( r , t , p );

    var obj = new THREE.Mesh( womb.mandalaScene4.audioGeo.geometry , material );
    obj.rotation.z = 2 * Math.PI * i / 10;

    obj.position = pos;

    womb.mandalaScene4.scene.add( obj );

  }

  womb.mandalaScene4.timer = 0;

  womb.mandalaScene4.update = function(){


    this.timer ++;

    var scale = Math.cos( this.timer / 100 );

    this.scene.scale.x = (scale+2 )/ 2;
    this.scene.scale.y = (scale+2 )/ 2;
    this.scene.scale.z = (scale+2 )/ 2;

    this.scene.rotation.y += .002;
    this.scene.rotation.z += .005;


    this.audioGeo.update();

  }


  /*

  */



  womb.start = function(){

    for( var i = 0; i < womb.rings.length; i++ ){


      womb.rings[i].enter();

    }


    /*var t1 = setTimeout( function(){ womb.phongBalls[0].enter() }, 100 );
    var t2 = setTimeout( function(){ womb.phongBalls[1].enter() }, 400 );
    var t3 = setTimeout( function(){ womb.phongBalls[2].enter() }, 600 );
    var t4 = setTimeout( function(){ womb.phongBalls[3].enter() }, 950 );*/


   // var t1 = setTimeout( function(){ womb.phongBalls[0].exit() }, 100 );
   // var t2 = setTimeout( function(){ womb.phongBalls[1].exit() }, 400 );
   // var t3 = setTimeout( function(){ womb.phongBalls[2].exit() }, 600 );
   // var t4 = setTimeout( function(){ womb.phongBalls[3].exit() }, 950 );

    //womb.stream.play();

    var t1 = setTimeout( function(){ womb.mandalaScene2.enter() }, 5000 );
    var t2 = setTimeout( function(){ womb.mandalaScene3.enter() }, 10000 );
    var t3 = setTimeout( function(){ womb.mandalaScene4.enter() }, 15000 );

  }

});
