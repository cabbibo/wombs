define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  var stars5 = {};


  stars5.init = function( womb ){

    womb.stars5 = womb.world.sceneController.createScene({
      transition:'scale' 
    });

    womb.stars5.light = new THREE.DirectionalLight( 0xaaaaee , .5 );
    womb.stars5.light1 = new THREE.DirectionalLight( 0xeeaaaa , .5 );
    womb.stars5.light2 = new THREE.DirectionalLight( 0xffffff , 1 );

    womb.stars5.light.position.set( 0 ,1 , 0);
    womb.stars5.light1.position.set( 1 ,0 , 0);
    womb.stars5.light2.position.set( 0 ,0 , -1);

    womb.stars5.scene.add( womb.stars5.light );
    womb.stars5.scene.add( womb.stars5.light1 );
    womb.stars5.scene.add( womb.stars5.light2 );


    womb.stars5.geo = new THREE.IcosahedronGeometry( womb.world.size/40 , 2 );
    womb.stars5.material = new THREE.MeshPhongMaterial({
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

    womb.stars5.audioGeometry = new AudioGeometry( womb.stars5.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.straightScale( 128 )
    });



    womb.stars5.meshes  = [];
    womb.stars5.data    = [];
    womb.stars5.connectionGeometry = new THREE.Geometry();

    for( var i = 0; i < 50; i ++ ){

      
      var mesh = new THREE.Mesh( womb.stars5.audioGeometry.geometry  , womb.stars5.material); 

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

      var vert = new THREE.Vector3( mesh.position.x, mesh.position.y , mesh.position.z );
      womb.stars5.connectionGeometry.vertices.push( vert );
      if( i != 0 && i !=1 ) womb.stars5.connectionGeometry.faces.push( new THREE.Face3( i-2,i-1,i ) );

      womb.stars5.data.push([ mesh.position.x , mesh.position.y , mesh.position.z ]);

      womb.stars5.scene.add( mesh );
      womb.stars5.meshes.push( mesh );


    }


    womb.stars5.connectionMesh = new THREE.Mesh( womb.stars5.connectionGeometry ,
        new THREE.MeshBasicMaterial({
          //opacity:.1,
          //transparent:true,
          //blending:THREE.AdditiveBlending,
          side:THREE.DoubleSide
          
        })
        
        );

    womb.stars5.scene.add( womb.stars5.connectionMesh );

    womb.stars5.scene.position.z = - womb.world.size*2.25;
    womb.stars5.update = function(){
      womb.stars5.audioGeometry.update();
      womb.stars5.scene.rotation.x += .005;
      womb.stars5.scene.rotation.y += .001;
      womb.stars5.scene.rotation.z -= .002;

      for( var i =0; i< womb.stars5.meshes.length; i ++ ){

        var fbd = womb.stream.analyser.array[i];
        var m = womb.stars5.meshes[i];
        var d = womb.stars5.data[i];

      
        m.position.x = d[0] * ( 1 + fbd/500 );
        m.position.y = d[1] * ( 1 + fbd/500 );
        m.position.z = d[2] * ( 1 + fbd/500 );

        womb.stars5.connectionMesh.geometry.vertices[i].x = m.position.x;
        womb.stars5.connectionMesh.geometry.vertices[i].y = m.position.y;
        womb.stars5.connectionMesh.geometry.vertices[i].z = m.position.z;
        womb.stars5.connectionMesh.geometry.verticesNeedUpdate = true;
        
        m.rotation.x += Math.cos( fbd ) * .003;
        m.rotation.y += Math.sin( fbd ) * .003;
        m.rotation.z += Math.tan( fbd ) * .003;




      }

    }
  }



  module.exports = stars5;


});
