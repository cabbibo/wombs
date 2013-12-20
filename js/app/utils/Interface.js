define( function( require , exports , module ){

  require( 'js/lib/jquery-1.7.1.min.js' );
  require( 'js/lib/dat.gui.min.js'      );


  function Interface( womb ){

    this.domElement     = document.createElement('div');
    this.domElement.id  = 'interface';

    document.body.appendChild( this.domElement );


    if( womb.params.title || womb.params.summary ){

      this.addInfo();

      if( womb.params.title )
        this.addTitle( womb.params.title );

      if( womb.params.summary )
        this.addSummary( womb.params.summary );

    }

    if( womb.params.gui ){
      this.params = {};
      this.addGUI();
    }

    var self = this;

    $(document).keypress(function(event){
		var whichKey=String.fromCharCode(event.which)
	
		if(whichKey=='x'){
		  self.toggle();    
        }

    });



  }


  Interface.prototype.addInfo = function( ){

    this.info = document.createElement('div');
    this.info.id = 'info';
    this.domElement.appendChild( this.info );

  }


  Interface.prototype.addTitle = function(title){

    this.title = document.createElement('h1');
    this.title.id = 'title';
    this.title.innerHTML = title;
    this.info.appendChild( this.title );

  }


  Interface.prototype.addSummary = function( summary ){

    this.summary = document.createElement('h2');
    this.summary.id = 'summary';
    this.summary.innerHTML = summary;
    this.info.appendChild( this.summary );

  }

  Interface.prototype.addStats = function(){

  }

  Interface.prototype.addGUI = function(){
    
    this.gui = new dat.GUI();
    this.domElement.appendChild( this.gui.domElement );
    this.gui.domElement.id = 'GUI';
  
  }


  Interface.prototype.addUniform = function( uniform , folder ){

    if( !this.gui )
      this.addGUI();
   
    // Getting the proper place to add the uniform
    var f = folder || this.gui;

    console.log( uniform );

    if( uniform.type == 't' ){
      this.addTextureUniform( uniform , f );
    } else if ( uniform.type == 'v3' ){
      this.addVectorUniform( uniform , f );
    } else if( uniform.type == 'f' ){
      f.add( uniform , 'value', -uniform.value * 20 , uniform.value * 20 ).listen();
    }

  }

  Interface.prototype.addAllUniforms = function( uniforms , title ){

    var folder = this.gui.addFolder( title );
    
    for( var propt in uniforms ){

      var uniform = uniforms[ propt ];
      console.log( propt );
      console.log( uniform );

     
      if( propt == 'color' ){
        this.addColorUniform( uniform , folder ,  'color' );
      }else{
        this.addUniform( uniform , folder );
      }

    }

  }

  Interface.prototype.addVectorUniform = function( uniform ){

  }

  
  Interface.prototype.addColorUniform = function( uniform ){

  }

  Interface.prototype.addTextureUniform = function( uniform ){

  }



  Interface.prototype.toggle = function(){
    
    $( this.domElement ).toggle();

  }


  // TODO: Make changing uniforms update
  Interface.prototype._update = function(){



  }


  module.exports = Interface;




});
