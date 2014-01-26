define(function(require, exports, module) {

  require( 'lib/three.min' );


  RecursiveFunctions = {};

  RecursiveFunctions.antiSerpenski = function( array , v , width , oD , rF , mWidth ){

    //array is the array we want to fill
    //v  = old Position Vector
    //oD = old Direction
    //rF = reduction Factor
    var dir = [
      [  1 ,  0 ,  0 ],
      [  0 ,  1 ,  0 ],
      [  0 ,  0 ,  1 ],
      [ -1 ,  0 ,  0 ],
      [  0 , -1 ,  0 ],
      [  0 ,  0 , -1 ],
    ];

    var nWidth = width / rF;
    var oppOD;
    
    // Tells us which direction we shoul
    // not place the box in
    if ( oD >= 3 ){
      oppOD = oD - 3;	
    }else{
      oppOD = oD + 3;	
    }
      
    for( var i = 0; i < dir.length; i++ ){
          
      if( i != oppOD ){
        
        var p = new THREE.Vector3();
        
        p.x = ( dir[i][0] * ( width + nWidth ) * .5 ) + v.x;
        p.y = ( dir[i][1] * ( width + nWidth ) * .5 ) + v.y;
        p.z = ( dir[i][2] * ( width + nWidth ) * .5 ) + v.z;
        
        array.push( [ p , dir[i] , nWidth ]);
        
        if( nWidth >= mWidth){
            this.antiSerpenski( array , p , nWidth , i , rF , mWidth   );
        }	
      }
    }
  }


  module.exports = RecursiveFunctions;

});
