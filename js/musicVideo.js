
 /*
  
     Mandala Scene 1

  */

  womb.mandalaScene1 = womb.world.sceneController.createScene({
    transition:'scale' 
  });

  womb.mandalaScene1.light = new THREE.DirectionalLight( 0xeeeeee , .5 );
  womb.mandalaScene1.light.position.set( 0 , 1 , 0 );
  womb.mandalaScene1.scene.add( womb.mandalaScene1.light );

  womb.world.objLoader.loadFile( 'js/lib/tree.obj' , function(geo){


    womb.mandalaScene1.audioGeo = new AudioGeometry( geo[0] , womb.stream ,{
      analyzingFunction: AnalyzingFunctions.straightScale( 256 ) 
    });

    for( var i = 0; i < 10; i ++ ){

      var obj = new THREE.Mesh( 
        womb.mandalaScene1.audioGeo.geometry, 
        womb.mandalaScene1.material
      );
      obj.rotation.z = 2 * Math.PI * i / 10;
      
      womb.mandalaScene1.scene.add( obj );

    }

  });

  womb.mandalaScene1.geo = new THREE.IcosahedronGeometry( womb.world.size/20 , 2 );
  womb.mandalaScene1.material = new THREE.MeshPhongMaterial({
      color:        0x440077,
      emissive:     0x008877,
      specular:     0x440077,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  
  
  womb.mandalaScene1.update = function(){
    this.audioGeo.update();
  }


   /*
  
     Mandala Scene 2

  */

  womb.mandalaScene2 = womb.world.sceneController.createScene({
    transition:'scale' 
  });

  var light = new THREE.DirectionalLight( 0xfffff , .5 );
  light.position.set( 0 , -1 , 0 );
  womb.mandalaScene2.scene.add( light );
  
  var geo = new THREE.SphereGeometry( womb.world.size/10 , 20 , 5 );
  
  var material = new THREE.MeshPhongMaterial({
      color:        0x44aa77,
      emissive:     0xaa4477,
      specular:     0x44aa77,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  
  
  womb.mandalaScene2.audioGeo = new AudioGeometry( geo , womb.stream );

  womb.mandalaScene2.objects = [];

  for( var i = 0; i < 10; i ++ ){

    var r = womb.world.size / 5; 
    var t = 2*Math.PI * i / 10 ;
    var p = 0;

    var pos = Math.toCart( r , t , p );


    var obj = new THREE.Mesh( womb.mandalaScene2.audioGeo.geometry , material );
    obj.rotation.z = 2 * Math.PI * i / 10;

    obj.position = pos;
    obj.position.y = obj.position.z;
    //obj.position.z = -womb.world.size/5;

    womb.mandalaScene2.objects.push( obj );

    womb.mandalaScene2.scene.add( obj );

  }

  womb.mandalaScene2.update = function(){

    this.audioGeo.update();

    this.scene.rotation.z += .005;

    for( var i = 0; i < this.objects.length; i++ ){


      this.objects[i].rotation.y += (i+1) * .0005;

    }



  }


   /*
  
     Mandala Scene 3

  */

  womb.mandalaScene3 = womb.world.sceneController.createScene({
 
  });

  var light = new THREE.DirectionalLight( 0x00ffff , .5 );
  light.position.set( 1 , 0 , 0 );
  womb.mandalaScene3.scene.add( light );
  
  var geo = new THREE.CubeGeometry( womb.world.size/10 , womb.world.size/10, womb.world.size/10, 5  , 5 ,5 );
  
  var material = new THREE.MeshPhongMaterial({
      color:        0x3355aa,
      emissive:     0x005588,
      specular:     0x3355ff,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      side:         THREE.DoubleSide,
      opacity:      .5,
      wireframe:    true,
      transparent:  true
  });  
  
  womb.mandalaScene3.audioGeo = new AudioGeometry( geo , womb.stream , {
   
    analyzingFunction: AnalyzingFunctions.straightScale( 128 )
    
  });

  
  for( var i = 0; i < 10; i ++ ){

    var r = womb.world.size / 2; 
    var t = Math.PI * i / 10 ;
    var p = 0;

    var pos = Math.toCart( r , t , p );

    var obj = new THREE.Mesh( womb.mandalaScene3.audioGeo.geometry , material );
    obj.rotation.z = 2 * Math.PI * i / 10;

    obj.position = pos;

    womb.mandalaScene3.scene.add( obj );

  }

  womb.mandalaScene3.update = function(){

    this.scene.rotation.y += .005;
    this.scene.rotation.x += .002;
    this.audioGeo.update();

  }


    /*
  
     Mandala Scene 4

  */

  womb.mandalaScene4 = womb.world.sceneController.createScene({
    transition:'position' 
  });

  var light = new THREE.DirectionalLight( 0xffffff , .5 );
  light.position.set( -1 , 0 , 0 );
  womb.mandalaScene4.scene.add( light );
  
  var geo = new THREE.SphereGeometry( womb.world.size/10 , 10 , 10 , 10 );
  
  var material = new THREE.MeshPhongMaterial({
      color:        0xaaaa55,
      emissive:     0xaa6666,
      specular:     0xaaaa55,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  
  
  womb.mandalaScene4.audioGeo = new AudioGeometry( geo , womb.stream );

  
  for( var i = 0; i < 10; i ++ ){

    var r = womb.world.size / 2; 
    var t = Math.PI + Math.PI * i / 10 ;
    var p = 0;

    var pos = Math.toCart( r , t , p );

    var obj = new THREE.Mesh( womb.mandalaScene4.audioGeo.geometry , material );
    obj.rotation.z = 2 * Math.PI * i / 10;

    obj.position = pos;

    womb.mandalaScene4.scene.add( obj );

  }

  womb.mandalaScene4.timer = 0;

  womb.mandalaScene4.update = function(){


    this.timer ++;

    var scale = Math.cos( this.timer / 100 );

    this.scene.scale.x = (scale+2 )/ 2;
    this.scene.scale.y = (scale+2 )/ 2;
    this.scene.scale.z = (scale+2 )/ 2;

    this.scene.rotation.y += .002;
    this.scene.rotation.z += .005;




    this.audioGeo.update();

  }



  //womb.audioController.gain.gain.value = 0;

  womb.start = function(){

    womb.mandalaScene1.enter();
    womb.stream.play();

    var t1 = setTimeout( function(){ womb.mandalaScene2.enter() }, 5000 );
    var t2 = setTimeout( function(){ womb.mandalaScene3.enter() }, 10000 );
    var t3 = setTimeout( function(){ womb.mandalaScene4.enter() }, 15000 );

  }


