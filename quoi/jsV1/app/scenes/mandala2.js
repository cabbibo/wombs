define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  var mandala2 = {};


  mandala2.init = function( womb ){

    womb.mandala2 = womb.world.sceneController.createScene({
      transition:'scale' 
    });

    womb.mandala2.light = new THREE.PointLight( 0xeeeeee , womb.world.size /2 , .5 );

    womb.mandala2.scene.add( womb.mandala2.light );


    womb.mandala2.geo = new THREE.SphereGeometry( womb.world.size/40 , 20,10 );
    womb.mandala2.material = new THREE.MeshPhongMaterial({
      color:        0x3366aa,
      emissive:     0x0044aa,
      specular:     0x3399ee,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      //side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  



    womb.mandala2.audioGeometry = new AudioGeometry( womb.mandala2.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.vertexDependent( 2000 )
    });



    womb.mandala2.meshes = [];
    for( var i = 0; i < 10; i ++ ){

      
      var mesh = new THREE.Mesh( womb.mandala2.audioGeometry.geometry  , womb.mandala2.material );

      mesh.rotation.z = 2 * Math.PI * i / 10;
      //mesh.position.x = Math.randomRange( womb.world.size * 2 );
      //mesh.position.y = Math.randomRange( womb.world.size * 2);
      //mesh.position.z = Math.randomRange( womb.world.size * 2);

      womb.mandala2.scene.add( mesh );
      womb.mandala2.meshes.push( mesh );


    }

    womb.mandala2.scene.position.z  = - womb.world.size;
    womb.mandala2.update = function(){
      womb.mandala2.audioGeometry.update();
     // womb.mandala2.scene.rotation.x += .005;
     // womb.mandala2.scene.rotation.y += .001;
      womb.mandala2.scene.rotation.z -= .002;

      /*for( var i =0; i< womb.mandala2.meshes.length; i ++ ){

        var m = womb.mandala2.meshes[i];
        m.rotation.x += Math.cos( i ) * .003;
        m.rotation.y += Math.sin( i ) * .003;
        m.rotation.z += Math.tan( i ) * .003;




      }*/

    }
  }



  module.exports = mandala2;


});
