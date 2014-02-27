define(function(require, exports, module) {

  require = ( 'lib/three.min' );
 

  function Link( womb , params ){

    this.womb = womb;

    this.params = _.defaults( params || {} , {

        material: new MeshBasicMaterial

    });

    this.loader = THREE.ImageUtils;



  }





  module.exports = LinkCreator;

});

