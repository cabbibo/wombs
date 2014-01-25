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


  function FractalCombo( womb , params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    var self = this;
    this.params = _.defaults( params || {} , {

      spin: .001,
      color:  new THREE.Vector3( 0.5 , 0.1 , 0.0 ),
      seed:   new THREE.Vector3( -0.1 , -0.1 ,  -0.9),
      seed1:  new THREE.Vector3( -0.2 , -0.4 ,  -0.5),
      seed2:  new THREE.Vector3( -0.5 , -0.2 ,  -0.6),
      seed3:  new THREE.Vector3( -0.1 , -0.6 ,  -0.3),
      seed4:  new THREE.Vector3( -0.6 , -0.3 ,  -0.2),
      lightness: 1,
      radius: 10,
      modelScale: 1,
      audioPower: 0.1,
      noisePower: 0.4,
      texture: self.womb.stream.texture.texture,
     // geo: new THREE.CubeGeometry( 1 , 1 , 1 , 20 , 20 ,20 ),
      geo: new THREE.IcosahedronGeometry( 1 , 5 ),
      numOf: 1,

    });
    
    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;

    this.texture = this.params.texture;

    var self = this;

    this.geo = this.params.geo 

    this.uniforms = {

      color:      { type: "v3", value: this.params.color },
      lightness:  { type: "f", value: this.params.lightness  },
      seed:       { type: "v3", value: this.params.seed  },
      seed1:      { type: "v3", value: this.params.seed1  },
      seed2:      { type: "v3", value: this.params.seed2  },
      seed3:      { type: "v3", value: this.params.seed3  },
      seed4:      { type: "v3", value: this.params.seed4  },
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
      "uniform vec3 seed1;",
      "uniform vec3 seed2;",
      "uniform vec3 seed3;",
      "uniform vec3 seed4;",
      "uniform float lightness;",
      "uniform float loop;",
      "uniform float noisePower;",
      "varying vec2 vUv;",
      "varying vec3 vPos;",

      shaderChunks.createKali( 5 ),


      "varying float displacement;",

      "void main( void ){",
        "vec3 nPos = normalize( vPos );",

        "vec3 c = kali( nPos , seed );",

        "vec3 c1 = kali( nPos , seed1 );",
        "vec3 c2 = kali( nPos , seed2 );",
        //"vec3 c3 = kali( nPos , seed3 );",
        //"vec3 c4 = kali( nPos , seed4 );",

        "vec3 cT = normalize( c + c1 + c2 );",

        "vec3 cN = normalize( normalize( cT ) + color );",
        "gl_FragColor = vec4( lightness * vec3(cN.x , cN.y * .4 , .1 ) , cN.z+.5 );",
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
      //opacity         :.3 
      //wireframe       : true
    
    });



    this.size = this.womb.size / 50;


    for(var i = 0;  i < this.params.numOf; i++ ){
    this.mesh = new THREE.Mesh( this.geo , this.material );
    this.mesh.scale.multiplyScalar( this.params.modelScale );
    this.mesh.rotation.x = 2 * Math.PI * i / this.params.numOf;
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
      
        self.uniforms.seed.value.x = ( Math.sin( self.uniforms.time.value / 10.0 ) -1.0 ) / 2;
        self.uniforms.seed.value.y = ( Math.cos( self.uniforms.time.value / 10.0 ) -1.0 ) / 2;
        self.uniforms.seed.value.z = ( Math.cos( self.uniforms.time.value / 30.0 ) -1.0 ) / 2;

        self.uniforms.seed1.value.x = ( Math.sin( self.uniforms.time.value / 12.0 ) -1.0 ) / 2;
        self.uniforms.seed1.value.y = ( Math.cos( self.uniforms.time.value / 15.0 ) -1.0 ) / 2;
        self.uniforms.seed1.value.z = ( Math.cos( self.uniforms.time.value / 10.0 ) -1.0 ) / 2;

        self.uniforms.seed2.value.x = ( Math.sin( self.uniforms.time.value / 12.0 ) -1.0 ) / 2;
        self.uniforms.seed2.value.y = ( Math.cos( self.uniforms.time.value / 30.0 ) -1.0 ) / 2;
        self.uniforms.seed2.value.z = ( Math.cos( self.uniforms.time.value / 15.0 ) -1.0 ) / 2;

        self.uniforms.seed3.value.x = ( Math.sin( self.uniforms.time.value / 35.0 ) -1.0 ) / 2;
        self.uniforms.seed3.value.y = ( Math.cos( self.uniforms.time.value / 30.0 ) -1.0 ) / 2;
        self.uniforms.seed3.value.z = ( Math.cos( self.uniforms.time.value / 25.0 ) -1.0 ) / 2;

        self.uniforms.seed4.value.x = ( Math.sin( self.uniforms.time.value / 13.0 ) -1.0 ) / 2;
        self.uniforms.seed4.value.y = ( Math.cos( self.uniforms.time.value / 8.0 ) -1.0 ) / 2;
        self.uniforms.seed4.value.z = ( Math.cos( self.uniforms.time.value / 15.0 ) -1.0 ) / 2;



      }

    }

    womb.loader.loadBarAdd();

  }

  FractalCombo.prototype.update = function(){

  }
  FractalCombo.prototype.enter = function(){
    this.world.enter();
  }

  FractalCombo.prototype.exit = function(){
    this.world.exit();
  }

  module.exports = FractalCombo;

});
