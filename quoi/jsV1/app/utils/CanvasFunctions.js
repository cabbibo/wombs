define(function(require, exports, module) {

  require( 'lib/three.min' );


  var CanvasFunctions = {};

  CanvasFunctions.setPixel(imageData, x, y, r, g, b, a) {

    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;

  }




  module.exports = CanvasFunctions;

});
