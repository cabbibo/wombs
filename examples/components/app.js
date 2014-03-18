define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                  );
  
  var FractalBeing       = require( 'Species/Beings/FractalBeing');

  var m                   = require( 'Utils/Math'             );
  
  var Being               = require( 'Components/Being'       );
  var Mesh                = require( 'Components/Mesh'        );
  var Clickable           = require( 'Components/Clickable'   );
  var Duplicator          = require( 'Components/Duplicator'  );
  var Component           = require( 'Components/Component'   );
  
  /*
   
     Create our womb

  */
  
  var womb = new Womb({
    stats: true,
  });

  var geo     = new THREE.IcosahedronGeometry( womb.size/ 10 , 3  );

  var being = new Being();
  var being1 = new Being();

  var mesh = new Mesh( womb.defaults.geometry , womb.defaults.material );
  var mesh1 = new Mesh( womb.defaults.geometry , womb.defaults.material );
  var mesh2 = new Mesh( womb.defaults.geometry , womb.defaults.material );
  var mesh3 = new Mesh( womb.defaults.geometry , womb.defaults.material );

  var mat = new THREE.MeshBasicMaterial({color:0xff0000});
  var subMesh = new Mesh( womb.defaults.geometry , mat );

 
  being.addComponent( mesh );
  being.addComponent( mesh1 );
  being.addComponent( mesh2 );


  being1.addComponent( mesh3 );
  mesh3.addComponent( subMesh );

  console.log( 'BEINGS' );
  console.log( being );
  console.log( being1 );

  mesh.translate( 50 , 0 , 0 );
  mesh3.translate( 50 , 50 , 0 );

  womb.being = being;

  womb.loader.loadBarAdd();

  womb.start = function(){

    being.enter();
    being1.enter();
   
  }


});
