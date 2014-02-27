define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  var mandala3 = {};


  mandala3.init = function( womb ){

    womb.mandala3 = womb.world.sceneController.createScene({
      transition:'scale' 
    });

    womb.mandala3.light = new THREE.PointLight( 0xeeeeee , womb.world.size /2 , .5 );

    womb.mandala3.scene.add( womb.mandala3.light );


    womb.mandala3.geo = new THREE.SphereGeometry( womb.world.size/40 , 20,10 );
    womb.mandala3.material = new THREE.MeshPhongMaterial({
      color:        0x990099,
      emissive:     0xaa3399,
      specular:     0xaa11aa,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      //side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  



    womb.mandala3.audioGeometry = new AudioGeometry( womb.mandala3.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.vertexDependent( 2000 )
    });



    womb.mandala3.meshes = [];
    for( var i = 0; i < 10; i ++ ){

      
      var mesh = new THREE.Mesh( womb.mandala3.audioGeometry.geometry  , womb.mandala3.material );

      mesh.rotation.z = 2 * Math.PI * i / 10;
      //mesh.position.x = Math.randomRange( womb.world.size * 2 );
      //mesh.position.y = Math.randomRange( womb.world.size * 2);
      //mesh.position.z = Math.randomRange( womb.world.size * 2);

      womb.mandala3.scene.add( mesh );
      womb.mandala3.meshes.push( mesh );


    }

    womb.mandala3.scene.position.z  = - womb.world.size;
    womb.mandala3.update = function(){
      womb.mandala3.audioGeometry.update();
     // womb.mandala3.scene.rotation.x += .005;
     // womb.mandala3.scene.rotation.y += .001;
      womb.mandala3.scene.rotation.z -= .002;

      /*for( var i =0; i< womb.mandala3.meshes.length; i ++ ){

        var m = womb.mandala3.meshes[i];
        m.rotation.x += Math.cos( i ) * .003;
        m.rotation.y += Math.sin( i ) * .003;
        m.rotation.z += Math.tan( i ) * .003;




      }*/

    }
  }



  module.exports = mandala3;


});
