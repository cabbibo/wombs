
/*
 

  TODO:
  
  - make sure that params are passed through propely
  - create a 'debug' bool which will tell you about all the different parts of the shader ( simple console log is good enough for now )
  - Make it so that somehow, and thing defined in fragment shader that has a 
    camel case vLetter will be created as a varying
  - make fog a parameter
  - if I use a define to pass in something with the name, it will not parse the define ie:
      cartPos = cart( pos ); will see only the first cart...

  Parts of a Vert Shader:

    - definitions
      - uniforms
      - varyings
      - functions

    - main
      
      - pass through unAltered Varyings

      **** THIS IS THE ONLY PART WE WANT TO DEAL WITH! ****
      - do alterations on position
      
      - pass through any  Altered Varyings 
      - modelView transformation


  Parts of a FragShader

    - definitions
      - uniforms
      - varyings
      - functions

    - main

      **** THIS IS THE ONLY PART WE WANT TO DEAL WITH! ****
      - do alterations on color


      - pass Through to Frag Color
    


      
  *** THOUGHT SPACE ***

  // Things to add for sure:
    - vec3 pos = position;
    - modelView

    - pre modelview
    - post modelview


  // Need default responses for every posible varying!
  

  List of possible varyings
  
  vPos ( vec3 or vec4 )
  vPos altered
  displacement
  vUv
  lookupUV


  List of Possible Uniforms

  Texture
  Image
  Lookup
  LookupVel
  Color
  THREE.ShaderChunk[ "fog_pars_fragment" ],
  Time
  TexturePower
  NoisePower
  DisplacementPower
  DisplacementOffset
  Opacity
  NoiseSize


  List of Possible extra needed functions
  snoise
  kali

   //VERTEX SHADER 

      - uniformChunk
      - defineChunk

      - main begin
        - pre manipulation varying defines

        - MANIPULATION

        - post manipulation varying defines
        
        - modelView

        - post modelView varying defines

      - main end
  



*/




