define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');




  var cP3 = {};

  cP3.init = function( womb ){

    womb.cP3 = womb.world.sceneController.createScene({
      transition:'scale'
    });


    womb.cP3.geo = new THREE.Geometry();

    var r = womb.world.size / 10;
    var p = 0;
    for( var i = 0; i < 100; i++ ){

      var t = 2 * Math.PI * i / 100;
    
      var vert = Math.toCart( r , t , p );
      womb.cP3.geo.vertices.push( vert );

    }

    womb.cP3.audioGeometry = new AudioGeometry( womb.cP3.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.straightScale( 128 )
    });

    

    womb.cP3.material = new THREE.ParticleBasicMaterial();
    womb.cP3.material.map      = THREE.ImageUtils.loadTexture( "img/particleSprites/codameParticle.png" );
    womb.cP3.material.size = 10;
    womb.cP3.material.opacity = .6;
    womb.cP3.material.transparent = true;
    womb.cP3.material.blending = THREE.AlphaBlending;

    womb.cP3.particleSystems = [];
    for( var i = 0; i < 20; i ++ ){

      var pS = new THREE.ParticleSystem( womb.cP3.audioGeometry.geometry , womb.cP3.material );

      pS.rotation.x = Math.PI / 2;
      pS.scale.multiplyScalar( (i+20) / 10 );

      womb.cP3.particleSystems.push( pS );
      womb.cP3.scene.add( pS );
    }

    womb.cP3.scene.position.z = - womb.world.size;

    womb.cP3.update = function(){

      this.audioGeometry.update();

      for( var i = 0; i < womb.cP3.particleSystems.length; i++ ){

        var pS = womb.cP3.particleSystems[i];

        pS.rotation.z += womb.stream.analyser.array[i] / 10000;
        pS.rotation.x += Math.cos(womb.stream.analyser.array[i]) / 100;
        pS.rotation.y += Math.sin(womb.stream.analyser.array[i]) / 100;

      }
      

    }

  }


  module.exports = cP3;

});
