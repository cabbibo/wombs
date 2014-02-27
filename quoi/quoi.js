define(function(require, exports, module) {

  var m                   = require( 'app/utils/Math'                 );
  var AudioGeometry       = require( 'app/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'app/utils/AnalyzingFunctions'   );

  var Womb                = require( 'app/Womb'                       );

  var recursiveFunctions  = require( 'app/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );
  var shaderChunks        = require( 'app/shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'app/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );


  // Scenes
  var PhysicsSimulation   = require( 'app/scenes/quoi/PhysicsSimulator' );
  var AntiSerpenski1      = require( 'app/scenes/quoi/AntiSerpenski1'   );
  var AntiSerpenski2      = require( 'app/scenes/quoi/AntiSerpenski2'   );
  var Kitty               = require( 'app/scenes/quoi/Kitty'            );
  var Ring                = require( 'app/scenes/quoi/Ring'             );
  var Random              = require( 'app/scenes/quoi/Random'           );
  var Beauty              = require( 'app/scenes/quoi/Beauty'           );
  var FractalCombo        = require( 'app/scenes/quoi/FractalCombo'     );
  var Credits             = require( 'app/scenes/quoi/Credits'          );
  var Begin               = require( 'app/scenes/quoi/Begin'            );


  /*
   
     Scene for Quoi
   
  */ 
  /*
   
     Create our womb

  */
  var link = 'https://soundcloud.com/avalonemerson';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
 
  var socialLinks = [


    [ 'facebook_1.png'  , 'http://www.facebook.com/sharer.php?u=http://wom.bs/quoi' ],
    [ 'twitter_1.png'   , "http://twitter.com/share?text=Watch%20the%20new%20interactive%20video%20for%20%22Quoi%22,%20a%20track%20from%20@avalon_emerson%20on%20@ICEEHOT;%20visualized%20by%20@cabbibo%20&url=http://wom.bs/quoi/" ],
    //[ 'soundcloud_1.png' , 'http://soundcloud.com/avalonemerson' ],
    //[ 'cabbibo_1.png'   , 'http://twitter.com/cabbibo' ],
    //[ 'avalon_1.png'    , 'http://twitter.com/avalon_emerson' ],
   // [ 'iceeHot_1.png'   , 'http://iceehot.com'      ]

  ]


  womb = new Womb({
    cameraController: 'MouseMoveControls',
    modelLoader:      true,
    textCreator:      true,
    raycaster:        true,
    social:           socialLinks, 
    imageLoader:      true,
    color:            '#0f0020',
    failureVideo:     84019684,
    failureTitleText: 'Best viewed on Chrome. This project requires:',
    failureVideoText: 'But you can still watch the video version:',
    size: 400
  });

  var file = '/lib/audio/tracks/quoi.mp3';
 // womb.stream =   womb.audioController.createStream( file , { autoLoad: true } );

  womb.stream = womb.audioController.createNote( file );
  //womb.audioController.gain.gain.value = 0;

  womb.stream.loadProgress = function( e ){
    this.womb.loader.addLoadInfo( 'Loading Song: '+Math.floor( this.loaded * 100 ) +"%");
  }

  womb.camera.near = 1;

  womb.stream.onLoad = function(){
  
  }

  womb.moonTexture = womb.imageLoader.load( '../lib/img/sphere/moon_1024.jpg' );
 // womb.cookieTexture = womb.imageLoader.load( '../lib/img/quoi/cookieSprite.png' );

  womb.modelLoader.loadFile( 'OBJ' , '/lib/models/tree.obj' , function( object ){

      if( object[0] instanceof THREE.Mesh ){
      }

      if( object[0] instanceof THREE.Geometry ){

        womb.geo = object[0];
        womb.geo.computeFaceNormals();
        womb.geo.computeVertexNormals();
        
        womb.modelLoader.assignUVs( womb.geo );
       
        womb.onTreeLoad( womb.geo );
      }

  });

  womb.modelLoader.loadFile( 'OBJ' , '/lib/models/mug_11530_10.obj' , function( object ){

      if( object[0] instanceof THREE.Mesh ){
      }

      if( object[0] instanceof THREE.Geometry ){

        womb.geo = object[0];
        womb.geo.computeFaceNormals();
        womb.geo.computeVertexNormals();
        
        womb.modelLoader.assignUVs( womb.geo );
       
        womb.onMugLoad( womb.geo );
      }

  });

  womb.onTreeLoad = function( geo ){

    womb.kitty = new Kitty( womb , {
      modelScale: .2,
      noisePower: 3.0,
      audioPower: 1.5,
      geo: geo,
      color: new THREE.Vector3( .3 , .1 , .5 )
    });

    womb.kitty1 = new Kitty( womb , {
      modelScale: .2,
      noisePower: 3.0,
      audioPower: 1.5,
      geo: geo,
      color: new THREE.Vector3( .5 , .1 , .3 )
    });


    womb.treeRing = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: .8,
      radius: womb.size / 8,
      geo:geo,
      color: new THREE.Vector3( .8 , .3 , .0 )

    });

    womb.treeRing1 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: .8,
      radius: womb.size / 7,
      geo:geo,    
      color: new THREE.Vector3( .6 , .4 , .3 )
    });

     womb.treeRing2 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: .8,
      radius: womb.size / 6,
      geo:geo,    
      color: new THREE.Vector3( .6 , .1 , .0 )
    });

     womb.treeRing3 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: .8,
      radius: womb.size / 5,
      geo:geo,    
      color: new THREE.Vector3( .9 , .4 , .0 )
    });

     womb.treeRing4 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: .8,
      radius: womb.size / 5,
      geo:geo,    
      color: new THREE.Vector3( .7 , .4 , .8 )
    });


    womb.treeRing.update = function(){
      if( this.spinning == true ){
        this.scene.rotation.y += .006;
      }
    }

    womb.treeRing1.update = function(){
      if( this.spinning == true ){
        this.scene.rotation.y += .005;
      }
    }

    womb.treeRing2.update = function(){
      if( this.spinning == true ){
        this.scene.rotation.y += .004;
      }
    }

    womb.treeRing3.update = function(){
      if( this.spinning == true ){
        this.scene.rotation.y += .003;
      }
    }

    womb.treeRing4.update = function(){
      if( this.spinning == true ){
        this.scene.rotation.y += .007;
      }
    }

 
 
   womb.littleStars = new Random( womb , {
     
      radius: womb.size ,
      modelScale: 40,
      audioPower: -.5,
      noisePower:  .3,
      //geo: geo,
      color: new THREE.Vector3( .4 , .2 , .6 ),
      
    });

   womb.littleStars.update = function(){
      if( this.spinning == true ){
        this.scene.rotation.y += .002;
        this.scene.rotation.x -= .003;
        this.scene.rotation.z += .005;
      }
    }

   womb.littleStars1 = new Random( womb , {
     
      radius: womb.size ,
      modelScale: 40,
      audioPower: -.5,
      noisePower:  .3,
      //geo: geo,
      color: new THREE.Vector3( .3 , .1 , .7 ),
      
    });

   womb.littleStars1.update = function(){
      if( this.spinning == true ){
        this.scene.rotation.y -= .005;
        this.scene.rotation.x += .001;
        this.scene.rotation.z -= .007;
      }
    }

  womb.littleStars2 = new Random( womb , {
     
      radius: womb.size ,
      modelScale: 40,
      audioPower: -.5,
      noisePower:  .3,
      //geo: geo,
      color: new THREE.Vector3( .2 , .4 , .9 ),
      
    });

   womb.littleStars2.update = function(){
      if( this.spinning == true ){
        this.scene.rotation.y += .004;
        this.scene.rotation.x -= .005;
        this.scene.rotation.z -= .003;
      }
    }






  }




  womb.onMugLoad = function( geo ){

    womb.FRACTALCOMBO = new FractalCombo( womb , {
    //geo: new THREE.IcosahedronGeometry( womb.size / 4.0 , 6 ),
      geo: geo,
      modelScale: 15,
      numOf:8,
      noisePower: 1,
      audioPower: 2,
      lightness:  .3
    });


    womb.BEAUTYSQUARE = new Beauty( womb , {
      geo: geo,
      modelScale: 500
    });


    womb.mainPulse = new Kitty( womb , {
      modelScale: 10,
      noisePower: 3.0,
      audioPower: 5.0,
      geo: geo,
      color: new THREE.Vector3( .1 , .0 , .3 )
    });


    womb.mugRing = new Ring( womb , {
      noisePower: 3.3, 
      audioPower: 6.0,
      numOf:      6,
      modelScale: 10,
      radius: womb.size / 2,
      geo:geo 
    });

    womb.mugRing.update = function(){

      if( this.spinning == true ){
        this.scene.rotation.y += .004;
      }
    }


    womb.mugRing1 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: 10,
      audioPower: 5.0,
      numOf:      8,
      radius: womb.size / 1.6,
      geo:geo ,
      color :new THREE.Vector3( .7 , .5 , 1.3 ),
    });

    womb.mugRing1.update = function(){

      if( this.spinning == true ){
        this.scene.rotation.y += .001;
      }
    }

    womb.mugRing2 = new Ring( womb , {
      noisePower: 3.3, 
      audioPower: 6.0,
      numOf:      10,
      modelScale: 10,
      radius: womb.size / 1.4,
      geo:geo ,
      color :new THREE.Vector3( .5 , .5 , 1.5 ),
    });

    
    womb.mugRing2.update = function(){

      if( this.spinning == true ){
        this.scene.rotation.y += .006;
      }
    }

    womb.mugRing3 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: 10,
      audioPower: 10.0,
      numOf:      6,
      radius: womb.size / 1.3,
      geo:geo ,
      color :new THREE.Vector3( .9 , .5 , 1.1 ),
    });

    
    womb.mugRing3.update = function(){

      if( this.spinning == true ){
        this.scene.rotation.y += .003;
      }
    }

    womb.mugRing4 = new Ring( womb , {
      noisePower: 3.3,
      audioPower: 6.0,
      numOf:      8,
      modelScale: 10,
      radius: womb.size / 2.3,
      geo:geo ,
      color :new THREE.Vector3( 1.1 , .5 , .9 ),
    });

    
    womb.mugRing4.update = function(){

      if( this.spinning == true ){
        this.scene.rotation.y += .002;
      }
    }

    womb.mugRing5 = new Ring( womb , {
      noisePower: 3.3,
      audioPower: 5.0,
      numOf:      8,
      modelScale: 10,
      radius: womb.size / 2.3,
      geo:geo ,
      color :new THREE.Vector3( 1.7 , .5 , .5 ),
    });

    
    womb.mugRing5.update = function(){

      if( this.spinning == true ){
        this.scene.rotation.y += .005;
      }
    }


  }



  //womb.BEAUTYCUBE = new Beauty( womb );

  womb.PURE_texture = womb.textCreator.createTexture( 'DEAR' , { 
    square: true,
  });

  womb.AVALON_texture = womb.textCreator.createTexture( 'AVALON' , { 
    square: true,
  });


  womb.PURE = new Random( womb , {
   
    texture: womb.PURE_texture,
    radius: womb.size ,
    modelScale: 10
    
  });

  womb.AVALON = new Random( womb , {
   
    texture: womb.AVALON_texture,
    radius: womb.size ,
    modelScale: 10
    
  });



  womb.randomCubes = new Random( womb , {
   
    radius: womb.size ,
    modelScale: 10,
    color: new THREE.Vector3( .9 , .5 , 1.1 ),
    
  });

  womb.randomCubes1 = new Random( womb , {
   
    radius: womb.size ,
    modelScale: 10,
    color: new THREE.Vector3( 1.1 , .1 , .3),


    
  });

  womb.randomCubes2 = new Random( womb , {
   
    radius: womb.size ,
    modelScale: 10,
    color: new THREE.Vector3( .1 , .5 , 1.1 ),

    
  });

  womb.randomCubes3 = new Random( womb , {
   
    radius: womb.size ,
    modelScale: 10,
    color: new THREE.Vector3( .7 , .0 , 1.1 ),

    
  });

  womb.randomCubes4 = new Random( womb , {
   
    radius: womb.size ,
    modelScale: 10,
    color: new THREE.Vector3( .1 , .0 , 2.1 ),

    
  });

  womb.randomCubes.update = function(){

    if( this.spinning == true ){
      this.scene.rotation.x += .009;
      this.scene.rotation.y += .004;
      this.scene.rotation.z += .008;
    }

  }

  womb.randomCubes1.update = function(){

    if( this.spinning == true ){
      this.scene.rotation.x += .007;
      this.scene.rotation.y += .004;
      this.scene.rotation.z += .003;
    }

  }

  womb.randomCubes2.update = function(){

    if( this.spinning == true ){
      this.scene.rotation.x += .003;
      this.scene.rotation.y += .006;
      this.scene.rotation.z += .002;
    }

  }


  womb.randomCubes3.update = function(){

    if( this.spinning == true ){
      this.scene.rotation.x += .001;
      this.scene.rotation.y += .002;
      this.scene.rotation.z += .005;
    }

  }

  womb.randomCubes4.update = function(){

    if( this.spinning == true ){
      this.scene.rotation.x += .005;
      this.scene.rotation.y += .007;
      this.scene.rotation.z += .005;
    }

  }



 // womb.physicsSim = new PhysicsSimulation( womb //,
   
   /* {
      textureWidth:50,
    }*/
 // );


 // womb.physicsSim.enter();

  var fullGeo = new THREE.Geometry();
  var size = womb.size / 50;
  var geo = new THREE.CubeGeometry( size , size, size , 10 , 10 , 10 );
  var basicMaterial = new THREE.MeshBasicMaterial();


  var g = geo.clone();
  var m = new THREE.Mesh( g , basicMaterial );
  m.scale.multiplyScalar( 10 );
  THREE.GeometryUtils.merge( fullGeo , m );

  var recursiveArray = [];
    
  recursiveFunctions.antiSerpenski( 
    recursiveArray,
    new THREE.Vector3(),
    womb.size / 5,
    10,
    2.4,
    womb.size / 15
  );


  for( var i  = 0; i < recursiveArray.length; i++ ){

    var mesh = new THREE.Mesh(
      geo,
      basicMaterial 
    );

    mesh.position = recursiveArray[i][0];
    mesh.scale.multiplyScalar( recursiveArray[i][2] / 10 );

    THREE.GeometryUtils.merge( fullGeo , mesh );

  }

  var t = setTimeout( function(){
    womb.credits = new Credits( womb , {
      geo: fullGeo
    });
  } , 3000 );
 
  womb.antiSerp1 = new AntiSerpenski2( womb ,{
    geo: fullGeo,
    spin:.001,
    color: new THREE.Vector3( .5 , .3 , 1.2 ),
    radius:14,
  });
  womb.antiSerp1.scene.position.y = womb.size / 4;
  womb.antiSerp2 = new AntiSerpenski2( womb ,{
    geo: fullGeo,
    spin:.002, 
    color: new THREE.Vector3( .7 , .3 , 1.1 ),
    radius:12,
  });
  womb.antiSerp2.scene.position.y = womb.size / 8
  womb.antiSerp3 = new AntiSerpenski2( womb ,{
    geo: fullGeo,
    spin:.003,
    color: new THREE.Vector3( .9 , .3 , 1.0 ),
    radius:10,
  });
  womb.antiSerp3.scene.position.y = womb.size / 100000;
  womb.antiSerp4 = new AntiSerpenski2( womb ,{
    geo: fullGeo,
    spin:.004, 
    color: new THREE.Vector3( 1.3 , .3 , .9 ),
    radius:8,
  });
  womb.antiSerp4.scene.position.y = - womb.size / 8
  womb.antiSerp5 = new AntiSerpenski2( womb ,{
    geo: fullGeo,
    spin:.005, 
    color: new THREE.Vector3( 1.4 , .3 , .8 ),
    radius:6,
  });
  womb.antiSerp5.scene.position.y = -womb.size / 4




  womb.dropCenter = new Kitty( womb , {
    modelScale: 1,
    noisePower: 2.0,
    audioPower: .9,
    color: new THREE.Vector3( .5 , .3 , .3 )
  });


  // Delay for the sake of text creation
  var t = setTimeout (function(){ womb.begin = new Begin( womb ); }, 3000 );

  womb.loader.loadBarAdd();
  
  womb.update = function(){
    
  }

  womb.start = function(){

    //document.body.style.cursor = 'none';    
    
    var offset = -490;

    var begin = function(){

      womb.begin.enter();


    }

    var leave = function(){
      womb.begin.exit();
    }



    var start = function(){
      womb.begin.exit();
      womb.stream.play();
    }

    /*
     
       INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO INTRO

    */

    var firstHit = function(){
      womb.kitty.enter();
      womb.kitty1.enter();
    }


    var firstHO = function(){

      var t = womb.tweener.createTween({
        object: womb.kitty.scene,
        target: new THREE.Vector3( 0 , womb.size / 4 , 0 ),
        time: .4
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.kitty1.scene,
        target: new THREE.Vector3( 0 , -womb.size / 4 , 0 ),
        time: .4
      });
      t.start();

    };



   
    var intro1 = function(){ womb.antiSerp1.enter(); }
    var intro2 = function(){ womb.antiSerp2.enter(); }
    var intro3 = function(){ womb.antiSerp3.enter(); }
    var intro4 = function(){ womb.antiSerp4.enter(); }
    var intro5 = function(){ womb.antiSerp5.enter(); }
   
    var hihatsEnter = function(){


      var t = womb.tweener.createTween({
        object: womb.kitty.scene,
        target: new THREE.Vector3( womb.size / 4 , 0 , 0 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.kitty1.scene,
        target: new THREE.Vector3( -womb.size / 4 , 0 , 0 ),
        time: 1
      });
      t.start();


      var t1 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp1.scene,
        target: new THREE.Vector3( .3 , .3 , .3 ),
        time: 1
      });
      t1.start();

      var t2 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp2.scene,
        target: new THREE.Vector3( .3 , .3 , .3 ),
        time: 1
      });
      t2.start();

      var t3 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp3.scene,
        target: new THREE.Vector3( .3 , .3 , .3 ),
        time: 1
      });
      t3.start();

      var t4 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp4.scene,
        target: new THREE.Vector3( .3 , .3 , .3 ),
        time: 1
      });
      t4.start();

      var t5 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp5.scene,
        target: new THREE.Vector3( .3 , .3 , .3 ),
        time: 1
      });
      t5.start();


    };


    var move1 = function(){


      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.kitty.scene,
        target: new THREE.Vector3( .5 , .5 , .5 ),
        time: 30
      });
      t.start();
      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.kitty1.scene,
        target: new THREE.Vector3( .5 , .5 , .5 ),
        time: 30
      });
      t.start();

    }




    var move2 = function(){

      var t = womb.tweener.createTween({
        object: womb.kitty.scene,
        target: new THREE.Vector3( 0 , womb.size / 4 , 0 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.kitty1.scene,
        target: new THREE.Vector3( 0 , -womb.size / 4 , 0 ),
        time: 1
      });
      t.start();

      var t1 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp1.scene,
        target: new THREE.Vector3( .5,  .5 , .5 ),
        time: 1
      });
      t1.start();

      var t1 = womb.tweener.createTween({
        type: 'position',
        object: womb.antiSerp1.scene,
        target: new THREE.Vector3( 0 , 0 , 0 ),
        time: 1
      });
      t1.start();

      var t2 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp1.scene,
        target: new THREE.Vector3( .5 ,.5 , .5 ),
        time: 1
      });
      t2.start();

      var t2 = womb.tweener.createTween({
        type: 'position',
        object: womb.antiSerp2.scene,
        target: new THREE.Vector3( 0 , 0 , 0 ),
        time: 1
      });
      t2.start();

      var t5 = womb.tweener.createTween({
        type: 'rotation',
        object: womb.antiSerp2.scene,
        target: new THREE.Vector3( Math.PI / 2  , 0 , 0 ),
        time: 2
      });
      t5.start();


      var t3 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp3.scene,
        target: new THREE.Vector3(.5, .5 , .5),
        time: 1
      });
      t3.start();

      var t3 = womb.tweener.createTween({
        type: 'position',
        object: womb.antiSerp3.scene,
        target: new THREE.Vector3( 0 , 0 , 0 ),
        time: 1
      });
      t3.start();
      var t5 = womb.tweener.createTween({
        type: 'rotation',
        object: womb.antiSerp3.scene,
        target: new THREE.Vector3( Math.PI / 2  , 0 , 0 ),
        time: 3
      });
      t5.start();


      var t4 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp4.scene,
        target: new THREE.Vector3( .5, .5 , .5),
        time: 1
      });
      t4.start();

      var t4 = womb.tweener.createTween({
        type: 'position',
        object: womb.antiSerp4.scene,
        target: new THREE.Vector3( 0 , 0 , 0 ),
        time: 1
      });
      t4.start();
      var t5 = womb.tweener.createTween({
        type: 'rotation',
        object: womb.antiSerp4.scene,
        target: new THREE.Vector3( Math.PI / 2  , 0 , 0 ),
        time: 4
      });
      t5.start();

      var t5 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp5.scene,
        target: new THREE.Vector3( .5,.5 , .5 ),
        time: 1
      });
      t5.start();

      var t5 = womb.tweener.createTween({
        type: 'position',
        object: womb.antiSerp5.scene,
        target: new THREE.Vector3( 0 , 0 , 0 ),
        time: 1
      });
      t5.start();

      var t5 = womb.tweener.createTween({
        type: 'rotation',
        object: womb.antiSerp5.scene,
        target: new THREE.Vector3( Math.PI / 2  , 0 , 0 ),
        time: 3
      });
      t5.start();

    }

    var voiceUp = function(){
     

      womb.kitty.exit();
      womb.kitty1.exit();

      womb.randomCubes.enter();
     
    }


    /*
     *
FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP FIRST DROP   
     *
     */

    var firstDrop = function(){

      womb.treeRing.enter();
      womb.treeRing.scene.rotation.x = Math.PI / 2;

      womb.randomCubes.spinning = true;

      womb.antiSerp1.exit();
      womb.antiSerp2.exit();
      womb.antiSerp3.exit();
      womb.antiSerp4.exit();
      womb.antiSerp5.exit();
    }


    var afterFirstDrop = function(){

      womb.randomCubes.spinning = false;

      womb.treeRing.spinning  = true;

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.randomCubes.scene,
        target: new THREE.Vector3( .8 , .8 , .8 ),
        time: 3
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing.scene,
        target: new THREE.Vector3( .8 , .8 , .8 ),
        time: 3
      });
      t.start();



      womb.randomCubes1.enter();
      womb.randomCubes1.spinning = true;

      womb.treeRing1.enter();
      womb.treeRing1.scene.rotation.x = Math.PI / 2;

    }

    var afterFirstDrop1 = function(){

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.randomCubes.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 3
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.randomCubes1.scene,
        target: new THREE.Vector3( .8 , .8 , .8 ),
        time: 3
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 3
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .8 , .8 , .8 ),
        time: 3
      });
      t.start();


      womb.randomCubes1.spinning = false;
      womb.randomCubes2.enter();
      womb.randomCubes2.spinning = true;

      womb.treeRing2.enter();
      womb.treeRing2.scene.rotation.x = Math.PI / 2;

      womb.treeRing1.exit();
    }

    var afterFirstDrop2 = function(){

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.randomCubes.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 3
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.randomCubes1.scene,
        target: new THREE.Vector3( .8 , .8 , .8 ),
        time: 3
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 3
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .8 , .8 , .8 ),
        time: 3
      });
      t.start();


      womb.randomCubes2.spinning = false;

      womb.randomCubes.exit();
      womb.randomCubes1.exit();

      womb.randomCubes3.enter();
      womb.randomCubes3.spinning = true;

      womb.randomCubes4.enter();
      womb.randomCubes4.spinning = true;

      womb.treeRing3.enter();
      womb.treeRing3.scene.rotation.x = Math.PI / 2;

      womb.treeRing2.spinning  = true;

      womb.treeRing.exit();
    }