define(function(require, exports, module) {

                    require( 'lib/three.min'          );
  helperFunctions = require( 'Utils/helperFunctions'  );
  SC              = require( 'Shaders/shaderChunks'   );

  shaderCreator = {}

  var threeUniformTypes = [
    [ "vec3"      , "v3" , new THREE.Vector3()    ],
    [ "vec2"      , "v2" , new THREE.Vector2()    ],
    [ "float"     , "f"  , 0.0                    ],
    [ "sampler2D" , "t"  , new THREE.Texture()    ],
  ];

  // TODO: figure out how to push something extra to this array 
  // for exotic uniforms
  var varyingArray = [

    // Creating this should take place before shader chunk
    [ "vUv"           , "vec2"  , "uv"                              , "pre"   ],
    [ "vPos_OG"       , "vec3"  , "position"                        , "pre"   ],
    [ "nPos_OG"       , "vec3"  , "normalize( position )"           , "pre"   ],

    // Creating these should take place after shader chunk
    [ "vPos"          , "vec3"  , "pos"                             , "post"  ],
    [ "nPos"          , "vec3"  , "normalize( pos )"                , "post"  ],
    [ "vDisplacement" , "float" , "length(pos) - length(position)"  , "post"  ],

    // Creating this should take place AFTER the model view transformation
    [ "vPos_MV"       , "vec3"  , "gl_Position.xyz"                 , "mv"    ],
  
  ];

  // TODO: figure out how to push something extra to this array 
  // for exotic uniforms
  var uniformArray = [

    [ "Texture"               , "sampler2D" ],
    [ "Image"                 , "sampler2D" ],
    [ "Map"                   , "sampler2D" ],
    [ "Lookup"                , "sampler2D" ],
    [ "LookupVel"             , "sampler2D" ],
    [ "AudioTexture"          , "sampler2D" ],
    [ "TexturePower"          , "float"     ],
    [ "DisplacementPower"     , "float"     ],
    [ "DisplacementOffset"    , "float"     ],
    [ "Time"                  , "float"     ],
    [ "NoiseSize"             , "float"     ],
    [ "NoisePower"            , "float"     ],
    [ "AudioPower"            , "float"     ],
    [ "Color"                 , "vec3"      ],

  ];

  var attributeArray = [

    [ "aColor" , "vec3" ],
    [ "aSize" , "float" ],
    
  ]

  var defineArray = [
    
    [ "snoise3" , SC.noise3D            ],
    [ "kali"    , SC.createKali( 15 )   ], // TODO: Figure out how to pass this via Fractal  
    [ "kali2"   , SC.createKali2( 15 )  ], // TODO: Figure out how to pass this via Fractal  
    [ "kali3"   , SC.createKali3( 15 )  ], // TODO: Figure out how to pass this via Fractal  
    [ "polar"   , SC.polar              ], 
    [ "cart"    , SC.cart               ], 

  ]

  function ShaderCreator( parameters ){

    this.params = _.defaults( parameters || {} , {
    
      vertexChunk:              [],
      vertexPreManipulation:    [],
      vertexPostManipulation:   [],
      vertexPostModelView:      [],

      fragmentChunk:            ["color = nPos;"],
      fragmentPreManipulation:  [],
      fragmentPostManipulation: [],
      fragmentPostModelView:    [],
      
      uniforms:{
        blaue: { type: "f" , value: "basdddd" },
        blaue: { type: "f" , value: "basdddd" },
        blaue: { type: "f" , value: "basdddd" },
      },
    
     // attributes:

      // Properties of the actual material
      blending:     THREE.AdditiveBlending,
      transparent:  false,
      depthWrite:   true,

      fractalPrecision: 15,

    });

    // Arrays of strings which constitute the main 
    // Section of the program
    this.vertexChunk    = this.params.vertexChunk;
    this.fragmentChunk  = this.params.fragmentChunk;

    /* console.log( this.vertexChunk );
    console.log( this.fragmentChunk ); */

    // Creates arrays of uniforms
    this.vertexUniforms   = this.findFromArray( this.vertexChunk   , uniformArray );
    this.fragmentUniforms = this.findFromArray( this.fragmentChunk , uniformArray );


    // Creates the uniforms chunk of the shader programs
    this.vertexUniformChunk   = this.createUniformChunk( this.vertexUniforms );
    this.fragmentUniformChunk = this.createUniformChunk( this.fragmentUniforms );

    /* console.log( this.vertexUniformChunk );
    console.log( this.fragmentUniformChunk ); */

    // Creates the uniforms you need
    this.uniforms = this.createUniforms( 
      this.vertexUniforms,  
      this.fragmentUniforms 
    );


    // Lets us pass in any uniforms that we want to define
    helperFunctions.setParameters( this.uniforms , this.params.uniforms );

    
    /*this.attributeArray = this.findFromArray( this.vertexChunk , attributeArray );
    console.log( this.attributeArray );
    this.attributes = this.createAttributes( this.attributeArray );*/

    // Finds all of the usualVaryings
    this.varyings = this.findFromArray( this.fragmentChunk , varyingArray );

    this.varyingChunk = this.createVaryingChunk( this.varyings );

    /*console.log( this.varyings );
    console.log( 'VARYING CHUNK' );
    console.log( this.varyingChunk );*/

    this.vertexDefines    = this.findFromArray( this.vertexChunk    , defineArray );
    this.fragmentDefines  = this.findFromArray( this.fragmentChunk  , defineArray );
    

    /* console.log( this.vertexDefines );
    console.log( this.fragmentDefines ); */

    this.vertexDefineChunk    = this.createDefineChunk( this.vertexDefines    );
    this.fragmentDefineChunk  = this.createDefineChunk( this.fragmentDefines  );

    /*console.log( 'DEFINE CHUNK' );
    console.log( this.vertexDefineChunk );
    console.log( this.fragmentDefineChunk );*/

  
    this.vertexMainChunk = this.createVertexMainChunk({
     
      preManipulation:  this.params.vertexPreManipulation,
      manipulation:     this.params.vertexChunk,
      postManipulation: this.params.vertexPostManipulation,
      postModelView:    this.params.vertexPostModelView,

      varyingsToDefine: this.varyings

    });


    this.fragmentMainChunk = this.createFragmentMainChunk({
      manipulation:     this.params.fragmentChunk
    });


    this.vertexShader = this.createShaderString({

      uniformChunk:   this.vertexUniformChunk,
     // attributeChunk: this.attributeChunk,
      varyingChunk:   this.varyingChunk,
      defineChunk:    this.vertexDefineChunk,
      mainChunk:      this.vertexMainChunk

    });

    this.fragmentShader = this.createShaderString({

      uniformChunk: this.fragmentUniformChunk,
      varyingChunk: this.varyingChunk,
      defineChunk:  this.fragmentDefineChunk,
      mainChunk:    this.fragmentMainChunk

    });


    this.material = new THREE.ShaderMaterial({

      uniforms:       this.uniforms,
      //attributes:     this.attributes,

      vertexShader:   this.vertexShader,
      fragmentShader: this.fragmentShader,

      blending:       this.params.blending,
      transparent:    this.params.transparent,
      depthWrite:     this.params.depthWrite,

    });

  }
  
  ShaderCreator.prototype.alerts = {
    extraUniform: function( uName ){
      console.log( 'You have assigned a non-existant uniform: ' + uName );
    },
    unassignedUniform:function( uName ){
      console.log( 'You have not assigned:' + uName );
    }
  }

  /*

    Finds a list of all the uniforms / varyings that a shader requires
    by looping through every line that makes up that shader
    and than if there is the neccesary string in that line,
    pushing the type of varying / uniform to a return array

  */
  ShaderCreator.prototype.findFromArray = function( lineArray , searchArray ){

    var returnArray = [];

    for( var i = 0; i < lineArray.length; i++ ){

      var l = lineArray[i];

      for( var j = 0; j < searchArray.length; j++ ){

        var searchItem = searchArray[j];
        var searchSplit = l.split( searchItem[0] );

        if( searchSplit.length > 1 ){

          // TODO:
          // Make sure that this doesn't pick up extra Uniforms!
          // AKA TexturePower triggers both Texture and TexturePower

          if( this.checkTrailingCharacter( searchSplit ) ){
           
            // makes sure we don't pick up multipl of the same thing

            var duplicated = false;
            for( var k = 0; k < returnArray.length; k++ ){
              if( returnArray[k] == searchItem ){
                duplicated = true;
              }
            }

            if( !duplicated )
              returnArray.push( searchItem );

          }

        }

      }

    }

    return returnArray;

  }

  // Creates a uniformChunk string out of an array
  ShaderCreator.prototype.createUniformChunk = function( uniformArray ){

    var uniformString = [];

    for( var i = 0; i < uniformArray.length; i++ ){

      var u = uniformArray[i];

      var uString = "uniform " + u[1] + " " + u[0] + ";"
      uniformString.push( uString );

    }

    return uniformString.join("\n");

  }

  ShaderCreator.prototype.createVaryingChunk = function( varyingArray ){

    var varyingString = [];

    for( var i = 0; i < varyingArray.length; i ++ ){

      var v = varyingArray[i];
      var vString = "varying " + v[1] + " " + v[0] + ";"

      varyingString.push( vString );

    }

    return varyingString.join("\n");

  }

  // creates a defineChunk 
  ShaderCreator.prototype.createDefineChunk = function( defineArray ){

    var defineString = [];

    for( var i = 0; i < defineArray.length; i++ ){

      defineString.push( defineArray[i][1] );

    }

    return defineString.join("\n");

  }

  /*

    Loops through both the fragment and vertex uniforms
    to create uniforms which are the combinations of the two,
    with no duplication, and in a form that three.js takes

  */
  ShaderCreator.prototype.createUniforms = function(){

    var uniforms = {}

    for( var i = 0; i< arguments.length; i ++ ){

      var uniformArray = arguments[i];

      for( var j = 0; j < uniformArray.length; j++ ){

        var u = uniformArray[j];

        if( !uniforms[u[0]] ){
          
          // Gets the proper type for three.js uniforms
          var threeU;
          for( var k = 0; k < threeUniformTypes.length; k++ ){
            if( u[1] == threeUniformTypes[k][0] ){
              threeU = threeUniformTypes[k];
            }
          }

          // Using our precreated uniform tpyes to instantiate
          // a uniform. what will always give us something
          uniforms[u[0]] ={
            type:   threeU[1],
            value:  threeU[2]
          }

          //console.log( uniforms[u[0]] );

        }

      }

    }

    return uniforms

  }

  ShaderCreator.prototype.createAttributes = function(){

    var uniforms = {}

    for( var i = 0; i< arguments.length; i ++ ){

      var uniformArray = arguments[i];

      for( var j = 0; j < uniformArray.length; j++ ){

        var u = uniformArray[j];

        if( !uniforms[u[0]] ){
          
          // Gets the proper type for three.js uniforms
          var threeU;
          for( var k = 0; k < threeUniformTypes.length; k++ ){
            if( u[1] == threeUniformTypes[k][0] ){
              threeU = threeUniformTypes[k];
            }
          }

          // Using our precreated uniform tpyes to instantiate
          // a uniform. what will always give us something
          uniforms[u[0]] ={
            type:   threeU[1],
            value:  threeU[2]
          }

          //console.log( uniforms[u[0]] );

        }

      }

    }

    return uniforms

  }





  // Pulls everything together!
  ShaderCreator.prototype.createVertexMainChunk = function( p ){

    // Important ONLY for the vertex shader
    if( p.varyingsToDefine ){
    
      // first we need to figure out which varyings
      // are undefined
      var undefinedVaryings = [];

      for( var i = 0; i < p.varyingsToDefine.length; i ++ ){

        var defined = false;
        var varyingToDefine = p.varyingsToDefine[i];

        // TODO: 
        // If multiple of these return true, alert user
        // because it will help for telling if there are multiple places
        // a varying is defined!
        if( this.checkArrayForString( p.preManipulation   , varyingToDefine[0] ) )
            defined = true;
        if( this.checkArrayForString( p.manipulation      , varyingToDefine[0] ) )
            defined = true;
        if( this.checkArrayForString( p.postManipulation  , varyingToDefine[0] ) )
            defined = true;
        if( this.checkArrayForString( p.postModelView     , varyingToDefine[0] ) )
            defined = true;
     
        if( !defined ){
          undefinedVaryings.push( varyingToDefine );
        }

      }

      for( var i = 0; i < undefinedVaryings.length; i++ ){

        var v = undefinedVaryings[i];

        var vString = v[0] + " = " + v[2] + ";";

        if( v[3] == 'pre' )
          p.preManipulation.push( vString );
        if( v[3] == 'post' )
          p.postManipulation.push( vString );
        if( v[3] == 'mv' )
          p.postModelView.push( vString );

      }

    }


    var mainArray = [];

    mainArray.push( "vec3 pos = position;"        );
    mainArray.push("");
    mainArray.push( p.preManipulation.join("\n")  );
    mainArray.push("");
    mainArray.push( p.manipulation.join("\n")     );
    mainArray.push("");
    mainArray.push( p.postManipulation.join("\n") );
    mainArray.push("");
    mainArray.push( SC.modelView                  );
    mainArray.push("");
    mainArray.push( p.postModelView.join("\n")    );


    return mainArray.join("\n");

  }

  ShaderCreator.prototype.createFragmentMainChunk = function( p ){


    var mainArray = [];
    mainArray.push( "vec3 color = vec3( 1.0 , 1.0 , 1.0 );"     );
    mainArray.push( "float opacity = 1.0;"                      );
    mainArray.push("");
    mainArray.push( p.manipulation.join("\n")                   );
    mainArray.push("");
    mainArray.push( "gl_FragColor = vec4( color , opacity );"   );

    return mainArray.join("\n");

  }

  ShaderCreator.prototype.createShaderString = function( p ){

    var mainArray = [];

    mainArray.push( p.uniformChunk );
    mainArray.push("");
    mainArray.push( p.varyingChunk );
    //mainArray.push( p.attributeChunk );
    mainArray.push("");
    mainArray.push( p.defineChunk );
    mainArray.push("");
    mainArray.push("");
    mainArray.push("void main(){" );
    mainArray.push("");
    mainArray.push( p.mainChunk );
    mainArray.push("");
    mainArray.push("}");

    return mainArray.join("\n");

  }


  ShaderCreator.prototype.checkArrayForString = function( arrayToCheck , string ){

    // TODO: 
    // Figure out an elegant way to return an array
    // so if it is defined multiple times, we know!
    for( var i = 0; i < arrayToCheck.length; i++ ){

      var l = arrayToCheck[i];
      var array = l.split( string );
      if( array.length > 1 ){
        if( this.checkTrailingCharacter( array ) ){
          return true;
        }

      }

    }

    return false;

  }

  // Makes sure a string division is actually that string
  // and not just a subsection of another string
  ShaderCreator.prototype.checkTrailingCharacter = function( stringArray ){


    var before  = stringArray[0];
    var after   = stringArray[1];

    afterArray  = after.split("");

    afterCharacter = afterArray[0];
    ac = afterCharacter;

    if(
      ac == ";" ||
      ac == " " || 
      ac == ")" || 
      ac == "(" || 
      ac == "." || 
      ac == "+" || 
      ac == "*" || 
      ac == "/" || 
      ac == "," 
    ){

      //console.log( 'Safe Trailing Character' );
      return true;
        
    }else{

      //console.log( 'Part of a larger Word' );
      return false;
  
    }


  }


  module.exports = ShaderCreator;

});
