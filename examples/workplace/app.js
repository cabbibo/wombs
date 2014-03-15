define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'              );
  var ShaderCreator       = require( 'Shaders/ShaderCreator'  );

  var Being                = require( 'Being/Being'            );
  var Mesh                = require( 'Components/Mesh'                );
  var Duplicator          = require( 'Components/Duplicator'          );
  var Clickable           = require( 'Components/Clickable'          );
  var Emitter          = require( 'Components/MeshEmitter'          );

  var placementFunctions  = require( 'Utils/PlacementFunctions'       );

  var link = 'https://soundcloud.com/disclosuremusic';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  var womb = new Womb({
  
    /*title:    'Tenderly - Disclosure',
    link:     link,
    summary:  info,*/
    //stats:    true,
  
  });

  var files = [

    "/lib/audio/loops/dontReallyCare/1.mp3",
    "/lib/audio/loops/dontReallyCare/2.mp3",
    "/lib/audio/loops/dontReallyCare/3.mp3",
    "/lib/audio/loops/dontReallyCare/4.mp3",
    "/lib/audio/loops/dontReallyCare/5.mp3",
    "/lib/audio/loops/dontReallyCare/6.mp3",

  ];

  
  vertexChunk = [

    "vec2 v2 = vec2(  abs( uv.x  - .5 )  , 0.0 );",
    "float a = texture2D( AudioTexture , v2).r;",
    
    "float r = a * a* a * 20.;",
    "float t = 3.14159  * ( 1. + a + uv.x );",
    "float p = 3.14159 * 2. *  (a + uv.y );",
    
    "vec3 newP = cart( vec3( r , t , p ) );",
    
    "pos += newP;",
    
    "vDisplacement = length( newP );",

  ];

  fragmentChunk = [
    "color = Color * (vDisplacement / 20. );",
    "color.x = 10. / polar( vPos ).x;",
  ];


  var activeShader = new ShaderCreator({
    vertexChunk:   vertexChunk,
    fragmentChunk: fragmentChunk,
    uniforms:{ 
     
      Time:         womb.time,
      Color:        { type:"v3" , value: new THREE.Vector3(.1 , .1 , .6 ) },
      AudioTexture: { type:"t"  , value: womb.audioController.texture },

    
    },
  });
   
  
  var cube = new THREE.CubeGeometry( 10 , 10 , 1 , 20 , 20 , 20 );


  var activeMaterial = activeShader.material;

  var mainBeing = womb.creator.createBeing();

  var mesh = new Mesh( mainBeing , {
      geometry: cube,
      material: activeMaterial
  });

  //console.log(
  mainBeing.body.scale.multiplyScalar( .01 );
    
  var duplicator = new Duplicator(  mesh , mainBeing , {
     
      numOf:              10,
      placementFunction:  placementFunctions.ring,
      size:               womb.size / 10
  
  });

  for( var i = 0; i < duplicator.meshes.length; i++ ){
    duplicator.meshes[i].scale.multiplyScalar( .4 );
  }
  
  duplicator.addAll();
  duplicator.placeAll();

  mainBeing.body.position.z = 10;
  

  var hoverOverMaterial = new THREE.MeshBasicMaterial({
    color:0xcccccc,
    wireframe:true
  });

  var hoverOutMaterial = new THREE.MeshBasicMaterial({
    color:0xffffff,
    wireframe:false
  });


  audioBeings = [];

  for( var i = 0; i < files.length; i++ ){

    var audio = womb.audioController.createLoop( files[i] );

    var r = 30;
    var t = 2 * Math.PI * i / files.length;
    var p = 0;

    var pos = Math.toCart( r , t , p );
    var being = womb.creator.createBeing({
     
      position: new THREE.Vector3( pos.x , pos.z , pos.y )
      
    });

    being.body.rotation.z = -Math.PI/2 - t; 

    
    var mesh = new Mesh( being , {

      geometry: cube,
      material: hoverOutMaterial

    });

    being.audio = audio;


    var r = i / files.length;
    var g = .6
    var b = 1 - ( i / files.length );

    var activeShader = new ShaderCreator({
      vertexChunk:   vertexChunk,
      fragmentChunk: fragmentChunk,
      uniforms:{ 
       
        Time:         womb.time,
        Color:        { type:"v3" , value: new THREE.Vector3( r , g , b ) },
        AudioTexture: { type:"t"  , value: being.audio.texture },
      
      },
    });
    
    var activeMaterial = activeShader.material;

    console.log( activeMaterial );
    mesh.activeMaterial = activeMaterial;

    mesh.add();

    var dir = being.body.position.clone().normalize();

    var emitter = new Emitter( mesh , {
  
      startingDirection: function(){

        //console.log( this.emitTowards );
        var direction = new THREE.Vector3( -1 ,0, 0 );

        // Randomizes for complexity
        var ER = .5
        direction.x += Math.randomRange( -ER , ER );
        direction.y += Math.randomRange( -ER , ER );
        direction.z += Math.randomRange( -ER , ER );
        return direction;

      },

      maxMeshes: 100,
      decayRate: .97,
      emissionRate: 20 + Math.random() * 20 

    });

    emitter.mainDirection = dir;
 
    var clickable = new Clickable( mesh , {

      onHoverOver:function(){

        if( !this.active ){

          this.material = hoverOverMaterial;
          this.material.needsUpdate = true;

        }

      },

      onHoverOut: function(){

        if( !this.active ){

          this.material = hoverOutMaterial;
          this.material.needsUpdate = true;

        }

      },

      onClick: function(){

        if( !this.active ){


          this.active = true;
        
          this.emitter.begin();

          this.audio.turnOffFilter();

          this.material = this.activeMaterial;
          this.material.needsUpdate = true;


        }else{

          this.emitter.end();
          this.audio.turnOnFilter();

          this.active = false;

        }
      }
    });

    mesh.audio    = audio;
    mesh.emitter = emitter;

    audioBeings.push( being );

  }
 
  
  womb.loader.loadBarAdd();

  womb.start = function(){

    mainBeing.enter();
    //womb.scene.remove( MAINMESH );
    for( var i = 0; i < audioBeings.length; i++ ){

      audioBeings[i].audio.play();
      audioBeings[i].audio.turnOnFilter();
      audioBeings[i].enter();

    }

  }

});
