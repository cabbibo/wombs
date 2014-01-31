define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                      );
  
  var fragmentShaders     = require( 'Shaders/fragmentShaders'        );
  var vertexShaders       = require( 'Shaders/vertexShaders'          );
  var physicsShaders      = require( 'Shaders/physicsShaders'         );
  var shaderChunks        = require( 'Shaders/shaderChunks'           );

  var physicsShaders      = require( 'Shaders/physicsShaders'         );
  var physicsParticles    = require( 'Shaders/physicsParticles'       );

  var PhysicsSimulator    = require( 'Species/PhysicsSimulator'       );


  /*
   
     Create our womb

  */
  var link = 'http://threejs.org/examples/#webgl_gpgpu_birds';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    title:            'Bounded GPU Flocking',
    link:             link, 
    summary:          info,
    stats:            true,
    color:            '#000000',
    failureVideo:84019684,
    size: 400
  });


  womb.ps = new PhysicsSimulator( womb , {

    textureWidth: 50,
    debug: true,
    velocityShader: physicsShaders.velocity.flocking,
    positionShader: physicsShaders.position,
    particles:      physicsParticles.basic,
    bounds: 100,
    speed: 55,
    particleParams:   {
        size: 30,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        fog: true, 
        map: THREE.ImageUtils.loadTexture( '/lib/img/particles/lensFlare.png' ),
        opacity:    1.0,
        color: new THREE.Color(.0, .0 ,1.0 )
      }
   
  });

  womb.loader.loadBarAdd();

  womb.start = function(){

    womb.ps.enter();
  
  }
  

});
