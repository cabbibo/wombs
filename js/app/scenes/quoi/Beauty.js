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


  function Random( womb , params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    var self = this;
    this.params = _.defaults( params || {} , {

      spin: .001,
      color: new THREE.Vector3( .3 , .5 , 1.9 ),
      seed: new THREE.Vector3( -0.1 , -0.1 ,  -0.9),
      radius: 10,
      modelScale: 1,
      audioPower: 0.1,
      noisePower: 0.4,
      texture: self.womb.stream.texture.texture,
     // geo: new THREE.CubeGeometry( 1 , 1 , 1 , 20 , 20 ,20 ),
      geo: new THREE.IcosahedronGeometry( 1 , 5 ),
      numOf: 6,

    });
    
    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;

    this.texture = this.params.texture;

    var self = this;

    this.geo = this.params.geo 

    this.uniforms = {

      color:      { type: "v3", value: this.params.color },
      seed:       { type: "v3", value: this.params.seed  },
      texture:    { type: "t" , value: womb.stream.texture.texture },
      time:       womb.time,
      noiseSize:  { type: "f" , value: 1 },
      noisePower: { type: "f" , value: this.params.noisePower },
      audioPower: { type: "f" , value: this.params.audioPower },    
    
    }

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

        "offset.x = nPos.x + cos( time * 100.0 / 100.0 );",
        "offset.y = nPos.y + sin( time * 100.0 / 100.0 );",
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

      shaderChunks.createKali( 5 ),


      "varying float displacement;",

      "void main( void ){",
        "vec3 nPos = normalize( vPos );",

        //"vec3 c = kali( nPos , seed );",

        //"vec3 cN = normalize( normalize( c )  );",
        "gl_FragColor = vec4( color * ( ( displacement -.5 ) / ( noisePower * 2.0 ) ) , .05 );",
      "}"

    ].join( "\n" );

    this.material = new THREE.ShaderMaterial({

      uniforms        : this.uniforms,       
      vertexShader    : this.vertexShader,
      fragmentShader  : this.fragmentShader,
   

      depthTest       : false,
      side            : THREE.DoubleSide,
      blending        : THREE.AdditiveBlending,
      transparent     : true,
      opacity         :.3 
      //wireframe       : true
    
    });



    this.size = this.womb.size / 50;


    for(var i = 0;  i < this.params.numOf; i++ ){
    this.mesh = new THREE.Mesh( this.geo , this.material );
    this.mesh.scale.multiplyScalar( this.params.modelScale );
    //this.mesh.scale.y *= .2;
    this.mesh.scale.z *= .4;
    this.mesh.position.z += this.size * 5.0;
    this.mesh.rotation.z = 2 * Math.PI * i / this.params.numOf;
    //this.mesh.scale.multiplyScalar( this.modelScale );
    this.scene.add( this.mesh );

    }
 
    //var numOf = this.params.numOf;


      

    //this.mesh = new THREE.Mesh( this.fullFullGeo , this.material );
    //this.scene.add( this.mesh );

    var self = this;
    this.world.update = function(){
      
      self.update();


      if( self.updateSeed ==  true ){
      
        self.uniforms.seed.value.x = ( Math.sin( self.uniforms.time.value / 9.0 ) -1.0 ) / 2;
        self.uniforms.seed.value.y = ( Math.cos( self.uniforms.time.value / 7.0 ) -1.0 ) / 2;
        self.uniforms.seed.value.z = ( Math.cos( self.uniforms.time.value / 2.0 ) -1.0 ) / 2;


      }

    }

    womb.loader.loadBarAdd();

  }

  Random.prototype.update = function(){

  }
  Random.prototype.enter = function(){
    this.world.enter();
  }

  Random.prototype.exit = function(){
    this.world.exit();
  }

  module.exports = Random;

});
