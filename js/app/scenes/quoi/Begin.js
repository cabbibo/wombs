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


  function Credits( womb , params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    var self = this;
    this.params = _.defaults( params || {} , {

      spin: .001,
      color: new THREE.Vector3( .3 , .5 , 1.9 ),
      radius: 10,
      size:   .3,
      modelScale: 1,
      audioPower: 0.5,
      noisePower: 0.1,
      texture: self.womb.stream.texture.texture,
      geo: new THREE.CubeGeometry( 1 , 1 , 1 , 10 , 10 ,10 ),
      numOf: 50,

    });

    var loopFile = '/lib/audio/loops/quoi/introLoop.mp3';
    this.audio = womb.audioController.createLoop( loopFile );
    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;

    this.texture = this.params.texture;

    var self = this;

    this.geo = this.params.geo;

    this.links = [];

    this.u = {
      texture:    { type: "t", value: womb.stream.texture.texture },
      image:      { type: "t", value: womb.stream.texture.texture },

      color:      { type: "v3", value: this.params.color },
      time:       womb.time,
      pow_noise:  { type: "f" , value: 0.01 },
      pow_audio:  { type: "f" , value: .04 },
    }
    
    this.t_CENTER = this.womb.textCreator.createTexture( 'QUOI - AVALON EMERSON' );

    console.log( this.t_CENTER );
    this.u_CENTER= THREE.UniformsUtils.merge( [
        THREE.ShaderLib['basic'].uniforms,
        this.u,
    ]);

    this.u_CENTER.time          = this.womb.time;
    this.u_CENTER.image.value   = this.t_CENTER;
    this.u_CENTER.texture.value = this.audio.texture.texture;

    this.m_CENTER = new THREE.ShaderMaterial( {
      uniforms:       this.u_CENTER, 
      vertexShader:   vertexShaders.passThrough,
      fragmentShader: fragmentShaders.audio.color.image.sample_pos_diamond,
      transparent:    true,
      fog:            true,
      opacity:        0.1,
      side:           THREE.DoubleSide
    });

    this.CENTER = new THREE.Mesh(
      new THREE.PlaneGeometry( 30 , 30 , 100 , 100 ),
      this.m_CENTER
    );

    this.CENTER.scale.x = this.t_CENTER.scaledWidth;
    this.CENTER.scale.y = this.t_CENTER.scaledHeight;
    this.scene.add( this.CENTER );
  

     this.t_CENTER = this.womb.imageLoader.load('../lib/img/icons/cabbibo.png');

     this.u_CENTER= THREE.UniformsUtils.merge( [
        THREE.ShaderLib['basic'].uniforms,
        this.u,
    ]);

    this.u_CENTER.time          = this.womb.time;
    this.u_CENTER.image.value   = this.t_CENTER;
    this.u_CENTER.texture.value = this.audio.texture.texture;

    this.m_CENTER = new THREE.ShaderMaterial( {
      uniforms:       this.u_CENTER, 
      vertexShader:   vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.image.sample_pos_diamond,
      transparent:    true,
      fog:            true,
      opacity:        0.1,
      side:           THREE.DoubleSide
    });

    this.CENTER = new THREE.Mesh(
      new THREE.PlaneGeometry( 30 , 30 , 100 , 100 ),
      this.m_CENTER
    );

    this.CENTER.position.y = -50;
    this.scene.add( this.CENTER );

  
    

    
    var light = new THREE.DirectionalLight( 0xffffff , 3 );
    light.position.set( 0 , 0 , 1 );

    //this.scene.add( light );

    this.womb.loader.loadBarAdd();

    //this.world.update = this.update.bind( this );

  }


   

  Credits.prototype.enter = function(){
    this.audio.play();
    this.audio.gain.gain.value = 0.0
    this.audio.fadeIn( 1 );
    //this.audio.turnOnFilter();
    this.world.enter();
  }

  Credits.prototype.exit = function(){
    this.audio.fadeOut();
    this.world.exit();
  }

  module.exports = Credits;

});
