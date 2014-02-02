/*
 
   Fractal Combo:

   What a delightfully organic species the Fractal Combo is. 
   
   Its delicately textured skin has been said to cure diseases at a mere glance.
   Although it can get relatively chaotic in its temperment, changing its SPEED
   parameter will calm it down to whatever level of intensity you enjoy.

   Changing the COMPLEXITY parameter will tell you how deep into the mind of 
   the fractal beast you will see, whereas the VARIANCE will determine how much
   its skin crawls if it is being updated.

   Notes:
   
   -  The Fractal Combo is quite a complex beast, thus make sure it remains relatively
      small, or your GPU will hate you. Covering the screen with a Fractal Combo is 
      NOT recommended.

  Ways in which you can help the Fractal Combo can grow:

  - a 'numOfFractals' parameter may be added, so it could be the combination of 1-100 fractals
  - the vertex shader should be able to be passed in, making the body of the beast variable,
    but the skin still fractal as FUK.

*/

define(function(require, exports, module) {
 
  var Womb                = require( 'Womb/Womb'                  );

  var recursiveFunctions  = require( 'Utils/RecursiveFunctions'   );
  var m                   = require( 'Utils/Math'                 );

  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  function FractalCombo( womb , params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    var self = this;
    this.params = _.defaults( params || {} , {

      spin:       .001,
      color:      new THREE.Vector3( 0.5 , 0.1 , 0.0 ),
      seed:       new THREE.Vector3( -0.5 , -0.8 ,  -0.9),
      seed1:      new THREE.Vector3( -0.7 , -0.6 ,  -0.5),
      seed2:      new THREE.Vector3( -0.6 , -0.6 ,  -0.6),
      seed3:      new THREE.Vector3( -0.9 , -0.6 ,  -0.8),
      seed4:      new THREE.Vector3( -0.6 , -0.8 ,  -0.7),
      speed:      1,
      lightness:  1,
      radius:     10,
      modelScale: 1,
      audioPower: 0.1,
      noisePower: 0.4,
      complexity: 5,
      variance:   .5,
      texture:    self.womb.stream.texture.texture,
      additive:   true,
      geo:        new THREE.IcosahedronGeometry( 1 , 5 ),
      numOf:      1,

    });
    
    this.being = this.womb.creator.createBeing();

    this.scene = this.being.scene;

    this.texture = this.params.texture;

    var self = this;

    this.geo = this.params.geo 

    this.uniforms = {

      color:      { type: "v3" , value: this.params.color  },

      seed:       { type: "v3" , value: this.params.seed   },
      seed1:      { type: "v3" , value: this.params.seed1  },
      seed2:      { type: "v3" , value: this.params.seed2  },
      seed3:      { type: "v3" , value: this.params.seed3  },
      seed4:      { type: "v3" , value: this.params.seed4  },
      
      texture:    { type: "t"  , value: womb.stream.texture.texture },
      
      noiseSize:  { type: "f"  , value: 1 },
      lightness:  { type: "f"  , value: this.params.lightness  },      
      noisePower: { type: "f"  , value: this.params.noisePower },
      audioPower: { type: "f"  , value: this.params.audioPower },    

      time:       womb.time,
    
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
      "varying float displacement;",

      shaderChunks.createKali( this.params.complexity ),

      "void main( void ){",
        "vec3 nPos = normalize( vPos );",

        "vec3 c  = kali( nPos , seed  );",
        "vec3 c1 = kali( nPos , seed1 );",
        "vec3 c2 = kali( nPos , seed2 );",
        "vec3 c3 = kali( nPos , seed3 );",
        "vec3 c4 = kali( nPos , seed4 );",

        "vec3 cT = normalize( c + c1 + c2 + c3 + c4 );",

        "vec3 cN = normalize( normalize( cT ) + color );",
        "gl_FragColor = vec4( lightness * vec3(cN.x , cN.y * .4 , .1 ) , cN.z+.5 );",
      "}"

    ].join( "\n" );
 
    if( this.params.additive ){
      
      this.material = new THREE.ShaderMaterial({

        uniforms        : this.uniforms,       
        vertexShader    : this.vertexShader,
        fragmentShader  : this.fragmentShader,
     

        depthTest       : false,
        side            : THREE.DoubleSide,
        blending        : THREE.AdditiveBlending,
        transparent     : true,
   
      
      });

    }else{

      this.material = new THREE.ShaderMaterial({

        uniforms        : this.uniforms,       
        vertexShader    : this.vertexShader,
        fragmentShader  : this.fragmentShader,
      
      });

    }

    this.size = this.womb.size / 50;

    for(var i = 0;  i < this.params.numOf; i++ ){
    
      this.mesh = new THREE.Mesh( this.geo , this.material );
      this.mesh.scale.multiplyScalar( this.params.modelScale );
      this.mesh.rotation.x = 2 * Math.PI * i / this.params.numOf;
      this.scene.add( this.mesh );

    }
 
    
    var self = this;
    this.being.update = function(){
      
      self.update();


      var t = self.uniforms.time.value;
      var s = self.params.speed;

      var v = self.params.variance;
  
      var seed  = self.params.seed;
      var seed1 = self.params.seed1;
      var seed2 = self.params.seed2;
      var seed3 = self.params.seed3;
      var seed4 = self.params.seed4;

      var uSeed  = self.uniforms.seed.value;
      var uSeed1 = self.uniforms.seed1.value;
      var uSeed2 = self.uniforms.seed2.value;
      var uSeed3 = self.uniforms.seed3.value;
      var uSeed4 = self.uniforms.seed4.value;


      if( self.updateSeed ==  true ){
      
        uSeed.x  = seed.x  + v * ( Math.sin( t * s / 10.0 ) - 1.0 ) / 2;
        uSeed.y  = seed.y  + v * ( Math.cos( t * s / 10.0 ) - 1.0 ) / 2;
        uSeed.z  = seed.z  + v * ( Math.cos( t * s / 30.0 ) - 1.0 ) / 2;

        uSeed1.x = seed1.x + v * ( Math.sin( t * s / 12.0 ) - 1.0 ) / 2;
        uSeed1.y = seed1.y + v * ( Math.cos( t * s / 15.0 ) - 1.0 ) / 2;
        uSeed1.z = seed1.z + v * ( Math.cos( t * s / 10.0 ) - 1.0 ) / 2;

        uSeed2.x = seed2.x + v * ( Math.sin( t * s / 12.0 ) - 1.0 ) / 2;
        uSeed2.y = seed2.y + v * ( Math.cos( t * s / 30.0 ) - 1.0 ) / 2;
        uSeed2.z = seed2.z + v * ( Math.cos( t * s / 15.0 ) - 1.0 ) / 2;

        uSeed3.x = seed3.x + v * ( Math.sin( t * s / 35.0 ) - 1.0 ) / 2;
        uSeed3.y = seed3.y + v * ( Math.cos( t * s / 30.0 ) - 1.0 ) / 2;
        uSeed3.z = seed3.z + v * ( Math.cos( t * s / 25.0 ) - 1.0 ) / 2;

        uSeed4.x = seed4.x + v * ( Math.sin( t * s / 13.0 ) - 1.0 ) / 2;
        uSeed4.y = seed4.y + v * ( Math.cos( t * s / 8.0 )  - 1.0 ) / 2;
        uSeed4.z = seed4.z + v * ( Math.cos( t * s / 15.0 ) - 1.0 ) / 2;

      }

    }

    womb.loader.loadBarAdd();

  }

  FractalCombo.prototype.update = function(){

  }

  FractalCombo.prototype.startSeedUpdate = function(){
    this.updateSeed = true;
  }

  FractalCombo.prototype.stopSeedUpdate = function(){
    this.updateSeed = false;
  }



  FractalCombo.prototype.enter = function(){
    this.being.enter();
  }

  FractalCombo.prototype.exit = function(){
    this.being.exit();
  }

  module.exports = FractalCombo;

});
