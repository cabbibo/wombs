define(function(require, exports, module) {

  var a = require( 'js/lib/Tween.js'  );


  function ShaderMaterial( uniforms , vertexShader , fragmentShader ){

 
    this.uniforms       = uniforms;
    this.vertexShader   = vertexShader;
    this.fragmentShader = fragmentShader;

    this.material       = new THREE.ShaderMaterial({

      uniforms:         this.uniforms,
      vertexShader:     this.vertexShader,
      fragmentShader:   this.fragmentShader

    });




    

  }

  
  module.exports = ShaderMaterial;

});