/*

 * SECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROPSECOND DROP

 */
    var secondDrop = function(){

      //womb.randomCubes.exit();
      //womb.randomCubes1.exit();
      womb.randomCubes2.exit();
      womb.randomCubes3.exit();
      womb.randomCubes4.exit();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing.scene,
        target: new THREE.Vector3( .4 , .4 , .4 ),
        time: 3
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 3
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing2.scene,
        target: new THREE.Vector3( .8 , .8 , .8 ),
        time: 3
      });
      t.start();

      womb.treeRing3.enter();
      womb.treeRing3.scene.rotation.x = Math.PI / 2;

      womb.treeRing3.spinning = true;

      womb.treeRing4.enter();
      womb.treeRing4.scene.rotation.x = Math.PI / 2;
    
    }
  


    var afterSecondDrop = function(){

      womb.treeRing.exit();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .5 , .5 , .5 ),
        time: 4
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .7 , .7 , .7 ),
        time: 2

      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.treeRing3.scene,
        target: new THREE.Vector3( -womb.size / 4 , 0 , 0 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.treeRing4.scene,
        target: new THREE.Vector3( womb.size / 4 , 0 , 0 ),
        time: 1
      });
      t.start();

      womb.mugRing.enter();
      womb.mugRing.scene.scale.multiplyScalar( .1 );
      womb.mugRing.scene.rotation.x = Math.PI / 2;

    }

    var afterSecondDrop1 = function(){

      womb.treeRing1.exit();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( 1.5 ,1.5 ,1.5 ),
        time: 2
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.treeRing3.scene,
        target: new THREE.Vector3( 0 , 0 , 0  ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.treeRing4.scene,
        target: new THREE.Vector3( 0 , 0 , 0 ),
        time: 1
      });
      t.start();

      womb.mugRing.exit();

      womb.mugRing1.enter();
      womb.mugRing1.scene.scale.multiplyScalar( .4 );
      womb.mugRing1.scene.rotation.x = Math.PI / 2;


      womb.AVALON.exit();

    }

    var afterSecondDrop2 = function(){

      womb.treeRing2.exit();

      var t = womb.tweener.createTween({
        object: womb.treeRing3.scene,
        target: new THREE.Vector3( 0 ,  womb.size / 4  , 0 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.treeRing4.scene,
        target: new THREE.Vector3( 0 ,  -womb.size / 4  , 0 ),
        time: 1
      });
      t.start();

      womb.mugRing1.exit();
      womb.mugRing2.enter();
      womb.mugRing2.scene.scale.multiplyScalar( .5 );
      womb.mugRing2.scene.rotation.x = Math.PI / 2;
      womb.mugRing2.spinning = true;


    }

    var afterSecondDrop3 = function(){

      womb.treeRing3.exit();


      var t = womb.tweener.createTween({
        object: womb.treeRing4.scene,
        target: new THREE.Vector3(  0 , 0 , 0  ),
        time: 1
      });
      t.start();

      womb.mugRing2.exit();
      womb.mugRing3.enter();
      womb.mugRing3.scene.scale.multiplyScalar( .7 );
      womb.mugRing3.scene.rotation.x = Math.PI / 2;


    }

    var afterSecondDrop4 = function(){

    
      womb.mugRing3.exit();
      womb.mugRing4.enter();
      womb.mugRing4.scene.scale.multiplyScalar( .7 );
      womb.mugRing4.scene.rotation.x = Math.PI / 2;


    }

   
    var afterSecondDrop5 = function(){
    
      womb.mugRing4.exit();



      womb.mugRing.enter();

      womb.mugRing5.enter();
      womb.mugRing5.scene.scale.multiplyScalar( .9 );
      womb.mugRing5.scene.rotation.x = Math.PI / 2;


    }

    var PURE = function(){

      womb.PURE.enter();

    } 

    var AVALON = function(){

      womb.PURE.exit();
      womb.AVALON.enter();

    }


    /*


       CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT CUTOUT   

    */


    var cutout = function(){

      womb.mugRing.exit();
      womb.mugRing5.exit();

      womb.treeRing4.exit();

     // womb.physicsSim.enter();


      womb.mainPulse.enter();

    }

    var backIn = function(){

      
      womb.mainPulse.exit();
     // womb.physicsSim.exit();


      womb.littleStars.enter();
      womb.littleStars1.enter();
      womb.littleStars2.enter();

      womb.littleStars.spinning = true;
      womb.littleStars1.spinning = true;
      womb.littleStars2.spinning = true;
      
      womb.BEAUTYSQUARE.enter();

    } 
    afterBackIn = function(){

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.BEAUTYSQUARE.scene,
        target: new THREE.Vector3( .8 , .8 , .8 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.littleStars.scene,
        target: new THREE.Vector3( .5 , .5 , .5 ),
        time: 3
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.treeRing3.scene,
        target: new THREE.Vector3( 0 ,  0 , 0 ),
        time: 1
      });
      t.start();


      womb.treeRing.enter();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing.scene,
        target: new THREE.Vector3( 1 , 1 , 1 ),
        time: 1
      });
      t.start();

    }

    afterBackIn1 = function(){

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.BEAUTYSQUARE.scene,
        target: new THREE.Vector3( .7 , .7 , .7 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.littleStars1.scene,
        target: new THREE.Vector3( .7 , .7 , .7 ),
        time: 3
      });
      t.start();


      womb.treeRing1.enter();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 1
      });

      t.start();

    }

    afterBackIn2 = function(){

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.BEAUTYSQUARE.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.littleStars2.scene,
        target: new THREE.Vector3( .3 , .3 , .3 ),
        time: 3
      });
      t.start();


      womb.treeRing2.enter();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing.scene,
        target: new THREE.Vector3( .4 , .4 , .4 ),
        time: 1
      });
      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 1
      });

      t.start();

    }

    afterBackIn3 = function(){

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.BEAUTYSQUARE.scene,
        target: new THREE.Vector3( .5 , .5 , .5 ),
        time: 1
      });
      t.start();

      womb.treeRing3.enter();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing.scene,
        target: new THREE.Vector3( .2 , .2 , .2 ),
        time: 1
      });
      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .4 , .4 , .4 ),
        time: 1
      });

      womb.treeRing2.exit();

      womb.randomCubes.enter();
      womb.randomCubes.spinning = true;

      womb.littleStars.exit();
      womb.littleStars1.exit();
      womb.littleStars2.exit();

      womb.littleStars.spinning = true;
      womb.littleStars1.spinning = true;
      womb.littleStars2.spinning = true;

      t.start();

    }

    afterBackIn4 = function(){

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.BEAUTYSQUARE.scene,
        target: new THREE.Vector3( .5 , .5 , .5 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing.scene,
        target: new THREE.Vector3( .1 , .1 , .1 ),
        time: 1
      });
      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .3 , .3 , .3 ),
        time: 1
      });

       var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.randomCubes.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 1
      });


      womb.treeRing1.exit();
      womb.treeRing3.exit();
      womb.treeRing2.exit();
      womb.randomCubes1.enter();
      womb.randomCubes1.spinning = true;


      t.start();

    }

    afterBackIn5 = function(){

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.BEAUTYSQUARE.scene,
        target: new THREE.Vector3( .5 , .5 , .5 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.randomCubes.scene,
        target: new THREE.Vector3( .4 , .4 , .4 ),
        time: 1
      });

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.randomCubes1.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 1
      });

      womb.treeRing2.exit();
      womb.treeRing.exit();


      womb.randomCubes2.enter();
      womb.randomCubes2.spinning = true;
      womb.treeRing1.spinning  = true;


      t.start();

    }


    afterBackIn6 = function(){

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.BEAUTYSQUARE.scene,
        target: new THREE.Vector3( .5 , .5 , .5 ),
        time: 1
      });
      t.start();

      womb.treeRing3.position = new THREE.Vector3(  0 , 0 , 0 );
      womb.treeRing3.enter();
      womb.treeRing3.spinning  = true;

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing.scene,
        target: new THREE.Vector3( .2 , .2 , .2 ),
        time: 1
      });
      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .4 , .4 , .4 ),
        time: 1
      });

  
      t.start();

    }

    afterBackIn7 = function(){

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.BEAUTYSQUARE.scene,
        target: new THREE.Vector3( .5 , .5 , .5 ),
        time: 1
      });
      t.start();

      womb.treeRing4.enter();

      womb.treeRing.spinning = true;

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing.scene,
        target: new THREE.Vector3( .2 , .2 , .2 ),
        time: 1
      });
      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .4 , .4 , .4 ),
        time: 1
      });

      t.start();

    }

    
    
    /*
    

    END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END END 


    */





    var cutoutEnd1 = function(){

      womb.FRACTALCOMBO.enter();
      womb.FRACTALCOMBO.updateSeed = true;
      womb.FRACTALCOMBO.scene.rotation.y = Math.PI / 2;
    
      womb.littleStars.enter();
      womb.littleStars1.enter();
      womb.littleStars2.enter();
      
      womb.BEAUTYSQUARE.exit();

      womb.randomCubes.exit();
      womb.randomCubes1.exit();
      womb.randomCubes2.exit();
      womb.randomCubes3.exit();

      womb.treeRing.exit();
      womb.treeRing1.exit();
      womb.treeRing2.exit();
      womb.treeRing3.exit();


    }


    var cutoutEnd2 = function(){

      womb.treeRing4.exit();

    } 
    
    var cutoutEnd3 = function(){
    
      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.littleStars.scene,
        target: new THREE.Vector3( .01 , .01 , .01 ),
        time: 10
      });

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.littleStars1.scene,
        target: new THREE.Vector3( .01 , .01 , .01 ),
        time: 15
      });

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.littleStars2.scene,
        target: new THREE.Vector3( .01 , .01 , .01 ),
        time: 20
      });


    }
       
 
    var end = function(){

      womb.littleStars.exit();
      womb.littleStars1.exit();
      womb.littleStars2.exit();

      womb.FRACTALCOMBO.exit();

      // TODO:
      //womb.credits.enter();
    }


    var credits = function(){
     
      //document.body.style.cursor = 'auto';
      womb.credits.enter();
    }

    /*
    
       TIMING!   TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  TIMING!  

    */

    //credits();

    var offset = 6000;
    var t = setTimeout( begin             , 0                );
    var t = setTimeout( leave             , -1000   + offset );
    var t = setTimeout( start             , 492     + offset );
    var t = setTimeout( firstHit          , 492     + offset );
    var t = setTimeout( firstHO           , 1710    + offset );

    var t = setTimeout( intro1            , 11065   + offset );
    var t = setTimeout( intro2            , 9099    + offset );
    var t = setTimeout( intro3            , 7130    + offset );
    var t = setTimeout( intro4            , 5040    + offset );
    var t = setTimeout( intro5            , 3196    + offset );

    var t = setTimeout( hihatsEnter       , 18934   + offset );

    var t = setTimeout( move1             , 20000   + offset );
    var t = setTimeout( move2             , 26550   + offset );
    var t = setTimeout( voiceUp           , 34671   + offset );


    var t = setTimeout( firstDrop         , 50409   + offset );

    var t = setTimeout( afterFirstDrop    , 66120   + offset );
    var t = setTimeout( afterFirstDrop1   , 81866   + offset );
    var t = setTimeout( afterFirstDrop2   , 97612   + offset );

    var t = setTimeout( PURE              , 141150  + offset );
    var t = setTimeout( AVALON            , 143240  + offset );

    var t = setTimeout( secondDrop        , 113360  + offset );

    var t = setTimeout( afterSecondDrop   , 129106  + offset );
    var t = setTimeout( afterSecondDrop1  , 144852  + offset );
    var t = setTimeout( afterSecondDrop2  , 160598  + offset );
    var t = setTimeout( afterSecondDrop3  , 176344  + offset );
    var t = setTimeout( afterSecondDrop4  , 192090  + offset );
    var t = setTimeout( afterSecondDrop5  , 207836  + offset );

    var t = setTimeout( cutout            , 223524  + offset );
    var t = setTimeout( backIn            , 239262  + offset );

    var t = setTimeout( afterBackIn       , 255008  + offset );
    var t = setTimeout( afterBackIn1      , 270754  + offset );
    var t = setTimeout( afterBackIn2      , 286500  + offset );
    var t = setTimeout( afterBackIn3      , 302246  + offset );
    var t = setTimeout( afterBackIn4      , 317992  + offset );
    var t = setTimeout( afterBackIn5      , 333738  + offset );
    var t = setTimeout( afterBackIn6      , 349484  + offset );
    var t = setTimeout( afterBackIn7      , 255008  + offset );

    var t = setTimeout( cutoutEnd1        , 365163  + offset );
    var t = setTimeout( cutoutEnd2        , 366639  + offset );
    var t = setTimeout( cutoutEnd3        , 413377  + offset );
    var t = setTimeout( end               , 427623  + offset );
    var t = setTimeout( credits           , 430623  + offset );



    /* FAST TIMING FOR THE SAKE OF RAPID ITERATION 
    var t = setTimeout( begin             , 0                );
    var t = setTimeout( leave             , -1000   + offset );
    var t = setTimeout( start             , 492     + offset );
    var t = setTimeout( firstHit          , 492     + offset );
    var t = setTimeout( firstHO           , 710    + offset );

    var t = setTimeout( intro1            , 1000    + offset );
    var t = setTimeout( intro2            , 1100    + offset );
    var t = setTimeout( intro3            , 1200    + offset );
    var t = setTimeout( intro4            , 1300    + offset );
    var t = setTimeout( intro5            , 1400    + offset );

    var t = setTimeout( hihatsEnter       , 1500    + offset );

    var t = setTimeout( move1             , 2600    + offset );
    var t = setTimeout( move2             , 3700    + offset );
    var t = setTimeout( voiceUp           , 4800    + offset );


    var t = setTimeout( firstDrop         , 5800   + offset );

    var t = setTimeout( afterFirstDrop    , 6900   + offset );
    var t = setTimeout( afterFirstDrop1   , 8000   + offset );
    var t = setTimeout( afterFirstDrop2   , 9000   + offset );

    var t = setTimeout( PURE              , 9100  + offset );
    var t = setTimeout( AVALON            , 10100  + offset );

    var t = setTimeout( secondDrop        , 11360  + offset );

    var t = setTimeout( afterSecondDrop   , 12106  + offset );
    var t = setTimeout( afterSecondDrop1  , 13252  + offset );
    var t = setTimeout( afterSecondDrop2  , 14598  + offset );
    var t = setTimeout( afterSecondDrop3  , 15644  + offset );
    var t = setTimeout( afterSecondDrop4  , 17090  + offset );
    var t = setTimeout( afterSecondDrop5  , 18106  + offset );

    var t = setTimeout( cutout            , 19200  + offset );

    offset = 10000000;


    var t = setTimeout( backIn            , 20300  + offset );

    var t = setTimeout( afterBackIn       , 21408  + offset );
    var t = setTimeout( afterBackIn1      , 22504  + offset );
    var t = setTimeout( afterBackIn2      , 23600  + offset );
    var t = setTimeout( afterBackIn3      , 27900  + offset );
    var t = setTimeout( afterBackIn4      , 29000  + offset );
    var t = setTimeout( afterBackIn5      , 30000  + offset );
    var t = setTimeout( afterBackIn6      , 31000  + offset );
    var t = setTimeout( afterBackIn7      , 32000  + offset );

    var t = setTimeout( cutoutEnd1        , 33000  + offset );
    var t = setTimeout( cutoutEnd2        , 34000  + offset );
    var t = setTimeout( cutoutEnd3        , 35000  + offset );
    var t = setTimeout( end               , 36000  + offset );
    var t = setTimeout( credits           , 37000  + offset );*/














  }

  womb.update = function(){
  
    womb.kitty.scene.rotation.x += womb.mouse.x * .2;
    womb.kitty1.scene.rotation.x += womb.mouse.x * .2;
   


    womb.antiSerp1.material.uniforms.pow_noise.value = .01 + .1 * (womb.mouse.x-.5);
    womb.antiSerp1.material.uniforms.pow_audio.value = .01 + .1 * (womb.mouse.y-.5);
    womb.antiSerp2.material.uniforms.pow_noise.value = .01 + .1 * (womb.mouse.x-.5);
    womb.antiSerp2.material.uniforms.pow_audio.value = .01 + .1 * (womb.mouse.y-.5);
    womb.antiSerp3.material.uniforms.pow_noise.value = .01 + .1 * (womb.mouse.x-.5);
    womb.antiSerp3.material.uniforms.pow_audio.value = .01 + .1 * (womb.mouse.y-.5);
    womb.antiSerp4.material.uniforms.pow_noise.value = .01 + .1 * (womb.mouse.x-.5);
    womb.antiSerp4.material.uniforms.pow_audio.value = .01 + .1 * (womb.mouse.y-.5);

    womb.randomCubes.material.uniforms.color.value.x   = womb.mouse.x;
    womb.randomCubes.material.uniforms.color.value.y   = .3 * womb.mouse.y;

    womb.randomCubes1.material.uniforms.color.value.x   = womb.mouse.x;
    womb.randomCubes1.material.uniforms.color.value.y   = .3 * womb.mouse.y;
    womb.randomCubes2.material.uniforms.color.value.x   = womb.mouse.x;
    womb.randomCubes2.material.uniforms.color.value.y   = .3 * womb.mouse.y;

    womb.randomCubes3.material.uniforms.color.value.x   = womb.mouse.x;
    womb.randomCubes3.material.uniforms.color.value.y   = .3 * womb.mouse.y;
    womb.randomCubes4.material.uniforms.color.value.x   = womb.mouse.x;
    womb.randomCubes4.material.uniforms.color.value.y   = .3 * womb.mouse.y;


    womb.treeRing.scene.rotation.y  += ( womb.mouse.x -.5) * .04;
    womb.treeRing1.scene.rotation.y += -( womb.mouse.x -.5) * .02;
    womb.treeRing2.scene.rotation.y += ( womb.mouse.x -.5) * .06;
    womb.treeRing3.scene.rotation.y += -( womb.mouse.x -.5) * .07;
    womb.treeRing4.scene.rotation.y += ( womb.mouse.x -.5) * .09;


    womb.mugRing.material.uniforms.color.value.x   = womb.mouse.x;
    womb.mugRing.material.uniforms.color.value.z   = 1-womb.mouse.y;

    womb.mugRing1.material.uniforms.color.value.x   = womb.mouse.x;
    womb.mugRing1.material.uniforms.color.value.z   = 1-womb.mouse.y;

    womb.mugRing2.material.uniforms.color.value.x   = womb.mouse.x;
    womb.mugRing2.material.uniforms.color.value.z   = 1-womb.mouse.y;

    womb.mugRing3.material.uniforms.color.value.x   = womb.mouse.x;
    womb.mugRing3.material.uniforms.color.value.z   = 1-womb.mouse.y;

    womb.mugRing4.material.uniforms.color.value.x   =  womb.mouse.x;
    womb.mugRing4.material.uniforms.color.value.z   = 2* (1-womb.mouse.y);


    womb.mugRing5.material.uniforms.color.value.x   = 2 * womb.mouse.x;
    womb.mugRing5.material.uniforms.color.value.z   = 1-womb.mouse.y;

    womb.BEAUTYSQUARE.material.uniforms.color.value.x = .7 * womb.mouse.x;
    womb.BEAUTYSQUARE.material.uniforms.color.value.z = 2 * (1.9-womb.mouse.y);


    womb.mainPulse.material.uniforms.pow_noise.value = 10*(womb.mouse.x - .5);
    womb.mainPulse.material.uniforms.pow_audio.value = 10* (womb.mouse.y - .5);
    

  }

/*  womb.update = function(){


  }*/
  womb.raycaster.onMeshHoveredOver = function( object ){

    womb.credits.onMeshHoveredOver(object);

  }

  womb.raycaster.onMeshHoveredOut = function( object ){

    womb.credits.onMeshHoveredOut(object);

  }

  

});
