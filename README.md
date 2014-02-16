
/*

   NOTES

*/

Constant Work In Progress. Feel Free To Jump in and help out, or send me any suggestions!
@cabbibo

  Good Articles to keep in mind:
  http://substack.net/many_things
specifically: "If your framework melts away into an informal collection of modules that happen to work well together but can be easily repurposed by people who don't use the framework, then you have built something very sublime."

  PRE ALPHA:

  - figure out physics simulation particles
  - Clean up code
  - Figure out make and make build!
  
  - Try to make more things into functions that return what you want!
    - these components are healthier for modularity

  - Try to set up some standards for vertex and fragment shaders,
    - so it is easier to seperate the two!

  - Soundcloud Grabber
  - More Vertex shaders!
  - More Fragment Shaders!

  - Cross hatch shader and some of jaume's tools  
  - create 'transition shader'

  - FBO GPU Particle Shader!

  - Projects: 
    -Meta Balls!

  - loader conditions!


  Organization:

    -Womb ( World )
        
        - Audio
          - AudioController.js
          - Audio.js
          - Looper.js
          - UserAudio.js
          - Stream.js
          - 
        - Camera
          - Controls
            - LeapFlyControls.js
            - MomentumControls.js
            - etc
          - CameraController.js

        - Physics
          - Global Forces
          - forces that can be assigned to single being

        - Loading
          - ObjLoader.js
          - JsonLoader.js
          - ImageLoader.js
          - ModelLoader.js


        - Raycaster.js
      
        - EffectComposer.js
  
        - LinkCreator.js (???)
        

        - Textures
          - UserMediaTexture.js
          - VideoTexture.js
          - AudioTexture.js
          - TextCreator.js


        - World.js
        
        - Creator

        - Loader.js
        - Interface.js
        - Animator.js
        - Detector.js
        - 
      

    - Being ( Game Object / Scene )
        - Physics
          - Mass
          - Types of forces to add

        - Body
          - Geometry
          - Material
          - Arrangement( default is single Geometry )
            - Placement
            - Tweening functions such as fan out


        - Prefabs
          


    // THings that are not 'Womb' dependent
    - Utils
      - CanvasFunctions.js
      - Math.js
      - RecursiveFunctions.js
      - PlacementFunctions.js
      - helperFunctions.js


    - Shaders

   
  - Placement Functions:
     - Random Sphere edge,
     - Random Placed,
     - Recursive Random
     - Pure Circle,
     - Line,
     - Grid


  - loader conditions
  - loader.failure() to be called on errors
  - loader.addFailure();
  - loader.onFailure();   // To make sure there are no extra
  - loader.failureDOM to be called whenever a application doesn't work.


  http://threejs.org

  Reza Ali
  Robbie
  Tim Chin
  ZZ85
  Theo Armor

  West Langley
  Kali
  IQ




   
