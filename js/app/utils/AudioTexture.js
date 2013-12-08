define(function(require, exports, module) {

  var a = require( 'js/lib/Tween.js'  );


  function AudioTexture( audio ){

    this.audio = audio;
    this.analyser = audio.analyser;

    this.fbd = this.analyser.frequencyBinCount;

    this.pixels = this.fbd / 4;

    //creates a canvas element
    this.canvas = document.createElement('canvas');
    
    this.canvas.width = this.pixels;
    this.canvas.height = 1;
    
    this.c = this.canvas.getContext('2d');

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.imageData = this.c.createImageData( this.width , this.height );

    this.c.putImageData( this.imageData , 0 , 0 );

    this.texture = new THREE.Texture( this.canvas );
    

   


  }

  AudioTexture.prototype.update = function(){

    if( this.analyser){
              
      this.imageData = this.c.createImageData( this.width , this.height );

      //transfers audio data to rgb values
      for (var i = 0; i < pixels ; i++) {
        x = i;
        y = 0;
        r = this.analyser.array[i]   | 0;
        g = this.analyser.array[i+1] | 0;;       
        b = this.analyser.array[i+2] | 0;;
        a = this.analyser.array[i+3] | 0;;
        setPixel( this.imageData , x , y , r , g , b , a ); 
      }


      this.c.putImageData( this.imageData , 0 , 0 );

      //updates the texture
      this.texture.needsUpdate =  true;
    }


  }

  //TODO: Move this to canvasFunctions

  AudioTexture.prototype.setPixelData = function (imageData, x, y, r, g, b, a) {

      index = (x + y * imageData.width) * 4;
      imageData.data[index+0] = r;
      imageData.data[index+1] = g;
      imageData.data[index+2] = b;
      imageData.data[index+3] = a;

  }


  
  module.exports = AudioTexture;

});

