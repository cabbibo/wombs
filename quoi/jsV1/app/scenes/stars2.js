define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  var stars2 = {};


  stars2.init = function( womb ){

    womb.stars2 = womb.world.sceneController.createScene({
      transition:'scale' 
    });

    womb.stars2.light = new THREE.DirectionalLight( 0xaaaaee , .5 );
    womb.stars2.light1 = new THREE.DirectionalLight( 0xeeaaaa , .5 );
    womb.stars2.light2 = new THREE.DirectionalLight( 0xaaeeaa , 1 );

    womb.stars2.light.position.set( 0 ,1 , 0);
    womb.stars2.light1.position.set( 1 ,0 , 0);
    womb.stars2.light2.position.set( 1 ,0 , 1);

    womb.stars2.scene.add( womb.stars2.light );
    womb.stars2.scene.add( womb.stars2.light1 );
    womb.stars2.scene.add( womb.stars2.light2 );


    womb.stars2.geo = new THREE.IcosahedronGeometry( womb.world.size/40 , 2 );
    womb.stars2.material = new THREE.MeshPhongMaterial({
        color:        0x99aacc,
        emissive:     0x008877,
        specular:     0xaaccee,
        shininess:    100000,
        ambient:      0xff0000,
        shading:      THREE.FlatShading,
        //side:         THREE.DoubleSide,
        opacity:      1,
        transparent:  true
    });  

    womb.stars2.audioGeometry = new AudioGeometry( womb.stars2.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.straightScale( 128 )
    });



    womb.stars2.meshes  = [];
    womb.stars2.data    = [];

    for( var i = 0; i < 50; i ++ ){

      
      var mesh = new THREE.Mesh( womb.stars2.audioGeometry.geometry  , new THREE.MeshPhongMaterial({
        color:        0x99aacc,
        emissive:     0x008877,
        specular:     0xaaccee,
        shininess:    100000,
        ambient:      0xff0000,
        shading:      THREE.FlatShading,
        //side:         THREE.DoubleSide,
        opacity:      1,
        transparent:  true
      }) ); 

      var color = new THREE.Color();
      color.r  = i / 100;
      color.g  = 0;
      color.b  = (25-i/4)/50;

      var color2 = new THREE.Color();
      color.b  = i/ 100;
      color.r  = 0;
      color.g  = (25-i/4)/50;


      mesh.material.color = color;
      mesh.material.specular = color;
      mesh.material.emissive = color;
      mesh.material.needsUpdate = true;
      console.log( color );
 
      mesh.position.x = Math.randomRange( womb.world.size * 3 );
      mesh.position.y = Math.randomRange( womb.world.size * 3 );
      mesh.position.z = Math.randomRange( womb.world.size * 3 );

      womb.stars2.data.push([ mesh.position.x , mesh.position.y , mesh.position.z ]);

      womb.stars2.scene.add( mesh );
      womb.stars2.meshes.push( mesh );


    }

    womb.stars2.scene.position.z = - womb.world.size;
    womb.stars2.update = function(){
      womb.stars2.audioGeometry.update();
      womb.stars2.scene.rotation.x += .005;
      womb.stars2.scene.rotation.y += .001;
      womb.stars2.scene.rotation.z -= .002;

      for( var i =0; i< womb.stars2.meshes.length; i ++ ){

        var fbd = womb.stream.analyser.array[i];
        var m = womb.stars2.meshes[i];
        var d = womb.stars2.data[i];

      
        m.position.x = d[0] * ( 1 - fbd/500 );
        m.position.y = d[1] * ( 1 - fbd/500 );
        m.position.z = d[2] * ( 1 - fbd/500 );
        
        m.rotation.x += Math.cos( fbd ) * .003;
        m.rotation.y += Math.sin( fbd ) * .003;
        m.rotation.z += Math.tan( fbd ) * .003;




      }

    }
  }



  module.exports = stars2;


});
