define(function(require, exports, module) {

  var m                   = require( 'app/utils/Math'                 );
  var AudioGeometry       = require( 'app/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'app/utils/AnalyzingFunctions'   );

  var Womb                = require( 'app/Womb'                       );

  var recursiveFunctions  = require( 'app/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );
  var shaderChunks        = require( 'app/shaders/shaderChunks'       );

  /*
   
     Create our womb

  */
  var link = 'https://soundcloud.com/cashmerecat/sets/mirrormaruep';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    modelLoader:      true,
    textCreator:      true,
    title:            'Mirror Maru - Cashmere Cat',
    link:             link, 
    summary:          info,
    //gui:              true,
    imageLoader:      true,
    //stats:            true,
    color:            '#100e30' 
  });

  // Communal uniform
  womb.time = { type: "f" , value: 0 };
  
  var file = '/lib/audio/tracks/mirrorMaru.mp3';
  womb.stream = womb.audioController.createStream( file );
  womb.audioController.gain.gain.value = 1;


  /*  
   *  TEXT
   */
  womb.textCreator.params.crispness = 30;
  womb.textTexture = womb.textCreator.createTexture( '=^.^=' , { 
    square: true,
  });

   womb.modelLoader.loadFile( 'OBJ' , '/lib/models/mug_11530_10.obj' , function( object ){

    if( object[0] instanceof THREE.Mesh ){
    }

    if( object[0] instanceof THREE.Geometry ){
      womb.mugGeo = object[0];
      womb.mugGeo.computeFaceNormals();
      womb.mugGeo.computeVertexNormals();
      
      womb.modelLoader.assignUVs( womb.mugGeo );
      
    }

  });

  womb.loader.loadBarAdd();


  womb.update = function(){

    womb.time.value ++;

  }

  womb.start = function(){


    // SHARED UNIFORMS
    womb.u = {

      texture:    { type: "t", value: womb.stream.texture.texture },
      image:      { type: "t", value: womb.stream.texture.texture },
      color:      { type: "v3", value: new THREE.Vector3( .2 , .5 , .4 ) },
      time:       womb.time,
      pow_noise:  { type: "f" , value: 0.5 },
      pow_audio:  { type: "f" , value: .3 },

    };

    /*
      
       Merging with the basic uniforms,
       so we can use fog

    */
    womb.uSoft = THREE.UniformsUtils.merge( [
        THREE.ShaderLib['basic'].uniforms,
        womb.u,
    ]);

    womb.uShiny = THREE.UniformsUtils.merge( [
        THREE.ShaderLib['basic'].uniforms,
        womb.u,
    ]);


    /*

       Once the uniforms are merged, 
       we need to assign the proper values
       because in the process of merging,
       the values are cloned, meaning they will 
       not be linked with textures that are updated, 
       etc...

    */
    womb.uSoft.texture.value    = womb.stream.texture.texture;
    womb.uSoft.image.value      = womb.textTexture;
    womb.uSoft.time             = womb.time;
    womb.uSoft.color.value      = new THREE.Vector3( .4 , .4 , .7 );

    womb.uShiny.texture.value   = womb.stream.texture.texture;
    womb.uShiny.image.value     = womb.stream.texture.texture;
    womb.uShiny.time            = womb.time;
    womb.uShiny.color.value     = new THREE.Vector3( .3 , .1 , .5 );


    /*
     *
     *  CREATING Center Flower 
     *
     */
    
    womb.materialShiny = new THREE.ShaderMaterial( {
      uniforms:womb.uShiny, 
      vertexShader: vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.image.sample_pos_diamond,
      transparent:true,
      fog: true,
      blending: THREE.AdditiveBlending,
      depthWrite: true,
      transparent: true,
      opacity:.1
    });

    
    womb.shinyMeshes = [];


    var numOf = 6;
    var normalMat = new THREE.MeshNormalMaterial();
    var basicMaterial = new THREE.MeshBasicMaterial({
     
      fog: true
    });
    var fullGeo = new THREE.Geometry();
    for( var i =  0; i < numOf; i ++ ){
      
      var mesh = new THREE.Mesh( 
        womb.mugGeo,
        womb.materialShiny
      );
      mesh.scale.multiplyScalar( 10 );

      mesh.rotation.z = 2 * Math.PI * i / numOf;

    
      womb.shinyMeshes.push( mesh );
      
      THREE.GeometryUtils.merge( fullGeo , mesh );

    }

    var numOf = 6;
    
    for( var i = 0; i < numOf; i ++ ){
     
      var object = new THREE.Object3D();

      var mesh = new THREE.Mesh( 
        fullGeo,
        //basicMaterial
        womb.materialShiny
      );

      object.add( mesh );

      object.rotation.x = 2 * Math.PI * i / 6;

      womb.scene.add( object );

    }

    /*
     *
     * Creating Boxs
     *
     */
    womb.materialBox = new THREE.ShaderMaterial( {
      uniforms:womb.uSoft, 
      vertexShader: vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.image.sample_pos_diamond,
      transparent:true,
      fog: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity:.1
    });

    var s = womb.size / 20;
    var n = 20;
    var geo = new THREE.CubeGeometry( s , s , s , n , n ,n );

    var numOf = 50;
    for( var i = 0; i < numOf; i ++ ){

      var mesh = new THREE.Mesh( geo , womb.materialBox );
      Math.THREE.setRandomVector( mesh.position , womb.size );
      Math.THREE.setRandomVector( mesh.rotation , 2 * Math.PI );
      womb.scene.add( mesh );
    
    }

    womb.onWindowResize();
    womb.stream.play();

  }


});
