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
  var AntiSerpenski1      = require( 'app/scenes/quoi/AntiSerpenski1' );
  var AntiSerpenski2      = require( 'app/scenes/quoi/AntiSerpenski2' );
  var Kitty               = require( 'app/scenes/quoi/Kitty' );
  var Ring                = require( 'app/scenes/quoi/Ring' );
  var Random              = require( 'app/scenes/quoi/Random' );
  var Beauty              = require( 'app/scenes/quoi/Beauty' );


  /*
   
     Scene for Quoi
   
  */ 
  /*
   
     Create our womb

  */
  var link = 'https://soundcloud.com/avalonemerson';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    modelLoader:      true,
    textCreator:      true,
    raycaster:        true,
    title:            'Quoi - Avalon Emerson',
    link:             link, 
    summary:          info,
    gui:              true,
    imageLoader:      true,
    stats:            true,
    color:            '#0f0020',
    size: 400
  });


  var file = '/lib/audio/tracks/quoi.mp3';
  womb.stream =   womb.audioController.createStream( file , { autoLoad: true } );
  womb.audioController.gain.gain.value = 0;

  womb.moonTexture = womb.imageLoader.load( '../lib/img/moon_1024.jpg' );
  womb.cookieTexture = womb.imageLoader.load( '../lib/img/quoi/cookieSprite.png' );

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
      color: new THREE.Vector3( .9 , .2 , .0 )
    });

     womb.treeRing2 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: .8,
      radius: womb.size / 6,
      geo:geo,    
      color: new THREE.Vector3( 1.0 , .1 , .0 )
    });

     womb.treeRing3 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: .8,
      radius: womb.size / 5,
      geo:geo,    
      color: new THREE.Vector3( 1.1 , .0 , .0 )
    });

     womb.treeRing4 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: .8,
      radius: womb.size / 5,
      geo:geo,    
      color: new THREE.Vector3( 1.1 , .8 , 1.4 )
    });





  }

  womb.onMugLoad = function( geo ){

     womb.BEAUTYSQUARE = new Beauty( womb , {
      geo: geo
    });


    womb.mainPulse = new Kitty( womb , {
      modelScale: 10,
      noisePower: 3.0,
      audioPower: 2.0,
      geo: geo,
      color: new THREE.Vector3( .1 , .0 , .3 )
    });


    womb.mugRing = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: 10,
      radius: womb.size / 2,
      geo:geo 
    });

    womb.mugRing1 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: 10,
      radius: womb.size / 1.6,
      geo:geo ,
      color :new THREE.Vector3( .7 , .5 , 1.3 ),
    });

    womb.mugRing2 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: 10,
      radius: womb.size / 1.4,
      geo:geo ,
      color :new THREE.Vector3( .5 , .5 , 1.5 ),
    });

    womb.mugRing3 = new Ring( womb , {
      noisePower: 3.3, 
      modelScale: 10,
      radius: womb.size / 1.3,
      geo:geo ,
      color :new THREE.Vector3( .9 , .5 , 1.1 ),
    });

    womb.mugRing4 = new Ring( womb , {
      noisePower: 3.3,
      audioPower: 1.0,
      modelScale: 10,
      radius: womb.size / 2.3,
      geo:geo ,
      color :new THREE.Vector3( 1.1 , .5 , .9 ),
    });

    womb.mugRing5 = new Ring( womb , {
      noisePower: 3.3,
      audioPower: 2.0,
      modelScale: 10,
      radius: womb.size / 2.3,
      geo:geo ,
      color :new THREE.Vector3( 1.7 , .5 , .5 ),
    });


  }



  //womb.BEAUTYCUBE = new Beauty( womb );

  womb.PURE_texture = womb.textCreator.createTexture( 'PURE' , { 
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



  womb.physicsSim = new PhysicsSimulation( womb ,
   
    {
      bounds: womb.size,
      textureWidth:70,
      velocityShader: physicsShaders.velocity.flocking,
      positionShader: physicsShaders.position,
      startingVelocityRange: [ 80 , 0 , 0 ] 
    }
  );
  womb.antiSerp = new AntiSerpenski1( womb ,{
    spin:.001,
    color: new THREE.Vector3( .5 , .3 , 1.2 ),
    radius:14,
  });
 
  womb.antiSerp1 = new AntiSerpenski2( womb ,{
    spin:.001,
    color: new THREE.Vector3( .5 , .3 , 1.2 ),
    radius:14,
  });
  womb.antiSerp1.scene.position.y = womb.size / 4;
  womb.antiSerp2 = new AntiSerpenski2( womb ,{
    spin:.002, 
    color: new THREE.Vector3( .7 , .3 , 1.1 ),
    radius:12,
  });
  womb.antiSerp2.scene.position.y = womb.size / 8
  womb.antiSerp3 = new AntiSerpenski2( womb ,{
    spin:.003,
    color: new THREE.Vector3( .9 , .3 , 1.0 ),
    radius:10,
  });
  womb.antiSerp3.scene.position.y = womb.size / 100000;
  womb.antiSerp4 = new AntiSerpenski2( womb ,{
    spin:.004, 
    color: new THREE.Vector3( 1.3 , .3 , .9 ),
    radius:8,
  });
  womb.antiSerp4.scene.position.y = - womb.size / 8
  womb.antiSerp5 = new AntiSerpenski2( womb ,{
    spin:.005, 
    color: new THREE.Vector3( 1.4 , .3 , .8 ),
    radius:6,
  });
  womb.antiSerp5.scene.position.y = -womb.size / 4

  womb.dropCenter = new Kitty( womb , {
    //modelFile: mug
    modelScale: 1,
    noisePower: 2.0,
    audioPower: .9,
    color: new THREE.Vector3( .5 , .3 , .3 )
  });


  /*womb.randSquaresMoon = new RandSquares( womb , {

    noisePower:1.0,
    audioPower: .3,
    color: new THREE.Vector3( .5 , .3 , .3 ),
    texture: this.womb.imageLoader.load( '../lib/img/moon_1024.jpg' );

  });*/

  womb.loader.loadBarAdd();
  
  womb.update = function(){
    
  }

  womb.start = function(){

    womb.stream.play();

    
    
    var offset = -490; 
    //var t1 = setTimeout( function(){ womb.physicsSim.enter(); }, 2000 );
   
    timeout = setTimeout( function(){ womb.antiSerp1.enter(); }, 11065+ offset );
    timeout = setTimeout( function(){ womb.antiSerp2.enter(); }, 9099 + offset );
    timeout = setTimeout( function(){ womb.antiSerp3.enter(); }, 7130 + offset );
    timeout = setTimeout( function(){ womb.antiSerp4.enter(); }, 5040 + offset );
    timeout = setTimeout( function(){ womb.antiSerp5.enter(); }, 3196 + offset );


    var firstHit = setTimeout( function(){
      womb.kitty.enter();
      womb.kitty1.enter();
    }, 492 + offset );

    var firstHO = setTimeout( function(){

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

    }, 1710 + offset );


    var hihatsEnter = setTimeout( function(){


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
        target: new THREE.Vector3( .1 , .3 , .5 ),
        time: 1
      });
      t1.start();

      var t2 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp2.scene,
        target: new THREE.Vector3( .5 , .3 , .1 ),
        time: 1
      });
      t2.start();

      var t3 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp3.scene,
        target: new THREE.Vector3( .5 , .1 , .3 ),
        time: 1
      });
      t3.start();

      var t4 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp4.scene,
        target: new THREE.Vector3( .1 , .5 , .3 ),
        time: 1
      });
      t4.start();

      var t5 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp5.scene,
        target: new THREE.Vector3( .3 , .1 , .3 ),
        time: 1
      });
      t5.start();


    }, 18934 + offset );

    var timeout = setTimeout( function(){


      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.kitty.scene,
        target: new THREE.Vector3( 0 , womb.size / 4 , 0.000001 ),
        time: 30
      });
      t.start();
      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.kitty1.scene,
        target: new THREE.Vector3( 0 , womb.size / 4 , 0.000001 ),
        time: 30
      });
      t.start();

    }, 20000 + offset );

    var timeout = setTimeout( function(){

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
        target: new THREE.Vector3( 1 , 1 , 1 ),
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
        object: womb.antiSerp2.scene,
        target: new THREE.Vector3( 1 , 1 , 1 ),
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

      var t3 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp3.scene,
        target: new THREE.Vector3( 1 , 1 , 1 ),
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


      var t4 = womb.tweener.createTween({
        type: 'scale',
        object: womb.antiSerp4.scene,
        target: new THREE.Vector3( 1 , 1 , 1 ),
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
        type: 'scale',
        object: womb.antiSerp5.scene,
        target: new THREE.Vector3( 1 , 1 , 1 ),
        time: 1
      });
      t4.start();

      var t5 = womb.tweener.createTween({
        type: 'position',
        object: womb.antiSerp5.scene,
        target: new THREE.Vector3( 0 , 0 , 0 ),
        time: 1
      });
      t5.start();

    }, 26550 + offset );

    var timeout = setTimeout( function(){
     

      womb.kitty.exit();
      womb.kitty1.exit();

      womb.randomCubes.enter();
     
    } , 34671 + offset );

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

    var t = setTimeout( firstDrop , 50409 + offset );


    var afterFirstDrop = function(){

      womb.randomCubes.spinning = false;

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

    var t = setTimeout( afterFirstDrop , 66120 + offset );

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

    var t = setTimeout( afterFirstDrop1 , 81866 + offset );

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
      womb.randomCubes3.enter();
      womb.randomCubes3.spinning = true;

      womb.randomCubes4.enter();
      womb.randomCubes4.spinning = true;

      womb.treeRing2.enter();
      womb.treeRing2.scene.rotation.x = Math.PI / 2;

      womb.treeRing1.exit();
    }

    var t = setTimeout( afterFirstDrop2 , 97612 + offset );




    var secondDrop = function(){

      womb.randomCubes.exit();
      womb.randomCubes1.exit();
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

      womb.treeRing4.enter();
      womb.treeRing4.scene.rotation.x = Math.PI / 2;
    
    }
  
    var t = setTimeout( secondDrop , 113360 + offset );


    var afterSecondDrop = function(){

      womb.treeRing.exit();

      var t = womb.tweener.createTween({
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( - womb.size / 4 , 0 , 0 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.treeRing2.scene,
        target: new THREE.Vector3( 0 , 0 , 0 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.treeRing3.scene,
        target: new THREE.Vector3( womb.size / 4 , 0 , 0 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.treeRing4.scene,
        target: new THREE.Vector3( womb.size / 2 , 0 , 0 ),
        time: 1
      });
      t.start();

      womb.mugRing.enter();
      womb.mugRing.scene.scale.multiplyScalar( .3 );
      womb.mugRing.scene.rotation.x = Math.PI / 2;

    }

    var t = setTimeout( afterSecondDrop , 129106 );

    var afterSecondDrop1 = function(){

      womb.treeRing1.exit();

      var t = womb.tweener.createTween({
        object: womb.treeRing2.scene,
        target: new THREE.Vector3( 0 , 0 , 0 ),
        time: 1
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

      womb.mugRing1.enter();
      womb.mugRing1.scene.scale.multiplyScalar( .4 );
      womb.mugRing1.scene.rotation.x = Math.PI / 2;


      womb.AVALON.exit();

    }



    var t = setTimeout( afterSecondDrop1 , 144852 );

    var afterSecondDrop2 = function(){

      womb.treeRing2.exit();

      var t = womb.tweener.createTween({
        object: womb.treeRing3.scene,
        target: new THREE.Vector3( 0 ,  womb.size / 2  , 0 ),
        time: 1
      });
      t.start();

      var t = womb.tweener.createTween({
        object: womb.treeRing4.scene,
        target: new THREE.Vector3( 0 ,  womb.size / 2  , 0 ),
        time: 1
      });
      t.start();

      womb.mugRing1.exit();
      womb.mugRing2.enter();
      womb.mugRing2.scene.scale.multiplyScalar( .5 );
      womb.mugRing2.scene.rotation.x = Math.PI / 2;


    }


    var t = setTimeout( afterSecondDrop2 , 160598 );

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

    var t = setTimeout( afterSecondDrop3 , 176344 );

    var afterSecondDrop4 = function(){

    
      womb.mugRing3.exit();
      womb.mugRing4.enter();
      womb.mugRing4.scene.scale.multiplyScalar( .7 );
      womb.mugRing4.scene.rotation.x = Math.PI / 2;


    }

    var t = setTimeout( afterSecondDrop4 , 192090 );
   
    var afterSecondDrop5 = function(){
    
      womb.mugRing4.exit();


      womb.antiSerp.enter();

      womb.mugRing.enter();

      womb.mugRing5.enter();
      womb.mugRing5.scene.scale.multiplyScalar( .9 );
      womb.mugRing5.scene.rotation.x = Math.PI / 2;


    }

    var t = setTimeout( afterSecondDrop5 , 207836 );










    var PURE = setTimeout( function(){

      womb.PURE.enter();

    } , 141150 + offset );

    var AVALON = setTimeout( function(){

      womb.PURE.exit();
      womb.AVALON.enter();

    } , 143240 + offset );



    var cutout = setTimeout( function(){

      womb.mugRing.exit();
      womb.mugRing5.exit();

      womb.treeRing4.exit();

      womb.physicsSim.enter();

      womb.mainPulse.enter();

    } , 223524 + offset );

    var backin = setTimeout( function(){

      
      womb.mainPulse.exit();
      womb.physicsSim.exit();


      womb.BEAUTYSQUARE.enter();

    } , 239262 + offset );

    afterBackIn = function(){

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.BEAUTYSQUARE.scene,
        target: new THREE.Vector3( .8 , .8 , .8 ),
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

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 1
      });

      womb.randomSquares.enter();
      womb.randomSquares.spinning = true;


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
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .5 , .5 , .5 ),
        time: 1
      });

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.randomSquares.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 1
      });


      womb.randomSquares1.enter();
      womb.randomSquares1.spinning = true;


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
        object: womb.randomSquares.scene,
        target: new THREE.Vector3( .4 , .4 , .4 ),
        time: 1
      });

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.randomSquares1.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 1
      });



      womb.randomSquares1.enter();
      womb.randomSquares1.spinning = true;


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

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
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

      var t = womb.tweener.createTween({
        type: 'scale',
        object: womb.treeRing1.scene,
        target: new THREE.Vector3( .6 , .6 , .6 ),
        time: 1
      });


      t.start();

    }





    var t = setTimeout( afterBackIn  , 255008 + offset );
    var t = setTimeout( afterBackIn1 , 270754 + offset );
    var t = setTimeout( afterBackIn2 , 286500 + offset );
    var t = setTimeout( afterBackIn3 , 302246 + offset );
    var t = setTimeout( afterBackIn4 , 317992 + offset );
    var t = setTimeout( afterBackIn5 , 333738 + offset );
    var t = setTimeout( afterBackIn6 , 349484 + offset );
    var t = setTimeout( afterBackIn7 , 255008 + offset );







    var cutoutEnd1 = setTimeout( function(){

    } , 365163 + offset );

    var cutoutEnd2 = setTimeout( function(){

    } , 366639 + offset );

    var cutoutEnd3 = setTimeout( function(){

    } , 413377 + offset );


    var end  = setTimeout( function(){

    } , 427623 + offset );















  }

  womb.raycaster.onMeshHoveredOver = function(){

  }

  womb.raycaster.onMeshHoveredOut = function(){

  }

  

});
