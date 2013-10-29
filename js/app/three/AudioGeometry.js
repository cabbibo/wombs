define(function(require, exports, module) {

  var aF = require( 'app/utils/AnalyzingFunctions' );

  function AudioGeometry( geo , audio , params ){

    this.params = _.defaults( params || {} , {

      allVertices:        true,
      analyzingFunction:  aF.vertexDependent( 3000 )

    });

    this.audio    = audio;
    this.geometry = geo.clone();
    this.data     = this.geometry.clone();


  }


  AudioGeometry.prototype.update = function(){


    this.audio._update();

    var al = this.audio.analyser.array.length;
    var gl = this.geometry.vertices.length;


    for( var i = 0; i < gl; i++ ){
    
      var fbd = this.audio.analyser.array[i % (al/2)];

      if( this.geometry.vertices[i] ){

        var v = this.geometry.vertices[i];
        var d = this.data.vertices[i];

        this.geometry.vertices[i] = this.params.analyzingFunction( i , d , gl , fbd , al );

        
      }
    
    }


    this.geometry.verticesNeedUpdate = true;

  }


  module.exports = AudioGeometry;

});
