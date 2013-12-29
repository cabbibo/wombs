define(function(require, exports, module) {

  var m                   = require( 'app/utils/Math'                 );
  var AudioGeometry       = require( 'app/three/AudioGeometry'        );
  var AnalyzingFunctions  = require( 'app/utils/AnalyzingFunctions'   );

  var Womb                = require( 'app/Womb'                       );

  var recursiveFunctions  = require( 'app/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );
  var shaderChunks        = require( 'app/shaders/shaderChunks'       );

  /*
   
     Create our womb

  */
  var link = 'http://robbietilton.com';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    modelLoader:      true,
    textCreator:      true,
    raycaster:        true,
    title:            'Philip Glass - Knee 1 ( Nosaj Thing Remix )',
    link:             link, 
    summary:          info,
    gui:              true,
    imageLoader:      true,
    stats:            true,
    color:            '#000000',
    size: 400
  });


  womb.positionShader = [

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
  ].join("\n");

  womb.velocityShader = [
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
  "if ( rand( uv + time ) > freedomFactor ) {",

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

  ].join("\n");


  womb.vertexShader = [

  ].join( "\n" );

  womb.fragmentShader = [
  ].join( "\n" );

  var gl = womb.renderer.getContext();

  var tCamera = new THREE.Camera();
  var tScene = new THREE.Scene();
  tCamera.position.z = 1;

  var WIDTH = 2000/2;
  var HEIGHT = WIDTH;
  var PARTICLES = WIDTH * WIDTH;
  var BOUNDS = 400, BOUNDS_HALF = BOUNDS / 2;

  var debug;
  var data, texture;

  console.log('total', PARTICLES);

  var simulator;
  var flipflop = true;
  var rtPosition1, rtPosition2, rtVelocity1, rtVelocity2;
  
  if( !gl.getExtension( "OES_texture_float" )) {
      alert( "No OES_texture_float support for float textures!" );
      return;
  }

  if( gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0) {
      alert( "No support for vertex shader textures!" );
      return;
  }


  var uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2(WIDTH, WIDTH) },
      texture: { type: "t", value: null },
      // Inputs
  };

  var material = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: vertexShaders.passThrough_noMV,
		fragmentShader: fragmentShaders.texture

  });

  var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material );

  tScene.add( mesh );


  var positionShader = new THREE.ShaderMaterial( {

      uniforms: {
          time: { type: "f", value: 1.0 },
          resolution: { type: "v2", value: new THREE.Vector2(WIDTH, WIDTH) },
          texturePosition: { type: "t", value: null },
          textureVelocity: { type: "t", value: null },
      },
      vertexShader: vertexShaders.passThrough_noMV,
      fragmentShader: womb.positionShader


  } );

  var velocityShader = new THREE.ShaderMaterial( {

    uniforms: {
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: new THREE.Vector2(WIDTH, WIDTH) },
        texturePosition: { type: "t", value: null },
        textureVelocity: { type: "t", value: null },
        testing: { type: "f", value: 1.0 },
        seperationDistance: { type: "f", value: 1.0 },
        alignmentDistance: { type: "f", value: 1.0 },
        cohesionDistance: { type: "f", value: 1.0 },
        freedomFactor: { type: "f", value: 1.0 },
    },
    vertexShader: vertexShaders.passThrough_noMV,
    fragmentShader: womb.velocityShader
  } );


  getRenderTarget = function() {
   
    var renderTarget = new THREE.WebGLRenderTarget(WIDTH, WIDTH, {
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        stencilBuffer: false
    });

    return renderTarget;
  }


  var dtPosition = generateDataTexture();
  var dtVelocity = generateVelocityTexture();

  rtPosition1 = getRenderTarget();
  rtPosition2 = rtPosition1.clone();
  rtVelocity1 = rtPosition1.clone();
  rtVelocity2 = rtPosition1.clone();

  renderTexture( dtPosition  , rtPosition1 );
  renderTexture( rtPosition1 , rtPosition2 );

  renderTexture( dtVelocity  , rtVelocity1 );
  renderTexture( rtVelocity1 , rtVelocity2 );
  

  particle_basic = THREE.ShaderLib['particle_basic'] = {
  
    uniforms:  THREE.UniformsUtils.merge( [

      { "lookup": { type: "t", value: null } },
      THREE.UniformsLib[ "particle" ],
      THREE.UniformsLib[ "shadowmap" ],
      { "moocolor": { type: "vec3", value: new THREE.Color( 0xffffff ) } },
    
    ] ),

    vertexShader: [

      "uniform sampler2D lookup;",

      "uniform float size;",
      "uniform float scale;",

      THREE.ShaderChunk[ "color_pars_vertex" ],
      THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

      "void main() {",

        THREE.ShaderChunk[ "color_vertex" ],


        "vec2 lookupuv = position.xy + vec2( 0.5 / 32.0, 0.5 / 32.0 );",
        "vec3 pos = texture2D( lookup, lookupuv ).rgb;",

        // position
        "vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",

        "#ifdef USE_SIZEATTENUATION",
          "gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
        "#else",
          "gl_PointSize = size;",
        "#endif",

        "gl_Position = projectionMatrix * mvPosition;",

        THREE.ShaderChunk[ "worldpos_vertex" ],
        THREE.ShaderChunk[ "shadowmap_vertex" ],

      "}"

    ].join("\n"),

    fragmentShader: [

      "uniform vec3 psColor;",
      "uniform float opacity;",

      THREE.ShaderChunk[ "color_pars_fragment" ],
      THREE.ShaderChunk[ "map_particle_pars_fragment" ],
      THREE.ShaderChunk[ "fog_pars_fragment" ],
      THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

      "void main() {",

        "gl_FragColor = vec4( psColor, opacity );",

        THREE.ShaderChunk[ "map_particle_fragment" ],
        THREE.ShaderChunk[ "alphatest_fragment" ],
        THREE.ShaderChunk[ "color_fragment" ],
        THREE.ShaderChunk[ "shadowmap_fragment" ],
        THREE.ShaderChunk[ "fog_fragment" ],

      "}"

    ].join("\n")

  };
  

  geometry = getBufferParticleGeometry();

  material = new THREE.ParticleBasicMaterial( { size: 30, vertexColors: false,
    // map: firefly,
    map: THREE.ImageUtils.loadTexture( '../lib/img/hnrW.png' ),
    // lensflare2.jpg flare.png spark1.png disc.png circle.png (good for snow / sparks) ball
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false, depthTest: false,
    uniforms: {
        'color': {}
    },
    opacity: 0.8
  } );
  console.log(material);

  particle_basic.uniforms.lookup.value = rtPosition1;

  particles = new THREE.ParticleSystem( geometry, material );
  particles.visible = true;
  womb.scene.add( particles );

  var plane = new THREE.Mesh( 
      new THREE.PlaneGeometry( womb.size , womb.size ) , 
      new THREE.MeshBasicMaterial({
        //map: THREE.ImageUtils.loadTexture( '../lib/img/hnrW.png' ),
        map: rtPosition2,
        color: 0xff0000,
        transparent:true
        
      })
  );
  //womb.scene.add( plane );

  womb.loader.loadBarAdd();

  var timer = 0;
  var paused = false;

  function render() {

    timer += 0.01;

    // simulationShader.uniforms.timer.value = timer;

    var debugTime = false && Math.random() < 0.1;

    debugTime && console.time('simulate');

    if (!paused)
    if (flipflop) {
      renderVelocity(rtPosition1, rtVelocity1, rtVelocity2);
      renderPosition(rtPosition1, rtVelocity2, rtPosition2);

      if (material.uniforms) {
        material.uniforms.lookup.value = rtPosition2;
        //texturePosition.value = rtPosition2;
        //textureVelocity.value = rtVelocity2;
      }
    
    } else {
      renderVelocity(rtPosition2, rtVelocity2, rtVelocity1);
      renderPosition(rtPosition2, rtVelocity1, rtPosition1);
      if (material.uniforms) {
        material.uniforms.lookup.value = rtPosition1;
        //texturePosition.value = rtPosition1;
        //textureVelocity.value = rtVelocity1;
      }
    }

    flipflop = !flipflop;

    debugTime && console.timeEnd('simulate');


    plane.material.needsUpdate = true;

    var time = Date.now() * 0.00005;

    //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    //camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

    //camera.lookAt( scene.position );

    debugTime && console.time('render');

    //womb.renderer.render( womb.scene, womb.camera );

    debugTime && console.timeEnd('render');
    //console.log('DD');

  }
  
  function generateDataTexture() {

    var x, y, z;

    var w = WIDTH, h = WIDTH;

    var a = new Float32Array(PARTICLES * 4);

    for (var k = 0; k < PARTICLES; k++) {

      x = Math.random() * BOUNDS - BOUNDS_HALF;
      y = Math.random() * BOUNDS - BOUNDS_HALF;
      z = Math.random() * BOUNDS - BOUNDS_HALF;

      a[ k*4 + 0 ] = x;
      a[ k*4 + 1 ] = y;
      a[ k*4 + 2 ] = z;
      a[ k*4 + 3 ] = 1;

    }

    var texture = new THREE.DataTexture( 
      a, 
      WIDTH, 
      WIDTH, 
      THREE.RGBAFormat, 
      THREE.FloatType 
    );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    texture.flipY = false;

    console.log(texture);

    return texture;

  }

  function generateVelocityTexture() {

    var x, y, z;

    var w = WIDTH, h = WIDTH;

    var a = new Float32Array(PARTICLES * 4);

    for (var k = 0; k < PARTICLES; k++) {

      x = Math.random() - 0.5;
      y = Math.random() - 0.5;
      z = Math.random() - 0.5;

      a[ k*4 + 0 ] = x * 10;
      a[ k*4 + 1 ] = y * 10;
      a[ k*4 + 2 ] = z * 10;
      a[ k*4 + 3 ] = 1;

    }

    var texture = new THREE.DataTexture( a, WIDTH, WIDTH, THREE.RGBAFormat, THREE.FloatType );
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    texture.flipY = false;
    console.log(texture);

    return texture;

  }

  function getBufferParticleGeometry() {

    var particles = PARTICLES;

    var geometry = new THREE.BufferGeometry();
    geometry.attributes = {

      position: {
          itemSize: 3,
          array: new Float32Array( particles * 3 ),
          numItems: particles * 3
      },
      color: {
          itemSize: 3,
          array: new Float32Array( particles * 3 ),
          numItems: particles * 3
      }

    }

    var positions = geometry.attributes.position.array;
    var colors = geometry.attributes.color.array;

    var color = new THREE.Color();

    var n = 1000, n2 = n / 2; // particles spread in the cube

    for ( var i = 0; i < positions.length; i += 3 ) {
      var j = ~~(i / 3);

      // positions

      var x = ( j % WIDTH ) / WIDTH ;
      var y = Math.floor( j / WIDTH ) / HEIGHT;
      var z = Math.random() * n - n2;

      positions[ i ]     = x;
      positions[ i + 1 ] = y;
      positions[ i + 2 ] = z;
    }

    geometry.computeBoundingSphere();
    return geometry;
  }

  function renderTexture(input, output) {

    console.log( 'ss' );
    uniforms.texture.value = input;
    womb.renderer.render(tScene, tCamera, output);
    this.output = output;
  }

  function renderPosition(position, velocity, output) {
    mesh.material = positionShader;
    positionShader.uniforms.texturePosition.value = position;
    positionShader.uniforms.textureVelocity.value = velocity;
    womb.renderer.render(tScene, tCamera, output);
    this.output = output;
  }

  function renderVelocity(position, velocity, output) {
    mesh.material = velocityShader;
    velocityShader.uniforms.texturePosition.value = position;
    velocityShader.uniforms.textureVelocity.value = velocity;
    velocityShader.uniforms.time.value = performance.now();
    // Date
    womb.renderer.render(tScene, tCamera, output);
    this.output = output;
  }



  function initMain(){

    // SHARED UNIFORM

    var s = womb.size / 5;
    womb.geometry = new THREE.CubeGeometry( s , s , s , 100 , 100  ,100 );
    womb.material = new THREE.MeshNormalMaterial();

    womb.sphereMesh = new THREE.Mesh( 
        womb.geometry ,
        womb.material
    );


    womb.scene.add( womb.sphereMesh );


  }

  womb.update = function(){

    render();
  
  }

  womb.start = function(){

    initMain();

  }

  womb.raycaster.onMeshHoveredOver = function(){

  }

  womb.raycaster.onMeshHoveredOut = function(){

  }

  

});
