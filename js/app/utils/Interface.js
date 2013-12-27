define( function( require , exports , module ){
 
  require( 'lib/stats.min'        );
  require( 'lib/jquery-1.7.1.min' );
  require( 'lib/dat.gui.min'      );


  function Interface( womb ){

    this.womb = womb;

    // The DOM element of the interface will lay over
    // the entire application
    this.domElement     = document.createElement('div');
    this.domElement.id  = 'interface';

    document.body.appendChild( this.domElement );

    // We will always have stats, even if they are not added
    // to the interface tree
    this.stats  = new Stats();

    //this.domElement.appendChild( this.stats.domElement );
    if( womb.params.stats )
      this.addStats();
    

    // If we have a title or summary, add an info section
    // to the interface tree
    if( womb.params.title || womb.params.summary ){

      this.addInfo();

      if( womb.params.title )
        this.addTitle( womb.params.title );

      if( womb.params.summary )
        this.addSummary( womb.params.summary );

    }

    // If we are using a GUI for altering, create one
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

  Interface.prototype.addStats = function(){

    this.domElement.appendChild( this.stats.domElement );
    this.stats.domElement.id = 'stats';
  
  }

  Interface.prototype.addInfo = function(){

    this.info = document.createElement('div');
    this.info.id = 'info';
    this.domElement.appendChild( this.info );

  }


  Interface.prototype.addTitle = function(title){

    this.title = document.createElement('h1');
    this.title.id = 'title';

    if( this.womb.params.link ){
      this.link = document.createElement('a');
      this.link.href = this.womb.params.link;
      this.link.target = '_blank';
      this.link.innerHTML = title;
      this.title.appendChild( this.link );
    }else{
      this.title.innerHTML = title;
    }
    this.info.appendChild( this.title );

  }


  Interface.prototype.addSummary = function( summary ){

    this.summary = document.createElement('h2');
    this.summary.id = 'summary';
    this.summary.innerHTML = summary;
    this.info.appendChild( this.summary );

  }


  Interface.prototype.addGUI = function(){
    
    this.gui = new dat.GUI();
    this.domElement.appendChild( this.gui.domElement );
    this.gui.domElement.id = 'GUI';
  
  }


  Interface.prototype.addUniform = function( propt , uniform , folder ){

    if( !this.gui )
      this.addGUI();
   
    // Getting the proper place to add the uniform
    var f = folder || this.gui;

    if( uniform.type == 't' ){
      this.addTextureUniform( propt , uniform , f );
    } else if ( uniform.type == 'v3' ){
      this.addVectorUniform( propt , uniform , f );
    } else if( uniform.type == 'f' ){
      f.add( uniform , 'value', -uniform.value * 2 , uniform.value * 2 ).listen();
    }

  }

  Interface.prototype.addAllUniforms = function( uniforms , title ){

    var folder = this.gui.addFolder( title );
    
    for( var propt in uniforms ){

      var uniform = uniforms[ propt ];
     
      if( propt == 'color' ){
        this.addColorUniform( uniform , folder ,  'color' );
      }else{
        this.addUniform( propt , uniform , folder );
      }

    }

  }

  Interface.prototype.addVectorUniform = function( title , uniform , folder , size ){

    // Getting the proper place to add the uniform
    var f = folder || this.gui;
    var s = size || 20;

    var u = f.addFolder( title );
    u.add( uniform.value , 'x' , -1 , 1 ).listen();
    u.add( uniform.value , 'y' , -1 , 1 ).listen();
    u.add( uniform.value , 'z' , -1 , 1 ).listen();


  }

  
  Interface.prototype.addColorUniform = function( uniform , folder ){

    /*// Getting the proper place to add the uniform
    var f = folder || this.gui;

    this.params.tempValue = '#ffffff';
    //this.params.tempValue = { h: 350, s: 0.9, v: 0.3 };
    f.add( this.params , 'tempValue' ).onChange( function( value ){

      console.log( value );

    });
*/
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
