define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                    );
  
  var FractalBeing        = require( 'Species/Beings/FractalBeing'  );

  var m                   = require( 'Utils/Math'                   );
  var Mesh                = require( 'Components/Mesh'              );
  var Clickable           = require( 'Components/Clickable'         );
  var MeshEmitter         = require( 'Components/MeshEmitter'       );
  var Duplicator          = require( 'Components/Duplicator'        );

  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'Species/PhysicsSimulator'   );
  var FBOParticles        = require( 'Species/FBOParticles'       );
  var physicsShaders      = require( 'Shaders/physicsShaders'     );
  var physicsParticles    = require( 'Shaders/physicsParticles'   );
 

  /*
   
     Create our womb

  */
  var link = 'http://www.youtube.com/watch?v=ZM80F_J-QHE&feature=kp';
  var info =  "Drag to spin, scroll to zoom, click cubes to create. <br/> press 'x' to hide interface";
  
  womb = new Womb({
    title:            'Bjork - Mutual Core',
    link:             link, 
    summary:          info,
    stats: true
  });

  /*
   
     Variables:

  */
  var numOfClickables = 20;
  var round           = 0;  // Which round of filled objects we have done
  var emissionRandomness = .3; // How random the direction is

  var hoverColor = new THREE.Vector3( 1.4 , .9 , .7 );
  var neutralColor = new THREE.Vector3( 1.9 , .4 , .5 );
  var selectedColor = new THREE.Vector3( .9 , 1.1 , .9 );
  var selectedHoverColor = new THREE.Vector3( 1.9 , 1.6 , .9 );

  var file = '/lib/audio/tracks/mutualCore.mp3';

  womb.audio = womb.audioController.createStream( file  );
  //womb.audioController.gain.gain.value = 0;

  /*
  
    SETTING UP OBJECTS!

  */

 
  womb.modelLoader.loadFile( 
    'OBJ' , 
    '/lib/models/leeperrysmith/LeePerrySmith.obj' , 
    //'/lib/models/skull_superlow.obj' , 

    function( object ){

      if( object[0] instanceof THREE.Mesh ){
      }

      if( object[0] instanceof THREE.Geometry ){
        var geo = object[0];
        geo.computeFaceNormals();
        geo.computeVertexNormals();
        //geo.computeBoundingSphere();
        //geo.computeBoundingBox();

        /*for(var i = 0; i < geo.vertices.length; i++ ){
  
          geo.vertices[i].y -= .01;

        }*/
 
        geo.verticesNeedUpdate = true;
        //THREE.GeometryUtils.center(geo);

        
        womb.modelLoader.assignUVs( geo );
        var m = new THREE.Mesh( geo , new THREE.MeshBasicMaterial({
            color:0x000000,
            //wireframe:true
          })
        );
        m.scale.multiplyScalar( 1000 );
        //THREE.GeometryUtils.center( m );

        //womb.scene.add( m );
        var newGeo = new THREE.Geometry();
       
        THREE.GeometryUtils.merge( newGeo , m );

        womb.fboParticles = new FBOParticles({
          audioTexture: womb.audio.texture,
          numberOfParticles:1000000,
          geometry: newGeo
        });

        womb.fboParticles.particles.scale.multiplyScalar( .05 );
        m.scale.multiplyScalar( .05 );

        womb.fboParticles.body.add( m );
              
      }
    }
  
  );

  womb.fractal1 = new FractalBeing( womb, {

    geometry: new THREE.CubeGeometry(
      womb.size/ 40 , 
      womb.size/ 40 , 
      womb.size/ 40 , 
      50 , 
      50 , 
      50 
    ),


    texture:    womb.audio.texture,
    opacity: .1,
    texturePower:0,
    noisePower:0,
 
    influence:40,
   // displacementPower: 0.3,
   // displacementOffset: 15.0,

    additive: true,
    placementSize: womb.size/50,

    numOf: 10,
    color: new THREE.Vector3( 0.4 , 0.0 , 0.0 ),
    influence: 1,

  });

  womb.ps = new PhysicsSimulator( womb , {

    textureWidth: 100,
    debug: false,
    velocityShader:           physicsShaders.velocity.curl,
    positionShader:           physicsShaders.positionAudio_4,
    
    particlesUniforms:        physicsParticles.uniforms.audio,
    particlesVertexShader:    physicsParticles.vertex.audio,
    particlesFragmentShader:  physicsParticles.fragment.audio,
    
    bounds: 400,
    speed: .1,
   
    audio: womb.audio

  });

  womb.fractal1.fractal.material.updateSeed = true;

  var fractalClone = womb.fractal1.fractal.clone();

  womb.fractal2 = womb.creator.createBeing();

  var mesh = new Mesh( womb.fractal2 , {

    geometry: fractalClone.geometry,
    material: fractalClone.material

  });

  var duplicator = new Duplicator( mesh , womb.fractal2 );
  duplicator.addAll();
  duplicator.placeAll();
  duplicator.loopThroughMeshes(function( mesh ){
    mesh.scale.multiplyScalar( .01 );
  });

  womb.u = {

    texture:    { type: "t", value: womb.audio.texture },
    image:      { type: "t", value: womb.audio.texture },
    color:      { type: "v3", value: neutralColor },
    time:       womb.time,
    pow_noise:  { type: "f" , value: 0.2 },
    pow_audio:  { type: "f" , value: .3 },

  };

  var uniforms = THREE.UniformsUtils.merge( [
      THREE.ShaderLib['basic'].uniforms,
      womb.u,
  ]);

  uniforms.texture.value = womb.audio.texture;
  uniforms.time=  womb.time  ;

  var mat = new THREE.ShaderMaterial({

    uniforms: uniforms,
    vertexShader: vertexShaders.passThrough,
    fragmentShader: fragmentShaders.audio.color.uv.absDiamond,
    blending: THREE.AdditiveBlending,
    transparent: true,
    //side: THREE.BackSide,
  });

  var size = womb.size / numOfClickables;
  var geo = new THREE.CubeGeometry( size , size , size );
  var mesh = new THREE.Mesh( geo , mat );

 // womb.scene.add( mesh );

  womb.clickableBeing = womb.creator.createBeing({
    transitionTime: 5
  });
  womb.selectedMeshes = [];
  womb.meshes         = [];
 
  /*
  
     Creating Clickables

  */
  for( var i = 0; i < numOfClickables ; i++ ){


    var mesh = new Mesh( womb.clickableBeing , {

      geometry: geo,
      material: mat.clone()


    });

    mesh.material.uniforms.texture.value  = womb.audio.texture;
    mesh.material.uniforms.time           = womb.time;


    var emitter = new MeshEmitter( mesh , {
      
      startingDirection: function(){

        //console.log( this.emitTowards );
        var direction = this.emitTowards.clone().normalize();

        // Randomizes for complexity
        var ER = emissionRandomness;
        direction.x += Math.randomRange( -ER , ER );
        direction.y += Math.randomRange( -ER , ER );
        direction.z += Math.randomRange( -ER , ER );
        return direction;

      },

      maxMeshes: 1000 / numOfClickables,
      decayRate: .97,
      emissionRate: Math.random() * 500 / numOfClickables

      
    });


    mesh.emitter = emitter;

    Clickable( mesh , {

      onHoverOver: function(){
        
        if( !this.selected )
          this.material.uniforms.color.value = hoverColor;
        else
          this.material.uniforms.color.value = selectedHoverColor;
      },

      onHoverOut: function(){

        if( !this.selected )
          this.material.uniforms.color.value = neutralColor;
        else
          this.material.uniforms.color.value = selectedColor;
        

      },

      onClick: function(){

        if( !this.selected ){
          selectMesh( this ); 
        }else{
          unselectMesh( this ); 
        }

        var l = womb.selectedMeshes.length;

        var uniforms = womb.fractal1.fractal.material.uniforms;
        uniforms.texturePower.value = l * 3 / numOfClickables;
        uniforms.color.value.x = l * 2 / numOfClickables;
        

      }

    });
    
    mesh.add();

    var theta = 2 * Math.PI * Math.random();
    var phi   = 2 * Math.PI * ( Math.random() - .5 );

    mesh.position = Math.toCart( womb.size/2 , theta, phi  );
    Math.setRandomRotation( mesh.rotation );

    womb.meshes.push( mesh );

  }

  
  womb.looper = womb.audioController.createLooper( womb.audio , {
    beatsPerMinute: 150.1 
  });


  womb.loader.loadBarAdd();

  womb.update = function(){

  }

  womb.start = function(){

    womb.fractal1.enter();

    womb.clickableBeing.enter();

    womb.audio.play();

  }

  function randomizeMaterialColors(){


    Math.setRandomVector( hoverColor , 2 , 0 );
    Math.setRandomVector( neutralColor , 2 , 0  );
    Math.setRandomVector( selectedColor , 2 , 0 );
    Math.setRandomVector( selectedHoverColor, 2 , 0  );

  }

  function unselectMesh( mesh ){

    mesh.selected = false;
    mesh.material.uniforms.color.value = hoverColor;
    mesh.emitter.end();

    var l = womb.selectedMeshes.length;
    for( var i = 0; i < womb.selectedMeshes.length; i++ ){

      if( womb.selectedMeshes[i] == mesh ){
        womb.selectedMeshes.splice( i , 1 );
        i --;
        l --;
      }

    }

  }

  function selectMesh( mesh ){

    mesh.selected = true;
    mesh.material.uniforms.color.value = selectedColor;
    mesh.emitter.begin();

    mesh.emitter.emitTowards = mesh.position.clone().multiplyScalar( -1 );

    var s = mesh.emitter.emitTowards.length() / mesh.emitter.lifetime;
    mesh.emitter.startingSpeed = s;
    mesh.emitter.friction = .99;

    mesh.emitter.burst( mesh.emitter.maxMeshes/2 );

    womb.selectedMeshes.push( mesh );

    if( womb.selectedMeshes.length > womb.meshes.length - 1 ){

      allMeshesSelected();

    }


  }

  function unselectAllMeshes(){

    var l = womb.selectedMeshes.length;
          
    for( var i = 0; i < womb.selectedMeshes.length;){

      var mesh = womb.selectedMeshes[i]
      unselectMesh( mesh );
      mesh.material.uniforms.color.value = neutralColor;

      l = womb.selectedMeshes.length;

    }

  }

  function allMeshesSelected(){

    randomizeMaterialColors();
 
    if( round == 0 ){

      unselectAllMeshes();
      
      womb.ps.enter();
      womb.ps.particleSystem.scale.multiplyScalar( .01 );
     
      
      var t = womb.tweener.createTween({
        object:   womb.fractal1.body,
        target:   new THREE.Vector3( .005 , .005 , .005 ),
        type:     'scale',
        time:     5,
        callback: function(){
          
          womb.fractal1.fractal.material.uniforms.texturePower.value = 100;
          womb.fractal1.fractal.material.uniforms.color.value = new THREE.Vector3();
          womb.fractal1.fractal.material.uniforms.opacity.value = .01;
          womb.fractal1.fractal.material.additive = THREE.NormalBlending;
          womb.fractal1.fractal.material.updateSeed = true;
          womb.fractal1.fractal.material.needsUpdate = true;


          unselectAllMeshes();

          womb.fractal1.exit();

        }
      });

      t.start();

    }else if( round == 1 ){

      womb.ps.exit();

      unselectAllMeshes();
      womb.fractal1.enter();
      womb.fractal2.enter();

    }else if( round == 2 ){

      womb.fractal1.exit();
      womb.ps.enter();
      unselectAllMeshes();
      var t = womb.tweener.createTween({

        object: womb.ps.particleSystem,
        target:new THREE.Vector3( .01 , .05 , .001 ),
        type:'scale',
        time: 10,

      });

      t.start();

    }else if( round == 3 ){

      unselectAllMeshes();

      var t = womb.tweener.createTween({

        object: womb.ps.particleSystem,
        target:new THREE.Vector3( .03 , .03 , .03 ),
        type:'scale',
        time: 10,
        callback: function(){

          womb.fractal2.exit();

        }

      });

      t.start();


    }else if( round == 4 ){


      womb.clickableBeing.exit();
      womb.fboParticles.enter();

     /* var t = womb.tweener.createTween({

   
      });

      t.start();*/




    }

    round ++;   
  
  }

});
