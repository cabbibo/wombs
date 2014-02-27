define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');


  var Womb                = require( 'app/Womb'                       );

  var recursiveFunctions  = require( 'app/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );
  var shaderChunks        = require( 'app/shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'app/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );


  function Image( womb , params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    var self = this;
    this.params = _.defaults( params || {} , {

      text: 'HELLO',
      spin: .001,
      color: new THREE.Vector3( .3 , .5 , 1.9 ),
      radius: 10,
      size:   .3,
      modelScale: 1,
      audioPower: 0.5,
      noisePower: 0.1,
      ratio:      1,
      texture:    womb.stream.texture.texture,
      image: '/lib/img/textures/.png',
      fragmentAudio: true,
      vertexAudio:    true,
      geo: new THREE.CubeGeometry( 1 , 1 , 1 , 10 , 10 ,10 ),
      numOf: 50

    });

    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;

    this.texture = this.params.texture;

    if( this.params.audio )
      this.audio = this.params.audio;

    var self = this;


    var mapHeight = THREE.ImageUtils.loadTexture( "/lib/models/leeperrysmith/Infinite-Level_02_Disp_NoSmoothUV-4096.jpg" );


     this.u = {
      texture:    { type: "t", value: womb.stream.texture.texture },
      image:      { type: "t", value: womb.stream.texture.texture },

      color:      { type: "v3", value: this.params.color },
      time:       womb.time,
      pow_noise:  { type: "f" , value: 0.01 },
      pow_audio:  { type: "f" , value: .04 },
    }
    
    this.t_CENTER = mapHeight;

    this.u_CENTER= THREE.UniformsUtils.merge( [
        THREE.ShaderLib['basic'].uniforms,
        this.u,
    ]);

    this.u_CENTER.time          = this.womb.time;
    this.u_CENTER.image.value   = this.t_CENTER;
    this.u_CENTER.texture.value = this.params.texture;
    
    if( this.audio )
      this.u_CENTER.texture.value = this.audio.texture.texture;

    // Have to switch out for the picture if we aren't doing an 
    // Audio Fragment Shader
     if( this.params.fragmentAudio ){
      this.fragmentShader = fragmentShaders.audio.color.image.sample_pos_diamond
    }else{
      this.u_CENTER.texture.value = this.u_CENTER.image.value;
      this.fragmentShader = fragmentShaders.texture;
    }

    if( this.params.vertexAudio ){
      this.vertexShader = vertexShaders.audio.noise.position
    }else{
      this.vertexShader = vertexShaders.passThrough;
    }


    this.materialAudio = new THREE.ShaderMaterial( {
      uniforms:       this.u_CENTER, 
      vertexShader:   this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent:    true,
      fog:            true,
      opacity:        0.1,
      side:           THREE.DoubleSide
    });


    mapHeight.anisotropy = 4;
    mapHeight.repeat.set( 0.998, 0.998 );
    mapHeight.offset.set( 0.001, 0.001 )
    mapHeight.wrapS = mapHeight.wrapT = THREE.RepeatWrapping;
    mapHeight.format = THREE.RGBFormat;

    this.material = new THREE.MeshPhongMaterial( { ambient: 0x552811, color: 0x552811, specular: 0x333333, shininess: 25, bumpMap: mapHeight, bumpScale: 19, metal: false } );


    // LIGHTS
    ambientLight = new THREE.AmbientLight( 0x444444 );
    this.scene.add( ambientLight );

    this.ambientLight = ambientLight;
    //

    pointLight = new THREE.PointLight( 0xffffff, 1.5, 1000 );
    pointLight.color.setHSL( 0.05, 1, 0.95 );
    pointLight.position.set( 0, 0, 600 );

    this.scene.add( pointLight );

    this.pointLight = pointLight;

    // shadow for PointLight

    spotLight = new THREE.SpotLight( 0xffffff, 1.5 );
    spotLight.position.set( 0.05, 0.05, 1 );
    spotLight.color.setHSL( 0.6, 1, 0.95 );
    this.scene.add( spotLight );

    spotLight.position.multiplyScalar( 700 );

    spotLight.castShadow = true;
    spotLight.onlyShadow = true;
    // spotLight.shadowCameraVisible = true;

    spotLight.shadowMapWidth = 2048;
    spotLight.shadowMapHeight = 2048;

    spotLight.shadowCameraNear = 200;
    spotLight.shadowCameraFar = 1500;

    spotLight.shadowCameraFov = 40;

    spotLight.shadowBias = -0.005;
    spotLight.shadowDarkness = 0.35;

    this.spotLight = spotLight;

    //

    directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
    directionalLight.position.set( 1, -0.5, 1 );
    directionalLight.color.setHSL( 0.6, 1, 0.95 );
    this.scene.add( directionalLight );

    directionalLight.position.multiplyScalar( 500 );

    directionalLight.castShadow = true;
    // directionalLight.shadowCameraVisible = true;

    directionalLight.shadowMapWidth = 2048;
    directionalLight.shadowMapHeight = 2048;

    directionalLight.shadowCameraNear = 200;
    directionalLight.shadowCameraFar = 1500;

    directionalLight.shadowCameraLeft = -500;
    directionalLight.shadowCameraRight = 500;
    directionalLight.shadowCameraTop = 500;
    directionalLight.shadowCameraBottom = -500;

    directionalLight.shadowBias = -0.005;
    directionalLight.shadowDarkness = 0.35;

    this.directionalLight = directionalLight;

    //

    directionalLight2 = new THREE.DirectionalLight( 0xffffff, 1.2 );
    directionalLight2.position.set( 1, -0.5, -1 );
    directionalLight2.color.setHSL( 0.08, 1, 0.825 );
    this.scene.add( directionalLight2 );

    this.directionalLight2 = directionalLight2;

    loader = new THREE.JSONLoader( true );
   // document.body.appendChild( loader.statusDomElement );

    var self = this;

    this.createScene = function( geometry ){

      this.material.color.setHSL( 250 , .9 , .5 );
      mesh = new THREE.Mesh( geometry, this.material );

      mesh.position.y = - 50;
      mesh.scale.set( this.params.size ,  this.params.size, this.params.size );

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.scene.add( mesh );

      this.head = mesh;


    }


    loader.load( "/lib/models/leeperrysmith/LeePerrySmith.js", function( geometry ) { self.createScene( geometry ) } );


    var self;
    this.world.update = function(){

      var f = this.womb.leapController.frame();

      if( f.hands[0] ){

     
        var r = f.hands[0].palmNormal;

        self.materialAudio.uniforms.color.value.x = Math.abs(r[0]) * 2;
        self.materialAudio.uniforms.color.value.y = Math.abs(r[1]) * 2;
        self.materialAudio.uniforms.color.value.z = Math.abs(r[2]) * 2;

      }
        


    }

    this.womb.loader.loadBarAdd();

    //this.world.update = this.update.bind( this );

  }


   

  Image.prototype.enter = function(){

    this.womb.renderer.antialias = false;
      //this.audio.turnOnFilter();
      //
    this.womb.renderer.shadowMapEnabled = true;
	this.womb.renderer.shadowMapCullFace = THREE.CullFaceBack;

				//

    this.womb.renderer.gammaInput = true;
    this.womb.renderer.gammaOutput = true;


    this.scene.add( this.directionalLight );
    this.scene.add( this.directionalLight2 );
    this.scene.add( this.pointLight );
    this.scene.add( this.spotLight );

    this.world.enter();

    this.scene.add( this.directionalLight );
    this.scene.add( this.directionalLight2 );
    this.scene.add( this.pointLight );
    this.scene.add( this.spotLight );

  }

  Image.prototype.exit = function(){
  


    /*this.womb.renderer.shadowMapEnabled = false;
	this.womb.renderer.shadowMapCullFace = THREE.CullFaceBack;

				//

    this.womb.renderer.gammaInput = false;
    this.womb.renderer.gammaOutput =  false;
   
    this.womb.renderer.antialias = true;*/

    this.world.exit();
  
  }

  module.exports = Image;

});
