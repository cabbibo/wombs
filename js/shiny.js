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
  
     Setting up parameters for Dat.gui

  */
  var params = {

    softMaterial:{

      noise_power:  .3,
      audio_power:  .2,
      speed:        .3,

      color:{
        r:1,
        g:.4,
        b:.3
      },

      switchTexture: function(){
        var t = Math.randomFromArray( womb.textureArray );
        womb.materialSoft.uniforms.image.value = t;
      }

    },

    shinyMaterial:{

      noise_power:  .3,
      audio_power:  .2,
      speed:        .3,

      color:{
        r:.1,
        g:.4,
        b:.5
      },

      switchTexture: function(){
        var t = Math.randomFromArray( womb.textureArray );
        womb.materialShiny.uniforms.image.value = t;
      }

    }

  }

  /*
   
     Create our womb

  */
  womb = new Womb({
    cameraController: 'TrackballControls',
    objLoader:        true,
    textCreator:      true,
    title:            'STAY SHINY!',
    summary:          "press 'x' to hide interface",
    gui:              true,
    stats:            true,
  });

  // Communal uniform
  womb.time = { type: "f" , value: 0 };
  
  //womb.stream = womb.audioController.createUserAudio();
  womb.stream = womb.audioController.createStream( '../lib/audio/tracks/littleBitFrightened.mp3' );
  womb.audioController.gain.gain.value = 1;


  /*  
   *  TEXT
   */
  womb.textCreator.params.crispness = 30;
  womb.textTexture = womb.textCreator.createTexture( '[o_O]' , { 
    square: true,
  });

  
  womb.shinyTexture = THREE.ImageUtils.loadTexture( 'lib/img/shiny/cross.png' );
  womb.metaTexture  = THREE.ImageUtils.loadTexture( 'lib/img/shiny/meta.png', THREE.UVMapping , function(){
    console.log('META' );   
  });

  womb.moonTexture  = THREE.ImageUtils.loadTexture( 'lib/img/moon_1024.jpg', THREE.UVMapping  , function(){
    console.log('MOON' );
  });

 
  womb.loader.addCondition( womb.metaTexture && womb.moonTexture == true  , function(){
    
    console.log( 'MOON AND META' );

  });

  womb.textureArray = [

    womb.textTexture,
    womb.shinyTexture,
    womb.metaTexture,
    womb.moonTexture,

  ]


  womb.stream.play();
  womb.textureArray.push( womb.stream.texture.texture );
  womb.loader.loadBarAdd();


 
  /*womb.stream.onStreamCreated = function(){

    womb.textureArray.push( womb.stream.texture.texture );
    womb.loader.loadBarAdd();

  }*/
  

  womb.update = function(){

    womb.time.value ++;

  }

  womb.start = function(){



    // SHARED UNIFORMS
    womb.u = {

      texture:    { type: "t", value: womb.stream.texture.texture },
      image:      { type: "t", value: womb.stream.texture.texture },
      color:      { type: "v3", value: new THREE.Vector3( 1 , .5 , .4 ) },
      time:       womb.time,
      pow_noise:  { type: "f" , value: 0.2 },
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
    womb.uSoft.pow_noise.value  = params.softMaterial.noise_power;
    womb.uSoft.pow_audio.value  = params.softMaterial.audio_power;

    womb.uShiny.texture.value   = womb.stream.texture.texture;
    womb.uShiny.image.value     = womb.shinyTexture;
    womb.uShiny.time            = womb.time;
    womb.uShiny.pow_noise.value = params.shinyMaterial.noise_power;
    womb.uShiny.pow_audio.value = params.shinyMaterial.audio_power;
   

    /*

       Setting up the GUI

    */

    womb.interface.addColorUniform( womb.uSoft.color );
    var guiSoft   = womb.interface.gui.addFolder( 'Snow Material' );
    var guiShiny  = womb.interface.gui.addFolder( '[o_O] Material' );

    // Giving a range for the noise
    var range = params.softMaterial.noise_power * 3;

    guiSoft.add( params.softMaterial , 'noise_power', -range , range )
      .onChange( function( value ){
        womb.uSoft.pow_noise.value  = value;   
      });
    
    guiSoft.add( params.softMaterial , 'audio_power', -range , range )
      .onChange( function( value ){

        womb.uSoft.pow_audio.value  = value;   
      });

    // Function to switch from texture to texture
    guiSoft.add( params.softMaterial , 'switchTexture' );
     
    // Need a seperate r , g and b slider for each color
    // Although this will be changed as we build out the interface
    var color = guiSoft.addFolder( 'Color' );
    color.add( params.softMaterial.color , 'r' , 0 , 1  )
      .onChange( function( v ){

        var r = v;
        var g = params.softMaterial.color.g;
        var b = params.softMaterial.color.b;
        womb.uSoft.color.value = new THREE.Vector3( r , g , b );

      });
    color.add( params.softMaterial.color , 'g' , 0 , 1  )
      .onChange( function( v ){

        var g = v;
        var r = params.softMaterial.color.r;
        var b = params.softMaterial.color.b;
        womb.uSoft.color.value = new THREE.Vector3( r , g , b );

      });
    color.add( params.softMaterial.color , 'b' , 0 , 1  )
      .onChange( function( v ){

        var b = v;
        var r = params.softMaterial.color.r;
        var g = params.softMaterial.color.g;
        womb.uSoft.color.value = new THREE.Vector3( r , g , b );

      });


    var v = params.shinyMaterial.noise_power * 20;
    guiShiny.add( params.shinyMaterial , 'noise_power', -v , v)
      .onChange( function( v ){
        womb.uShiny.pow_noise.value  = v;   
      });

    var v = params.shinyMaterial.audio_power * 20;
    guiShiny.add( params.shinyMaterial , 'audio_power', -v , v)
      .onChange( function(v ){
        womb.uShiny.pow_audio.value  = v;   
      });

    guiShiny.add( params.shinyMaterial , 'switchTexture' );
     
    var color = guiShiny.addFolder( 'Color' );
    color.add( params.shinyMaterial.color , 'r' , 0 , 1  )
      .onChange( function( v ){

        var r = v;
        var g = params.shinyMaterial.color.g;
        var b = params.shinyMaterial.color.b;
        womb.uShiny.color.value = new THREE.Vector3( r , g , b );

      });
    color.add( params.shinyMaterial.color , 'g' , 0 , 1  )
      .onChange( function( v ){

        var g = v;
        var r = params.shinyMaterial.color.r;
        var b = params.shinyMaterial.color.b;
        womb.uShiny.color.value = new THREE.Vector3( r , g , b );

      });
    color.add( params.shinyMaterial.color , 'b' , 0 , 1  )
      .onChange( function( v ){

        var b = v;
        var r = params.shinyMaterial.color.r;
        var g = params.shinyMaterial.color.g;
        womb.uShiny.color.value = new THREE.Vector3( r , g , b );

      });




    /*
     *
     * SNOWFLAKE
     *
     */

    womb.materialSoft = new THREE.ShaderMaterial( {
      uniforms:       womb.uSoft, 
      vertexShader:   vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.image.sample_pos_diamond,
      transparent:    true,
      fog:            true,
      blending:       THREE.AdditiveBlending,
      opacity:        .1
    });

    var recursiveArray = [];
    recursiveFunctions.antiSerpenski( 
        recursiveArray,
        new THREE.Vector3(),
        womb.size / 5,
        10,
        2.4,
        womb.size / 30
    );

    var fullGeo = new THREE.Geometry();
    var basicMaterial = new THREE.MeshBasicMaterial();
    var s = womb.size / 20;
    var geo = new THREE.CubeGeometry( s , s, s, 10 , 10 , 10 );
    for( var i  = 0; i < recursiveArray.length; i++ ){

      var mesh = new THREE.Mesh(
        geo,
        basicMaterial 
      );

      mesh.position = recursiveArray[i][0];
      mesh.scale.multiplyScalar( recursiveArray[i][2] / 10 );

      THREE.GeometryUtils.merge( fullGeo , mesh );


    }

    var numOf = 3;
    for( var i = 0; i < numOf; i++ ){
      
      var mesh = new THREE.Mesh( fullGeo , womb.materialSoft );
      mesh.rotation.z = 2 * Math.PI * i / numOf;
      womb.scene.add( mesh );
   
    }


    /*
     *
     *  CREATING BOXES
     *
     */
    var s = womb.size / 30;
    var cubeGeo = new THREE.CubeGeometry( s , s , s , 10 , 10 , 10 );
    
    womb.materialShiny = new THREE.ShaderMaterial( {
      uniforms:womb.uShiny, 
      vertexShader: vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.image.sample_uv_diamond,
      transparent:true,
      fog: true,
      blending: THREE.AdditiveBlending,
      opacity:.1
    });

    var numOf = 1;

    womb.shinyMeshes = [];

    var fullGeo = new THREE.Geometry();
    for( var i =  0; i < numOf; i ++ ){

      
      var mesh = new THREE.Mesh( 
        cubeGeo,
        womb.materialShiny
      );

      if( i != 0 ){
        Math.THREE.setRandomVector( mesh.position , womb.size * 1 );
        Math.THREE.setRandomVector( mesh.rotation , Math.PI );
      }else{
        mesh.scale.multiplyScalar( 3 );
      }


      womb.shinyMeshes.push( mesh );

      womb.scene.add( mesh );
      THREE.GeometryUtils.merge( fullGeo , mesh );

    }


   // var mesh = new THREE.Mesh( fullGeo , womb.materialShiny );
    //mesh.scale.multiplyScalar( .5 );
    //womb.scene.add( mesh );



    womb.onWindowResize();

  }


});
