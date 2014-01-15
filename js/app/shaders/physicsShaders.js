define(function(require, exports, module) {

  var SC = require("app/shaders/shaderChunks");

  var physicsShaders = {

    position:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "uniform float speed;",
      "uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",

      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "float mass = texture2D( texturePosition, uv ).w;",
        "gl_FragColor=vec4(position + velocity * speed * delta, mass );",

      "}"

    ].join("\n"),

    positionAudio_1:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "uniform float speed;",
      "uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",
      "uniform sampler2D audioTexture;",

      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "float audio = texture2D( audioTexture , vec2( uv.x , 0.0 ) ).w;",
        "gl_FragColor=vec4(position + velocity *  audio  * speed * delta , 1.0 );",

      "}"

    ].join("\n"),
    positionAudio_2:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "uniform float speed;",
      "uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",
      "uniform sampler2D audioTexture;",

      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "float audio = texture2D( audioTexture , vec2( uv.x , 0.0 ) ).w;",
        "gl_FragColor=vec4(position + velocity *  audio  * audio  * speed * delta, 1.0 );",

      "}"

    ].join("\n"),

    positionAudio_3:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "uniform float speed;",
      "uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",
      "uniform sampler2D audioTexture;",

      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "float audio = texture2D( audioTexture , vec2( uv.x , 0.0 ) ).w;",
        "gl_FragColor=vec4(position + velocity *  audio * audio * audio * speed* delta, 1.0 );",

      "}"

    ].join("\n"),






    positionAudio_4:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "uniform float speed;",
      "uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",
      "uniform sampler2D audioTexture;",

      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "float audio = texture2D( audioTexture , vec2( uv.x , 0.0 ) ).w;",
        "gl_FragColor=vec4(position + velocity *  audio * audio * audio * audio  * speed * delta, 1.0 );",

      "}"

    ].join("\n"),

    positionAudio_TEST:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "uniform float speed;",
      "uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",
      "uniform sampler2D audioTexture;",

      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "float audio = texture2D( audioTexture , vec2( uv.x , 0.0 ) ).w;",
        "gl_FragColor=vec4( audio * 50.0 , 0.0  , 0.0, 1.0 );",

      "}"

    ].join("\n"),

     positionSimplex:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "uniform float speed;",
      "uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",
      "uniform sampler2D audioTexture;",

      SC.noise4D,
      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "position += velocity * normalize(position) *  snoise( vec4( normalize( position) , time / 1.0 ) );",
        "gl_FragColor=vec4(position  , 1.0 );",

      "}"

    ].join("\n"),







    velocity:{


      rezaCurl:[




      ].join("\n"),


      curl:[

      SC.physicsUniforms,
      SC.physicsUniforms_bounds,
      "uniform float noiseSize;",
      "uniform float potentialPower;",
      SC.bindUsingVelocity,

      SC.curlNoise,

      "void main(){",


        SC.assignUV,

          "vec3 selfPosition  = texture2D( texturePosition , uv ).xyz;",
          "vec3 selfVelocity  = texture2D( textureVelocity , uv ).xyz;",

          "vec3 potential = curlNoise( selfPosition * noiseSize );",

          //"vec

          "gl_FragColor=vec4( selfVelocity + potential * potentialPower , 1.0  );",



      "}"



      ].join("\n"),

      simplex: [

        SC.physicsUniforms,

        //SC.noise3D,
        SC.noise3D,

        "void main(){",

          SC.assignUV,
          "vec3 selfPosition  = texture2D( texturePosition , uv ).xyz;",
          "vec3 selfVelocity  = texture2D( textureVelocity , uv ).xyz;",
          "float mass         = texture2D( textureVelocity , uv ).w;", 

          "float noise = snoise( normalize( selfPosition )  );",
          "selfVelocity +=  selfVelocity * noise;",

          "gl_FragColor=vec4( selfVelocity * mass, mass );",


        "}"
      ].join("\n"),

      gravity: [


        SC.physicsUniforms,

        "uniform float gravityStrength;",
        "uniform float dampening;",

        SC.physicsUniforms_bounds, 


        "void main(){",

          SC.assignUV,

          "vec3 selfPosition  = texture2D( texturePosition , uv ).xyz;",
          "vec3 selfVelocity  = texture2D( textureVelocity , uv ).xyz;",
          "float mass         = texture2D( textureVelocity , uv ).w;", 
          "vec3 selfNorm      = normalize( selfVelocity );",

          "vec3 velocity      = selfVelocity;",


          SC.createPhysicsTextureLoop(
            "vec3 diff = pPos - selfPosition;",
            "float l = length( diff );",
            "velocity += pMass * diff / ( gravityStrength * l * l * l );"
          ),




          "velocity *= dampening;",
          "gl_FragColor=vec4( velocity * mass, mass );",
          //"if(", 

        "}"


      ].join("\n"),

      flocking:[
       
        SC.physicsUniforms,
        SC.physicsUniforms_bounds,
        
        "uniform float testing;",
        "uniform float seperationDistance;", // 10
        "uniform float alignmentDistance;", // 40
        "uniform float cohesionDistance;", // 200
        "uniform float freedomFactor;",

        "uniform float size;",

        SC.PI,
        SC.PI_2,
        "const float VISION = PI * 0.55;",

        SC.rand2D,
        SC.bindUsingVelocity,

        "void main(){",

          SC.assignUV,

          // int x, y;
          "vec3 birdPosition, birdVelocity;",

          "vec3 selfPosition = texture2D( texturePosition, uv ).xyz;",
          "vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;",

          "float mass =  texture2D( texturePosition, uv ).w;",

          "float dist;",
          "vec3 diff;",

          "vec3 velocity = selfVelocity;",
          "vec3 cohesion = vec3(0.0);",
          "vec3 alignment = vec3(0.0);",

          

          "float cohensionCount = 0.0;",
          "float alignmentCount = 0.0;",
          "if ( rand( uv + time * 0.00005 ) > freedomFactor ) {",

            SC.createPhysicsTextureLoop(
              "diff = pPos - selfPosition;",
              "dist = length(diff);",

              "if (dist > 0.0 && dist < seperationDistance) {",
                "velocity -= diff / dist;",
                "velocity /= 2.0;",
              "}",

              "if (dist < alignmentDistance) {",
                "alignment += pVel;",
                "alignmentCount ++;",
              "}",

              "if (dist < cohesionDistance) {",
                "cohesion += pPos;",
                "cohensionCount ++;",
              "}"
            ),
          
            "if (alignmentCount > 0.0) {",
              "alignment /= alignmentCount;",
              "dist = length(alignment);",
              "velocity += alignment/dist;",
              "velocity /= 2.0;",
            "}",

            "if (cohensionCount > 0.0) {",
              "cohesion /= cohensionCount;",
              "diff = cohesion - selfPosition;",
              "dist = length(diff);",
              "if (dist > 0.0)",
              "velocity = diff / dist / 10.0 * 0.5 + velocity * 0.5;",
            "}",

              // velocity.y -= 0.01;

          "}",


          "velocity = bindUsingVelocity( vec2( lowerBounds , upperBounds ) , selfPosition.xyz , velocity );",

          //"gl_FragColor = vec4( mass , mass , mass , 1.0 );",
          
          "gl_FragColor = vec4( velocity  , mass);",


        "}"

      ].join("\n")


    }

  }

  module.exports = physicsShaders;

});
