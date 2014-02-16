
/*

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




*/




define(function(require, exports, module) {

                    require( 'lib/three.min'          );
  helperFunctions = require( 'Utils/helperFunctions'  );
  SC              = require( 'Shaders/shaderChunks'   );

  shaderCreator = {}


  // TODO: figure out how to push something extra to this array 
  // for exotic uniforms
  shaderCreator.varyingArray = [
    
    // Creating this should take place before shader chunk
    [ "vUv"           , "vec2"  , "uv"                              ],
    [ "vPos_OG"       , "vec3"  , "position"                        ],
    [ "nPos_OG"       , "vec3"  , "normalize( position )"           ],

    // Creating these should take place after shader chunk
    [ "vPos"          , "vec3"  , "pos"                             ],
    [ "nPos"          , "vec3"  , "normalize( pos )"                ],
    [ "vDisplacement" , "float" , "length(pos) - length(position)"  ],
  
  ],

  // TODO: figure out how to push something extra to this array 
  // for exotic uniforms
  shaderCreator.uniformsArray = [

    [ "Texture"               , "sampler2D" ],
    [ "Image"                 , "sampler2D" ],
    [ "Lookup"                , "sampler2D" ],
    [ "LookupVel"             , "sampler2D" ],
    [ "TexturePower"          , "float"     ],
    [ "DisplacementPower"     , "float"     ],
    [ "DisplacementOffset"    , "float"     ],
    [ "Time"                  , "float"     ],
    [ "Color"                 , "vec3"      ],

  ]

  shaderCreator.definesArray = [
    
    [ "snoise" , SC.noise3D ],
    [ "kali"   , SC.createKali ], // TODO: Figure out how to pass this via Fractal  

  ]

  function ShaderCreator = function( parameters ){

    this.params = _.defaults( parameters || {} , {
      vertexChunk: "asd",
      fragmentChunk: "asda",
      uniforms:{
        blaue: { type: "f" , value: "basdddd" },
        blaue: { type: "f" , value: "basdddd" },
        blaue: { type: "f" , value: "basdddd" },
      },
      additive: false,
      transparent: false,
      depthWrite: false,
      fractalPrecision: 15,
    });

    // Arrays of strings which constitute the main 
    // Section of the program
    this.vertexChunk    = params.vertexChunk;
    this.fragmentChunk  = params.fragmentChunk;


    // Creates arrays of uniforms
    this.vertexUniforms       = this.findUniforms( this.vertexChunk );
    this.fragmentUniforms     = this.findUniforms( this.fragmentChunk );

    // Creates the uniforms chunk of the shader programs
    this.vertexUniformChunk   = this.createUniformChunk( this.vertexUniforms );
    this.fragmentUniformChunk = this.createUniformChunk( this.fragmentUniforms );

    // Creates the uniforms you need
    this.uniforms = this.createUniforms( 
      this.vertexUniforms,  
      this.fragmentUniforms 
    );

    // Finds all of the usualVaryings 
    this.fragmentVaryings = this.findVaryings( this.

    this.

  }
  
  ShaderCreator.prototype.alerts = {
    extraUniform: function( uName ){
      console.log( 'You have assigned a non-existant uniform: ' + uName ),
    }
    unassignedUniform:function( uName ){
      console.log( 'You have not assigned:' + uName );
    }
  }

  ShaderC

  ShaderCreator.prototype.findUniforms = function( lineArray ){

    var listOfUniforms = [];

    for( var i = 0; i < lineArray.length; i++ ){

      var l = lineArray[i];

      for( var j = 0; j < uniformArray.length; j++ ){

        var u = uniformArray[j];
        var uniformSplit = l.split( u[0] );

        if( uniformSplit > 0 ){
          listOfUniforms.push( u );

        }

      }

    }

    return listOfUniforms;

  }

  ShaderCreator.prototype.createUniforms( ){

    var uniforms = {}

    for( var i = 0; i< propts; i ++ ){

      var uniform = propts[i];



    }

    return uniforms

  }
  shaderCreator.createShader = function( params ){

    var params = _.defaults( parameters || {} , {
      vertexChunk: "asd",
      fragmentChunk: "asda"
    });

    this.createUniforms( fragmentChunk );


    var uniforms = THREE.UniformUtils.Merge([
      vertexUniforms, 
      fragmentUniforms 
    ]);

    console.log( uniforms );
    
    helperFunctions.setParameters( uniforms , params );

    var vertexVaryings    = this.parse( 'varying' , vertexShader );
    var fragmentVaryings  = this.parse( 'varying' , fragmentShader );

    this.resolveVaryings( vertexVaryings , fragmentVaryings );

    if( params.debug ){

      console.log( uniforms );


    }

  }

  shaderCreator.resolveVaryings = function( vert , frag ){

   // var  vertVaryings = 




  }

  shaderCreator.createUniforms = function( shaderChunk , outputArray ){

    var lineArray = shaderChunk.split("\n");
    var uniforms:[];

    for( var i = 0; i < lineArray.length; i ++ ){
      parseForColor

    }



  }

  shaderCreator.createFBOShader = function( fragmentShader , params ){



    
    helperFunctions.setParameters( uniforms , params );

    return {
      uniforms:             uniforms,
      fragmentShader: fragmentShader,
      vertexShader:     vertexShader
    }

  }


  shaderCreator.parse = function( type , shader ){

  }

  
  // Gives us all the uniforms for a certain shader 
  shaderCreator.parse = function( whichType , shader ){

    var lineArray = shader.split("\n");
    
    var returnObject = {}

    for( var i = 0; i < lineArray.length; i++ ){

      var l = lineArray[i];
      var words = l.split( whichType );

      // We know its a uniform if this is true
      if( words.length == 2 ){

        var l = words[1].split(" ");

        var type = l[1];
        var name = l[2].split(";")[0];

        this.createProperFormat( returnObject , whichType , type , name )
        
      }


    }

    return returnObject;

  }

  // Properly formats uniforms/ varyings to be added to our return object
  shaderCreator.createProperFormat = function( array , uOrV , type , name ){

    if( uOrV == 'uniform' ){
        
        array[name] = {};
       
        if( type == 'float' ){
      
          array[name].type = 'f';
          array[name].value = 0.0;

        }else if( type == 'sampler2D' ){

          array[name].type = 't';
          array[name].value = womb.defaults.texture;

        }else if( type == 'vec4' ){

          array[name].type = 'v4';
          array[name].value = new THREE.Vector3();

        }else if( type == 'vec3' ){

          array[name].type = 'v3';
          array[name].value = new THREE.Vector3();

        }else if( type == 'vec2' ){

          array[name].type = 'v2';
          array[name].value = new THREE.Vector2();

        }else{
  
          console.log( 'UNIFORM TYPE UNDEFINED' );

        }

    }else if( uOrV == 'varying' ){

      array[name] = type;


    }else{
  
      console.log( 'proper type not defined' );
    
    }

  }




  module.exports = shaderCreator;

});
