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
        "gl_FragColor=vec4(position + velocity * 2.0, 1.0);",

      "}"

    ].join("\n"),


    velocity:{


      flocking:[
        
        "uniform vec2 resolution;",
        "uniform float time;",
        "uniform float testing;",
        "// uniform float delta;",
        "uniform float seperationDistance;", // 10
        "uniform float alignmentDistance;", // 40
        "uniform float cohesionDistance;", // 200
        "uniform float freedomFactor;",


        "uniform sampler2D textureVelocity;",
        "uniform sampler2D texturePosition;",

        "const float width = 64.0/2.0;",
        "const float height = 64.0/2.0;",

        "const float PI = 3.141592653589793;",
        "const float PI_2 = 3.141592653589793 * 2.0;",
        "const float VISION = PI * 0.55;",

        "const float UPPER_BOUNDS = 200.0;",
        "const float LOWER_BOUNDS = -UPPER_BOUNDS;",

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

            "for (float y=0.0;y<height;y++) {",
              "for (float x=0.0;x<width;x++) {",

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

          "if ((selfPosition.x + velocity.x * 5.0) < LOWER_BOUNDS) velocity.x = -velocity.x;",
          "if ((selfPosition.y + velocity.y * 5.0) < LOWER_BOUNDS) velocity.y = -velocity.y;",

          "if ((selfPosition.z + velocity.z * 5.0) < LOWER_BOUNDS) velocity.z = -velocity.z;",


          "if ((selfPosition.x + velocity.x * 5.0) > UPPER_BOUNDS) velocity.x = -velocity.x;",

          "if ((selfPosition.y + velocity.y * 5.0) > UPPER_BOUNDS) velocity.y = -velocity.y;",

          "if ((selfPosition.z + velocity.z * 5.0) > UPPER_BOUNDS) velocity.z = -velocity.z;",


          "gl_FragColor=vec4(velocity, 1.0);",


        "}"

      ].join("\n")


    }

  }

  module.exports = physicsShaders;

});
