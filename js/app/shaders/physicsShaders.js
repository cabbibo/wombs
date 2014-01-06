define(function(require, exports, module) {

  var SC = require("app/shaders/shaderChunks");

  var physicsShaders = {

    position:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "// uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",

      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "float mass = texture2D( texturePosition, uv ).w;",
        "gl_FragColor=vec4(position + velocity , 1.0 );",

      "}"

    ].join("\n"),

    positionAudio_1:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "// uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",
      "uniform sampler2D audioTexture;",

      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "float audio = texture2D( audioTexture , vec2( uv.x , 0.0 ) ).w;",
        "gl_FragColor=vec4(position + velocity *  audio  , 1.0 );",

      "}"

    ].join("\n"),
    positionAudio_2:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "// uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",
      "uniform sampler2D audioTexture;",

      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "float audio = texture2D( audioTexture , vec2( uv.x , 0.0 ) ).w;",
        "gl_FragColor=vec4(position + velocity *  audio  * audio  , 1.0 );",

      "}"

    ].join("\n"),

    positionAudio_3:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "// uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",
      "uniform sampler2D audioTexture;",

      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "float audio = texture2D( audioTexture , vec2( uv.x , 0.0 ) ).w;",
        "gl_FragColor=vec4(position + velocity *  audio * audio * audio , 1.0 );",

      "}"

    ].join("\n"),






    positionAudio_4:[

      "uniform vec2 resolution;",
      "uniform float time;",
      "// uniform float delta;",
      "uniform sampler2D textureVelocity;",
      "uniform sampler2D texturePosition;",
      "uniform sampler2D audioTexture;",

      "void main(){",

        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec3 position = texture2D( texturePosition, uv ).xyz;",
        "vec3 velocity = texture2D( textureVelocity, uv ).xyz;",
        "float audio = texture2D( audioTexture , vec2( uv.x , 0.0 ) ).w;",
        "gl_FragColor=vec4(position + velocity *  audio * audio * audio * audio , 1.0 );",

      "}"

    ].join("\n"),




    velocity:{


      simplex: [

        "uniform vec2 resolution;",
        "uniform float time;",






      ].join("\n"),

      gravity: [

        "uniform vec2 resolution;",
        "uniform float time;",

        "uniform float speed;",

        "uniform float gravityStrength;",
        "uniform float dampening;",

        "uniform sampler2D textureVelocity;",
        "uniform sampler2D texturePosition;",

        "uniform vec3 otherParticlePosition;",
        "uniform vec3 otherParticleVelocity;",

        "uniform float upperBounds;",
        "uniform float lowerBounds;",


        "void main(){",

          "vec2 uv = gl_FragCoord.xy / resolution.xy;",

          "vec3 selfPosition  = texture2D( texturePosition , uv ).xyz;",
          "vec3 selfVelocity  = texture2D( textureVelocity , uv ).xyz;",
          "float mass         = texture2D( textureVelocity , uv ).w;", 
          "vec3 selfNorm      = normalize( selfVelocity );",

          "vec3 velocity      = selfVelocity;",


          SC.createPhysicsTextureLoop([ 
            "vec3 diff = pPos - selfPosition;",
            "float l = length( diff );",
            "velocity += pMass * mass * mass * diff / ( gravityStrength * l);"
          ].join("\n")),




          "velocity *= speed;",
          "velocity *= dampening;",
          "gl_FragColor=vec4( velocity * mass, 1.0 );",
          //"if(", 

        "}"


      ].join("\n"),

      flocking:[
        
        "uniform vec2 resolution;",
        "uniform float time;",
        "uniform float testing;",
        "// uniform float delta;",
        "uniform float seperationDistance;", // 10
        "uniform float alignmentDistance;", // 40
        "uniform float cohesionDistance;", // 200
        "uniform float freedomFactor;",

        "uniform float speed;",
        "uniform float size;",

        "uniform sampler2D textureVelocity;",
        "uniform sampler2D texturePosition;",

        "const float PI = 3.141592653589793;",
        "const float PI_2 = 3.141592653589793 * 2.0;",
        "const float VISION = PI * 0.55;",

       
        "uniform float upperBounds;",
        "uniform float lowerBounds;",

        SC.bound,

        "float rand(vec2 co){",
          "return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
        "}",

        "void main(){",

          "vec2 uv = gl_FragCoord.xy / resolution.xy;",

          // int x, y;
          "vec3 birdPosition, birdVelocity;",

          "vec3 selfPosition = texture2D( texturePosition, uv ).xyz;",
          "vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;",

          "float dist;",
          "vec3 diff;",

          "vec3 velocity = selfVelocity;",
          "vec3 cohesion = vec3(0.0);",
          "vec3 alignment = vec3(0.0);",

          

          "float cohensionCount = 0.0;",
          "float alignmentCount = 0.0;",
          "if ( rand( uv + time * 0.00005 ) > freedomFactor ) {",

            "for (float y=0.0; y < textureWidth;y++) {",
              "for (float x=0.0; x < textureWidth;x++) {",

                 "if ( x == gl_FragCoord.x && y == gl_FragCoord.y ) continue;",


                "birdPosition = texture2D( texturePosition,",
                  "vec2(x/resolution.x, y/resolution.y) ).xyz;",

                "birdVelocity = texture2D( textureVelocity,",
                  "vec2(x/resolution.x, y/resolution.y) ).xyz;",

                "diff = birdPosition - selfPosition;",
                "dist = length(diff);",

                "if (dist > 0.0 && dist < seperationDistance) {",
                  "velocity -= diff / dist;",
                  "velocity /= 2.0;",
                "}",

                "if (dist < alignmentDistance) {",
                  "alignment += birdVelocity;",
                  "alignmentCount ++;",
                "}",

                "if (dist < cohesionDistance) {",
                  "cohesion += birdPosition;",
                  "cohensionCount ++;",
                "}",
              "}",
            "}",

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


          "velocity *= speed;",
          //"velocity = bindPosition( vec2( LOWER_BOUNDS , UPPER_BOUNDS ) , selfPosition.xyz , velocity );",

          "if ((selfPosition.x + velocity.x * 5.0) < lowerBounds) velocity.x = -velocity.x;",
          "if ((selfPosition.y + velocity.y * 5.0) < lowerBounds) velocity.y = -velocity.y;",

          "if ((selfPosition.z + velocity.z * 5.0) < lowerBounds) velocity.z = -velocity.z;",


          "if ((selfPosition.x + velocity.x * 5.0) > upperBounds) velocity.x = -velocity.x;",

          "if ((selfPosition.y + velocity.y * 5.0) > upperBounds) velocity.y = -velocity.y;",

          "if ((selfPosition.z + velocity.z * 5.0) > upperBounds) velocity.z = -velocity.z;",


          "gl_FragColor=vec4(velocity, 1.0);",


        "}"

      ].join("\n")


    }

  }

  module.exports = physicsShaders;

});
