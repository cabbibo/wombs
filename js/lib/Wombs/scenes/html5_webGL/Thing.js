define(function(require, exports, module) {

  var m                   = require('wombs/utils/Math'              );
  var AudioGeometry       = require('wombs/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('wombs/utils/AnalyzingFunctions');


  var Womb                = require( 'wombs/Womb'                       );

  var recursiveFunctions  = require( 'wombs/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'wombs/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'wombs/shaders/vertexShaders'      );
  var physicsShaders      = require( 'wombs/shaders/physicsShaders'     );
  var shaderChunks        = require( 'wombs/shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'wombs/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'wombs/shaders/physicsShaders'     );


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
      image: '/lib/img/centerLogoWhite.png',
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

    this.geo = this.params.geo;


    this.uniforms  = {

      color:      { type: "v3", value: new THREE.Vector3( .0 , .0 , .9 ) },
      seed:       { type: "v3", value: new THREE.Vector3( -0.1 , -0.1 ,  -0.9) },
      texture:    { type: "t" , value: womb.stream.texture.texture },
      time:       womb.time,
      noiseSize:  { type: "f" , value: 1 },
      noisePower: { type: "f" , value: .2 },
      audioPower: { type: "f" , value: 0.2 },

    };

    this.vertexShader = [

      "varying vec2 vUv;",
      "varying vec3 vPos;",
      "varying float displacement;",

      "uniform sampler2D texture;",
      
      "uniform float time;",
      "uniform float noisePower;",
      "uniform float audioPower;",
      "uniform float noiseSize;",
      

      shaderChunks.noise3D,
      shaderChunks.absAudioPosition,
      shaderChunks.audioUV,

      "void main( void ){",

        "vUv = uv;",
        "vPos = position;",

        "vec3 pos = position;",
       
        "vec3 offset;",
        "vec3 nPos = normalize( position );",

        "offset.x = nPos.x + cos( time / 100.0 );",
        "offset.y = nPos.y + sin( time / 100.0 );",
        "offset.z = nPos.z;", //+ tan( time / 100.0 );",
        "offset *= noiseSize;",

        "vec2 absUV =  abs( uv - .5 );",

        "vec3 audioPosition = absAudioPosition( texture , position );",

        "float dAudio = snoise( audioPosition );",
        "float dNoise = snoise( offset );",

        "float aP = length( audioPosition );",

        "displacement = length( (audioPosition * audioPower) ) + ( dNoise * noisePower ) + .8;",


        "pos *= displacement;",

        "vec4 mvPosition = modelViewMatrix * vec4( pos , 1.0 );",
        "gl_Position = projectionMatrix * mvPosition;",

      "}"


    ].join( "\n" );


    this.fragmentShader = [

      "uniform vec3 color;",
      "uniform vec3 seed;",
      "uniform float loop;",
      "uniform float noisePower;",
      "varying vec2 vUv;",
      "varying vec3 vPos;",

      shaderChunks.createKali( 20 ),


      "varying float displacement;",

      "void main( void ){",
        "vec3 nPos = normalize( vPos );",

        "vec3 c = kali( nPos , seed );",

        "vec3 cN = normalize( normalize( c ) + 3.0 * color );",
        "gl_FragColor = vec4( cN * ( ( displacement -.5 ) / ( noisePower * 2.0 ) ) , 1.0 );",
      "}"

    ].join( "\n" );


    this.material = new THREE.ShaderMaterial({

    uniforms        : this.uniforms,       
    vertexShader    : this.vertexShader,
    fragmentShader  : this.fragmentShader,
 

      //depthTest       : false,
      //side            : THREE.DoubleSide,
      //blending        : THREE.AdditiveBlending,
      //transparent     : true,
      //wireframe       : true
    
    });

    this.mesh = new THREE.Mesh( this.params.geo , this.material );





    this.womb.loader.loadBarAdd();

    var self = this;
    this.world.update = function(){

      self.uniforms.seed.value.x = ( Math.sin( self.uniforms.time.value / 5 ) -1.0 ) / 2;
      self.uniforms.seed.value.y = ( Math.cos( self.uniforms.time.value / 5 ) -1.0 ) / 2;
    }


    this.scene.add( this.mesh );

  }


   

  Image.prototype.enter = function(){

    if( this.audio ){
      this.audio.play();
      this.audio.gain.gain.value = 0.0
      this.audio.fadeIn( 1 );
    }
    //this.audio.turnOnFilter();
    this.world.enter();
  }

  Image.prototype.exit = function(){
   
    if( this.audio ){
      this.audio.fadeOut();
    }
  
    this.world.exit();
  
  }

  module.exports = Image;

});
