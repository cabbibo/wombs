define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  var lurker1 = {};


  lurker1.init = function( womb ){

    womb.lurker1 = womb.world.sceneController.createScene({
      transition:'scale' 
    });

    womb.lurker1.light = new THREE.PointLight( 0xeeeeee , womb.world.size /2 , .5 );

    womb.lurker1.scene.add( womb.lurker1.light );


    womb.lurker1.geo = new THREE.PlaneGeometry( womb.world.size * 10 , womb.world.size* 10 , 20 , 20 );
    womb.lurker1.material = new THREE.MeshPhongMaterial({
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



    womb.lurker1.audioGeometry = new AudioGeometry( womb.lurker1.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.zOnly( womb.world.size  , 128 )
    });



    womb.lurker1.meshes = [];
    for( var i = 0; i < 1; i ++ ){

      
      var mesh = new THREE.Mesh( womb.lurker1.audioGeometry.geometry  , womb.lurker1.material );

      //mesh.position.x = Math.randomRange( womb.world.size * 2 );
      //mesh.position.y = Math.randomRange( womb.world.size * 2);
      //mesh.position.z = Math.randomRange( womb.world.size * 2);

      womb.lurker1.scene.add( mesh );
      womb.lurker1.meshes.push( mesh );


    }

    womb.lurker1.scene.position.z = - womb.world.size * 4;

    womb.lurker1.update = function(){
      womb.lurker1.audioGeometry.update();
      //womb.lurker1.scene.rotation.x += .005;
      //womb.lurker1.scene.rotation.y += .001;
      womb.lurker1.scene.rotation.z -= .002;

      /*for( var i =0; i< womb.lurker1.meshes.length; i ++ ){

        var m = womb.lurker1.meshes[i];
        m.rotation.x += Math.cos( i ) * .003;
        m.rotation.y += Math.sin( i ) * .003;
        m.rotation.z += Math.tan( i ) * .003;




      }*/

    }
  }



  module.exports = lurker1;


});
