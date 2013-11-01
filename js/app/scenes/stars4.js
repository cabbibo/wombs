define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  var stars4 = {};


  stars4.init = function( womb ){

    womb.stars4 = womb.world.sceneController.createScene({
      transition:'scale' 
    });

    womb.stars4.light = new THREE.DirectionalLight( 0xaaaaee , .5 );
    womb.stars4.light1 = new THREE.DirectionalLight( 0xeeaaaa , .5 );
    womb.stars4.light2 = new THREE.DirectionalLight( 0xffffff , 1 );

    womb.stars4.light.position.set( 0 ,1 , 0);
    womb.stars4.light1.position.set( 1 ,0 , 0);
    womb.stars4.light2.position.set( 0 ,0 , -1);

    womb.stars4.scene.add( womb.stars4.light );
    womb.stars4.scene.add( womb.stars4.light1 );
    womb.stars4.scene.add( womb.stars4.light2 );


    womb.stars4.geo = new THREE.IcosahedronGeometry( womb.world.size/40 , 2 );
    womb.stars4.material = new THREE.MeshPhongMaterial({
        color:        0x99aacc,
        emissive:     0xaa8877,
        specular:     0xaaeeee,
        shininess:    100000,
        ambient:      0xff0000,
        shading:      THREE.FlatShading,
        //side:         THREE.DoubleSide,
        opacity:      1,
        transparent:  true
    });  

    womb.stars4.audioGeometry = new AudioGeometry( womb.stars4.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.straightScale( 128 )
    });



    womb.stars4.meshes  = [];
    womb.stars4.data    = [];

    for( var i = 0; i < 50; i ++ ){

      
      var mesh = new THREE.Mesh( womb.stars4.audioGeometry.geometry  , womb.stars4.material); 

      var color = new THREE.Color();
      color.r  = i/ 50;
      color.g  = 0;
      color.b  = (25-i/4)/50;

      var color2 = new THREE.Color();
      color.r  = (25-i/2)/ 50;
      color.g  = .1;
      color.b  = i/100;


      mesh.material.color = color;
      mesh.material.specular = color;
      mesh.material.emissive = color;
      mesh.material.needsUpdate = true;
      console.log( color );
 
      mesh.position.x = Math.randomRange( womb.world.size * 2 );
      mesh.position.y = Math.randomRange( womb.world.size * 2 );
      mesh.position.z = Math.randomRange( womb.world.size * 2 );

      womb.stars4.data.push([ mesh.position.x , mesh.position.y , mesh.position.z ]);

      womb.stars4.scene.add( mesh );
      womb.stars4.meshes.push( mesh );


    }

    womb.stars4.scene.position.z = - womb.world.size;
    womb.stars4.update = function(){
      womb.stars4.audioGeometry.update();
      womb.stars4.scene.rotation.x += .005;
      womb.stars4.scene.rotation.y += .001;
      womb.stars4.scene.rotation.z -= .002;

      for( var i =0; i< womb.stars4.meshes.length; i ++ ){

        var fbd = womb.stream.analyser.array[i];
        var m = womb.stars4.meshes[i];
        var d = womb.stars4.data[i];

      
        m.position.x = d[0] * ( 1 + fbd/500 );
        m.position.y = d[1] * ( 1 + fbd/500 );
        m.position.z = d[2] * ( 1 + fbd/500 );
        
        m.rotation.x += Math.cos( fbd ) * .003;
        m.rotation.y += Math.sin( fbd ) * .003;
        m.rotation.z += Math.tan( fbd ) * .003;




      }

    }
  }



  module.exports = stars4;


});
