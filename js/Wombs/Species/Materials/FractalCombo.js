/*
 
   Fractal Combo:

   What a delightfully organic species the Fractal Combo is. 
   
   Its delicately textured skin has been said to cure diseases at a mere glance.
   Although it can get relatively chaotic in its temperment, changing its SPEED
   parameter will calm it down to whatever level of intensity you enjoy.

   Changing the COMPLEXITY parameter will tell you how deep into the mind of 
   the fractal beast you will see, whereas the VARIANCE will determine how much
   its skin crawls if it is being updated. INFLUENCE directs the proportion of 
   how much is the original color, and how much is the fractal color.

   Notes:
   
   -  The Fractal Combo is quite a complex beast, thus make sure it 
      remains relatively small, or your GPU will hate you. Covering 
      the screen with a Fractal Combo is NOT recommended.

  Ways in which you can help the Fractal Combo can grow:

  - a 'numOfFractals' parameter may be added, so it could be the 
    combination of 1-100 fractals

  - the vertex shader should be able to be passed in, making the
    body of the beast variable,but the skin still fractal as FUK.

*/

define(function(require, exports, module) {
 
  var Womb                = require( 'Womb/Womb'                  );

  var m                   = require( 'Utils/Math'                 );

  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  
  function FractalCombo( womb , parameters ){


    console.log( 'HELLO' );
    womb.loader.addToLoadBar();

    var params = _.defaults( parameters || {} , {

      color:      new THREE.Vector3( 0.5 , 0.0 , 1.5 ),
      
      seed:       new THREE.Vector3( -0.7 , -0.8 ,  -0.9),
      seed1:      new THREE.Vector3( -0.7 , -0.6 ,  -0.5),
      seed2:      new THREE.Vector3( -0.6 , -0.6 ,  -0.6),
      
      speed:       10,
      lightness:   .9,
      radius:      10,

      displacementPower:    0.0,
      displacementOffset:   5.0,
     
      texturePower: 0.8,
      texture:      womb.defaults.texture,

      noisePower: 0.4,
      opacity:      1,
      complexity:   5,
      variance:    .5,
      influence:    3,

      transparent: true,
      additive:   false, 
 
    });
   
  
    var uniforms = {

      color:        { type: "v3" , value: params.color  },

      seed:         { type: "v3" , value: params.seed.clone()   },
      seed1:        { type: "v3" , value: params.seed1.clone()   },
      seed2:        { type: "v3" , value: params.seed2.clone()   },
      
      texture:      { type: "t"  , value: params.texture },
      
      noiseSize:    { type: "f"  , value: 1 },
      influence:    { type: "f"  , value: params.influence  },      
      lightness:    { type: "f"  , value: params.lightness  },      
      noisePower:   { type: "f"  , value: params.noisePower },
      texturePower: { type: "f"  , value: params.texturePower },    
      
      
      displacementPower:  { type: "f"  , value: params.displacementPower },    
      displacementOffset: { type: "f"  , value: params.displacementOffset },    

      opacity:      { type: "f"  , value: params.opacity },     
      time:         womb.time,
    
    }


    var vertexShader = [

      "varying vec2 vUv;",
      "varying vec3 vPos;",
      "varying float displacement;",

      "uniform sampler2D texture;",
      "uniform float texturePower;",

      "uniform float noisePower;",
      "uniform float noiseSize;",

      
      "uniform float time;",
      
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
        
        "float dAudio = snoise3( audioPosition );",
        "float dNoise = snoise3( offset );",

        "float aP = length( audioPosition );",

        "displacement = length( (audioPosition * texturePower ) ) + ( dNoise * noisePower ) + .8;",

        "pos *= displacement;",

        "vec4 mvPosition = modelViewMatrix * vec4( pos , 1.0 );",
        "gl_Position = projectionMatrix * mvPosition;",

      "}"


    ].join( "\n" );

    var fragmentShader = [

      "uniform vec3 color;",
      "uniform vec3 seed;",
      "uniform vec3 seed1;",
      "uniform vec3 seed2;",
      "uniform float opacity;",
      "uniform float lightness;",
      "uniform float influence;",
      "uniform float displacementPower;",
      "uniform float displacementOffset;",

      "varying vec2 vUv;",
      "varying vec3 vPos;",
      "varying float displacement;",

      shaderChunks.createKali( params.complexity ),

      "void main( void ){",
        "vec3 nPos = normalize( vPos );",
        "float l = length( vPos );",
        "float dis =( displacementOffset - displacement  ) * displacementPower;",

        "vec3 c  = kali( nPos , -abs( seed  ));",
        "vec3 c1 = kali( nPos , -abs( seed1 ));",
        "vec3 c2 = kali( nPos , -abs( seed2 ));",

        "vec3 cT = normalize( abs(c) + abs(c1) + abs(c2));",

        "vec3 cN = normalize( cT * influence + color );",
        "gl_FragColor = vec4( cN * lightness - dis  , opacity );",
      "}"

    ].join( "\n" );
 
    var material;

    if( params.additive ){
      
      material = new THREE.ShaderMaterial({

        uniforms        : uniforms,       
        vertexShader    : vertexShader,
        fragmentShader  : fragmentShader,
     

        depthTest       : false,
        side            : THREE.DoubleSide,
        blending        : THREE.AdditiveBlending,
        transparent     : true,
   
      
      });

    }else{

      material = new THREE.ShaderMaterial({

        uniforms        : uniforms,       
        vertexShader    : vertexShader,
        fragmentShader  : fragmentShader,
        

      
      });

    }

    material.params = params;

    material._update = function(){
     
      //console.log( this );
      var t = this.uniforms.time.value;
      var s = this.params.speed;

      var v = this.params.variance;
  
      var seed  = this.params.seed;
      var seed1 = this.params.seed1;
      var seed2 = this.params.seed2;

      var uSeed  = this.uniforms.seed.value;
      var uSeed1 = this.uniforms.seed1.value;
      var uSeed2 = this.uniforms.seed2.value;


      if( this.updateSeed ){
     
        //uSeed.x = ( Math.sin( t * s ) -1.0 ) /2;
        uSeed.x  = seed.x  + v * ( Math.sin( t * s / 12.0 ) - 1.0 ) / 2;
        uSeed.y  = seed.y  + v * ( Math.cos( t * s / 10.0 ) - 1.0 ) / 2;
        uSeed.z  = seed.z  + v * ( Math.cos( t * s / 30.0 ) - 1.0 ) / 2;

        uSeed1.x = seed1.x + v * ( Math.sin( t * s / 12.0 ) - 1.0 ) / 2;
        uSeed1.y = seed1.y + v * ( Math.cos( t * s / 15.0 ) - 1.0 ) / 2;
        uSeed1.z = seed1.z + v * ( Math.cos( t * s / 10.0 ) - 1.0 ) / 2;

        uSeed2.x = seed2.x + v * ( Math.sin( t * s / 12.0 ) - 1.0 ) / 2;
        uSeed2.y = seed2.y + v * ( Math.cos( t * s / 30.0 ) - 1.0 ) / 2;
        uSeed2.z = seed2.z + v * ( Math.cos( t * s / 15.0 ) - 1.0 ) / 2;

      }

    }

    material.updateSeed = function(){

      this.updateSeed = true;

    }

    material.freezeSeed = function(){

      this.freezeSeed = true;

    }
 
    womb.loader.loadBarAdd();

    return material;

  }

  module.exports = FractalCombo;

});
