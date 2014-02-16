define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                  );
  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  var Math                = require( 'Utils/math'                 );

  /*
   
     Create our womb

  */
  var link = 'http://thehitandrun.bandcamp.com/album/road-kill-vol-2-hnr18';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    modelLoader:      true,
    textCreator:      true,
    title:            'Old English - Om Unit x Sweatson Klank',
    link:             link, 
    summary:          info,
    //gui:              true,
    imageLoader:      true,
    //stats:            true,
    color:            '#000000' 
  });

  // Communal uniform
  womb.time = { type: "f" , value: 0 };
  
  var file = '/lib/audio/tracks/oldEnglish.mp3';
  womb.stream = womb.audioController.createStream( file );
  womb.audioController.gain.gain.value = 1;


  /*  
   *  TEXT
   */
  womb.textCreator.params.crispness = 30;
  womb.textTexture = womb.textCreator.createTexture( '=^.^=' , { 
    square: true,
  });

  womb.crewTexture = womb.imageLoader.load('/lib/img/hnrW.png' ); 

   womb.modelLoader.loadFile( 'OBJ' , '/lib/models/tree.obj' , function( object ){

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

      texture:    { type: "t", value: womb.stream.texture },
      image:      { type: "t", value: womb.stream.texture },
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
    womb.uSoft.texture.value    = womb.stream.texture;
    womb.uSoft.image.value      = womb.crewTexture;
    womb.uSoft.time             = womb.time;
    womb.uSoft.color.value      = new THREE.Vector3( .9 , .1 , .0 );

    womb.uShiny.texture.value   = womb.stream.texture;
    womb.uShiny.image.value     = womb.stream.texture;
    womb.uShiny.time            = womb.time;
    womb.uShiny.color.value     = new THREE.Vector3( .9 , .1 , .0 );


    /*
     *
     *  CREATING Center Flower 
     *
     */
    
    womb.materialShiny = new THREE.ShaderMaterial( {
      uniforms:womb.uShiny, 
      vertexShader: vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.image.sample_pos_diamond,
     // transparent:true,
      fog: true,
     // blending: THREE.AdditiveBlending,
     // transparent: true,
     // opacity:.1
    });

    
    womb.shinyMeshes = [];


    var numOf = 2;
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
      
      mesh.scale.multiplyScalar( 1 );

      mesh.rotation.z = 2 * Math.PI * i / numOf;
    
      womb.shinyMeshes.push( mesh );
      
      THREE.GeometryUtils.merge( fullGeo , mesh );

    }

    var numOf = 6;
   
    var mainObj = new THREE.Object3D();

    for( var i = 0; i < numOf; i ++ ){
     
      var object = new THREE.Object3D();

      var mesh = new THREE.Mesh( 
        fullGeo,
        //basicMaterial
        womb.materialShiny
      );

      object.add( mesh );

      object.rotation.x = 2 * Math.PI * i / 6;

      mainObj.add( object );

    }

    mainObj.rotation.y = Math.PI / 2;
    womb.scene.add( mainObj );


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
      opacity:.1
    });

    var s = womb.size / 50;
    var n = 20;
    var geo = new THREE.CubeGeometry( s , s , s , n , n ,n );

    var numOf = 100;
    for( var i = 0; i < numOf; i ++ ){

      var mesh = new THREE.Mesh( geo , womb.materialBox );
      Math.setRandomVector( mesh.position , womb.size * 2 );
      Math.setRandomVector( mesh.rotation , 2 * Math.PI );
      womb.scene.add( mesh );
    
    }

    womb.onWindowResize();
    womb.stream.play();

  }


});
