define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  var stars1 = {};


  stars1.init = function( womb ){

    womb.stars1 = womb.world.sceneController.createScene({
      transition:'scale' 
    });

    womb.stars1.light = new THREE.PointLight( 0xeeeeee , womb.world.size /2 , .5 );

    womb.stars1.scene.add( womb.stars1.light );


    womb.stars1.geo = new THREE.IcosahedronGeometry( womb.world.size/40 , 2 );
    womb.stars1.material = new THREE.MeshPhongMaterial({
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

    womb.stars1.audioGeometry = new AudioGeometry( womb.stars1.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.straightScale( 128 )
    });



    womb.stars1.meshes = [];
    for( var i = 0; i < 50; i ++ ){

      
      var mesh = new THREE.Mesh( womb.stars1.audioGeometry.geometry  , womb.stars1.material );
 
      mesh.position.x = Math.randomRange( womb.world.size * 3 );
      mesh.position.y = Math.randomRange( womb.world.size * 3 );
      mesh.position.z = Math.randomRange( womb.world.size * 3 );

      womb.stars1.scene.add( mesh );
      womb.stars1.meshes.push( mesh );


    }

    womb.stars1.scene.position.z = - womb.world.size;
    womb.stars1.update = function(){
      womb.stars1.audioGeometry.update();
      womb.stars1.scene.rotation.x += .005;
      womb.stars1.scene.rotation.y += .001;
      womb.stars1.scene.rotation.z -= .002;

      for( var i =0; i< womb.stars1.meshes.length; i ++ ){

        var m = womb.stars1.meshes[i];
        m.rotation.x += Math.cos( i ) * .003;
        m.rotation.y += Math.sin( i ) * .003;
        m.rotation.z += Math.tan( i ) * .003;




      }

    }
  }



  module.exports = stars1;


});
