define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                    );
  
  var FractalBeing        = require( 'Species/Beings/FractalBeing'  );

  var m                   = require( 'Utils/Math'                   );
  var Mesh                = require( 'Components/Mesh'              );
  var Clickable           = require( 'Components/Clickable'         );
  var MeshEmitter         = require( 'Components/MeshEmitter'       );
  var Duplicator          = require( 'Components/Duplicator'        );

  var vertexShaders       = require( 'Shaders/vertexShaders'        );
  var fragmentShaders     = require( 'Shaders/fragmentShaders'      );
  
  /*
   
     Create our womb

  */
  var link = 'https://soundcloud.com/cashmerecat/';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    title:            'Wedding Bells - Cashmere Cat',
    link:             link, 
    summary:          info,
    stats: true
  });


  var file = '/lib/audio/tracks/mutualCore.mp3';

  womb.audio = womb.audioController.createStream( file  );
  //womb.audioController.gain.gain.value = 0;

  console.log( womb.audio );

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

  



  womb.fractal1.fractal.material.updateSeed();

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



  var hoverColor = new THREE.Vector3( 1.4 , .9 , .7 );
  var neutralColor = new THREE.Vector3( .3 , .4 , .5 );
  var selectedColor = new THREE.Vector3( .9 , 1.1 , .9 );
  var selectedHoverColor = new THREE.Vector3( 1.9 , .6 , .4 );

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

  var size = womb.size / 50;
  var geo = new THREE.CubeGeometry( size , size , size );
  var mesh = new THREE.Mesh( geo , mat );

 // womb.scene.add( mesh );

  womb.clickableBeing = womb.creator.createBeing();
  womb.selectedMeshes = [];
  womb.meshes         = [];
 
  for( var i = 0; i < 50; i++ ){


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
        direction.x += Math.randomRange( -.1 , .1 );
        direction.y += Math.randomRange( -.1 , .1 );
        direction.z += Math.randomRange( -.1 , .1 );
        return direction;

      },

      maxMeshes: 10,
      decayRate: .998
      
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


       // womb.fractal1.fractal.material.uniforms.texturePower.value = .3 + 1.7 * Math.random();
        
        var l = womb.selectedMeshes.length;

        var uniforms = womb.fractal1.fractal.material.uniforms;
        uniforms.texturePower.value = l / 5;
        uniforms.color.value.x = l / 30;
        

      }

    });
    
    mesh.add();

    var theta = 2 * Math.PI * Math.random();
    var phi   = 2 * Math.PI * ( Math.random() - .5 );

    mesh.position = Math.toCart( womb.size/2 , theta, phi  );
    Math.setRandomRotation( mesh.rotation );

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

  function unselectMesh( mesh ){

    mesh.selected = false;
    mesh.material.uniforms.color.value = hoverColor;
    mesh.emitter.end();

    var l = womb.selectedMeshes.length;
    for( var i = 0; i < womb.selectedMeshes.length; i++ ){

      if( womb.selectedMeshes[i] == mesh ){
        console.log(womb.selectedMeshes[i] );
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
    mesh.emitter.startingSpeed = s ;
    mesh.emitter.friction = .99;
    mesh.emitter.decayRate = .9;
    mesh.emitter.emissionRate = 10;


    womb.selectedMeshes.push( mesh );

    if( womb.selectedMeshes.length == 6  ){

      allMeshesSelected();

    }


  }
  function allMeshesSelected(){


    womb.clickableBeing.exit();
    var t = womb.tweener.createTween({
      object: womb.fractal1.body,
      target: new THREE.Vector3( .005 , .005 , .005 ),
      type: 'scale',
      callback: function(){
        womb.fractal1.fractal.material.uniforms.texturePower.value = 100;
        womb.fractal1.fractal.material.uniforms.color.value = new THREE.Vector3();
        womb.fractal1.fractal.material.uniforms.opacity.value = .2;
        womb.fractal1.fractal.material.additive = THREE.NormalBlending;
        womb.fractal1.fractal.material.updateSeed = true;
        womb.fractal1.fractal.material.needsUpdate = true;

        var l = womb.selectedMeshes.length;
        for( var i = 0; i < womb.selectedMeshes.length;){

          unselectMesh( womb.selectedMeshes[i] );
          l = womb.selectedMeshes.length;
          console.log( l );


        }
        womb.clickableBeing.enter();

      }
    });

    womb.fractal2.enter();






    t.start();

  }

});
