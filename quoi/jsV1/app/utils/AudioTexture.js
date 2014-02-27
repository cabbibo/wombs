define(function(require, exports, module) {

  function AudioTexture( audio ){

    this.audio = audio;
    this.analyser = audio.analyser;

    this.fbc = this.analyser.frequencyBinCount;

    // TODO: why 2 * 4 instead of 4 ?
    // fudge factor is to make sure texture reachs from 0 -> 1 in vUv coords
    this.pixels = this.fbc / 8.2; 

    //creates a canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.style.zIndex = 999;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top       = '0px'

    //document.body.appendChild( this.canvas );
    
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
      for (var i = 0; i < this.pixels ; i++) {
        
        var x = i;
        var y = 0;
        var r = this.analyser.array[i]   | 0;
        var g = this.analyser.array[i+1] | 0;       
        var b = this.analyser.array[i+2] | 0;
        var a = this.analyser.array[i+3] | 0;
        this.setPixelData( this.imageData , x , y , r , g , b , a ); 
      
      }


      this.c.putImageData( this.imageData , 0 , 0 );

      //updates the texture
      this.texture.needsUpdate =  true;
    }

    //console.log('ss');

  }

  //TODO: Move this to canvasFunctions

  AudioTexture.prototype.setPixelData = function (imageData, x, y, r, g, b, a) {

      index = ( x + y * imageData.width ) * 4;
      imageData.data[index+0] = r;
      imageData.data[index+1] = g;
      imageData.data[index+2] = b;
      imageData.data[index+3] = a;

  }


  
  module.exports = AudioTexture;

});

