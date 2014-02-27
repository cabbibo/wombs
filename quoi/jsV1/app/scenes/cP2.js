define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');




  var cP2 = {};

  cP2.init = function( womb ){

    womb.cP2 = womb.world.sceneController.createScene({
      transition:'scale'
    });


    womb.cP2.geo = new THREE.Geometry();

    var r = womb.world.size / 10;
    var p = 0;
    for( var i = 0; i < 100; i++ ){

      var t = 2 * Math.PI * i / 100;
    
      var vert = Math.toCart( r , t , p );
      womb.cP2.geo.vertices.push( vert );

    }

    womb.cP2.audioGeometry = new AudioGeometry( womb.cP2.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.straightScale( 128 )
    });

    

    womb.cP2.material = new THREE.ParticleBasicMaterial();
    womb.cP2.material.map  = THREE.ImageUtils.loadTexture( "img/particleSprites/codameParticle.png" );
    womb.cP2.material.size = 7;
    womb.cP2.material.opacity = .5;
    womb.cP2.material.transparent = true;
    womb.cP2.material.blending = THREE.AlphaBlending;

    womb.cP2.particleSystems = [];
    for( var i = 0; i < 20; i ++ ){

      var pS = new THREE.ParticleSystem( womb.cP2.audioGeometry.geometry , womb.cP2.material );

      pS.rotation.x = Math.PI / 2;
      pS.scale.multiplyScalar( (i+20) / 10 );

      womb.cP2.particleSystems.push( pS );
      womb.cP2.scene.add( pS );
    }

    womb.cP2.scene.position.z = - womb.world.size;

    womb.cP2.update = function(){

      this.audioGeometry.update();

      for( var i = 0; i < womb.cP2.particleSystems.length; i++ ){

        var pS = womb.cP2.particleSystems[i];

        pS.rotation.y += womb.stream.analyser.array[i] / 50000;

      }
      

    }

  }


  module.exports = cP2;

});
