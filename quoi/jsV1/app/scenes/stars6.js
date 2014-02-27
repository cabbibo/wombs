define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  var stars6 = {};


  stars6.init = function( womb ){

    womb.stars6 = womb.world.sceneController.createScene({
      transition:'scale' 
    });

    womb.stars6.light = new THREE.DirectionalLight( 0xaaaaa , .5 );
    womb.stars6.light1 = new THREE.DirectionalLight( 0xaaaaaa , .5 );
    womb.stars6.light2 = new THREE.DirectionalLight( 0xffffff , 1 );

    womb.stars6.light.position.set( 0 ,1 , 0);
    womb.stars6.light1.position.set( 1 ,0 , 0);
    womb.stars6.light2.position.set( 0 ,0 , 1);

    womb.stars6.scene.add( womb.stars6.light );
    womb.stars6.scene.add( womb.stars6.light1 );
    womb.stars6.scene.add( womb.stars6.light2 );


    womb.stars6.geo = new THREE.IcosahedronGeometry( womb.world.size/80 , 2 );
    womb.stars6.material = new THREE.MeshPhongMaterial({
        color:        0xccaacc,
        emissive:     0xaaff77,
        specular:     0xaaff55,
        shininess:    100000,
        ambient:      0xff0000,
        shading:      THREE.FlatShading,
        //side:         THREE.DoubleSide,
        opacity:      1,
        transparent:  true
    }); 

    womb.stars6.connectionMaterial = new THREE.MeshPhongMaterial({
        color:        0xaa0000,
        emissive:     0x000000,
        specular:     0xaa0000,
        shininess:    100000,
        ambient:      0xff0000,
        shading:      THREE.SmoothShading,
        //side:         THREE.DoubleSide,
        opacity:      1,
        transparent:  true
    }); 

    womb.stars6.audioGeometry = new AudioGeometry( womb.stars6.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.straightScale( 128 )
    });



    womb.stars6.meshes  = [];
    womb.stars6.data    = [];
    womb.stars6.connectionGeometry = new THREE.Geometry();

    for( var i = 0; i < 50; i ++ ){

      
      var mesh = new THREE.Mesh( womb.stars6.geo  , womb.stars6.material ); 

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

      mesh.position.x = Math.randomRange( womb.world.size / 2 );
      mesh.position.y = Math.randomRange( womb.world.size / 2 );
      mesh.position.z = Math.randomRange( womb.world.size / 2 );

      var vert = new THREE.Vector3( mesh.position.x, mesh.position.y , mesh.position.z );
      womb.stars6.connectionGeometry.vertices.push( vert );
      if( i != 0 && i !=1 ) womb.stars6.connectionGeometry.faces.push( new THREE.Face3( i-2,i-1,i ) );

      womb.stars6.data.push([ mesh.position.x , mesh.position.y , mesh.position.z ]);

      womb.stars6.scene.add( mesh );
      womb.stars6.meshes.push( mesh );


    }

    womb.stars6.connectionGeometry.computeFaceNormals();
    womb.stars6.connectionGeometry.computeVertexNormals();

    for(var i = 0; i < 6; i ++ ){

      var mesh = new THREE.Mesh( womb.stars6.connectionGeometry, womb.stars6.connectionMaterial );

      mesh.rotation.z = 2 * Math.PI * i / 6;
      womb.stars6.scene.add( mesh );
    }
   /* womb.stars6.connectionMesh = new THREE.Mesh( 
        womb.stars6.connectionGeometry ,
        womb.stars6.connectionMaterial
      

        );

    womb.stars6.scene.add( womb.stars6.connectionMesh );*/

    womb.stars6.scene.position.z = - womb.world.size;
    womb.stars6.update = function(){
      //womb.stars6.audioGeometry.update();
      womb.stars6.scene.rotation.x += .005;
      womb.stars6.scene.rotation.y += .001;
      womb.stars6.scene.rotation.z -= .002;

      for( var i =0; i< womb.stars6.meshes.length; i ++ ){

        var fbd = womb.stream.analyser.array[i];
        var m = womb.stars6.meshes[i];
        var d = womb.stars6.data[i];

      
        m.position.x = d[0] * ( 1 - fbd/500 );
        m.position.y = d[1] * ( 1 - fbd/500 );
        m.position.z = d[2] * ( 1 - fbd/500 );

        womb.stars6.connectionGeometry.vertices[i].x = m.position.x;
        womb.stars6.connectionGeometry.vertices[i].y = m.position.y;
        womb.stars6.connectionGeometry.vertices[i].z = m.position.z;
        womb.stars6.connectionGeometry.verticesNeedUpdate = true;
        
        m.rotation.x += Math.cos( fbd ) * .003;
        m.rotation.y += Math.sin( fbd ) * .003;
        m.rotation.z += Math.tan( fbd ) * .003;




      }

    }
  }



  module.exports = stars6;


});
