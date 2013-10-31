define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  var mandala1 = {};


  mandala1.init = function( womb ){

    womb.mandala1 = womb.world.sceneController.createScene({
      transition:'scale' 
    });

    womb.mandala1.light = new THREE.PointLight( 0xeeeeee , womb.world.size /2 , .5 );

    womb.mandala1.scene.add( womb.mandala1.light );


    womb.mandala1.geo = new THREE.IcosahedronGeometry( womb.world.size/40 , 2 );
    womb.mandala1.material = new THREE.MeshPhongMaterial({
      color:        0xaaaa33,
      emissive:     0xaa0044,
      specular:     0xeeee99,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      //side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  



    womb.mandala1.audioGeometry = new AudioGeometry( womb.mandala1.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.vertexDependent( 4000 )
    });



    womb.mandala1.meshes = [];
    for( var i = 0; i < 10; i ++ ){

      
      var mesh = new THREE.Mesh( womb.mandala1.audioGeometry.geometry  , womb.mandala1.material );

      mesh.rotation.z = 2 * Math.PI * i / 10;
      //mesh.position.x = Math.randomRange( womb.world.size * 2 );
      //mesh.position.y = Math.randomRange( womb.world.size * 2);
      //mesh.position.z = Math.randomRange( womb.world.size * 2);

      womb.mandala1.scene.add( mesh );
      womb.mandala1.meshes.push( mesh );


    }

    womb.mandala1.scene.position.z  = - womb.world.size;
    womb.mandala1.update = function(){
      womb.mandala1.audioGeometry.update();
     // womb.mandala1.scene.rotation.x += .005;
     // womb.mandala1.scene.rotation.y += .001;
      womb.mandala1.scene.rotation.z -= .002;

      /*for( var i =0; i< womb.mandala1.meshes.length; i ++ ){

        var m = womb.mandala1.meshes[i];
        m.rotation.x += Math.cos( i ) * .003;
        m.rotation.y += Math.sin( i ) * .003;
        m.rotation.z += Math.tan( i ) * .003;




      }*/

    }
  }



  module.exports = mandala1;


});
