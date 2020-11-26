import BlockCreator from './tools/blockCreator';
// import bombRedHTML from './images/bombRedHTML.txt';
import blockBlackHTML from './images/blockBlackHTML.txt';
import blockBlueHTML from './images/blockBlueHTML.txt';
import blockOrangeHTML from './images/blockOrangeHTML.txt';
import blockVioletHTML from './images/blockVioletHTML.txt';
import blockRedHTML from './images/blockRedHTML.txt';
// import bombBlack from './images/bombBlack.svg';
import explosion from './images/explosion.png';


export default class Block extends BlockCreator {
    
    constructor({row, col, posY, posX, width, height, situation}) {

      // this.element comes from extendee, it is the div
        super();        
        this.row = row || 0;
        this.col = col || 0;
        this.color = null;
        this.posY = posY || 0;        
        this.posX = posX || 0;
        this.width = width || 10;
        this.height = height || 10;
        this.situation = situation || "none";
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        this.element.innerHTML = null;
        this.isFreefalling = false;
        this.hasBomb = false;
        this.bombDiv = null;
        this.bombDivSqueezed = false;
        this.detonationAnimationCounter = 0;
        this.detonationAnimationFrameCounter = 0;
        this.spriteSheetUpShift = 0;
        this.spriteSheetLeftShift = 0;
        this.timePerDetonationFrame = 3;
        this.init();
    }
   
    setBlockInInitialPosition() {
      if (this.situation === "none") throw new Error ('block situation missing...');
        this.element.style.top = this.posY+'px';
        this.element.style.left = this.posX+'px';
    }

    updateBlockPosition() {
        // console.log(`positioning real unanimated block to: ${this.posX} ${this.posY}`);        
        this.element.style.left = this.posX+'px';
        
        if (this.isFreefalling) {
            // console.log('block falling free!');
            this.element.style.transitionProperty = "top";
            this.element.style.transitionDuration = "0.5s";
            this.element.style.transitionTimingFunction = "ease-out"; 
        }        
        this.element.style.top = this.posY+'px';
    }   
    
    animateDetonation() {      
      //debugger
      const delta = this.width*3;
      this.detonationAnimationCounter++;
      // console.log('ANIMATION: ', this.detonationAnimationCounter);      
      if (this.detonationAnimationFrameCounter < 48) {       
        if (this.detonationAnimationCounter % this.timePerDetonationFrame === 0)
// debugger
          {        
          this.detonationAnimationFrameCounter++;
          // console.log('FRAME', this.detonationAnimationFrameCounter);
          // console.log('LEFT SHIFT: ', this.spriteSheetLeftShift);
          // console.log('UP SHIFT: ', this.spriteSheetUpShift);
          this.bombDiv.style.backgroundPosition = `${this.spriteSheetLeftShift}px ${this.spriteSheetUpShift}px`;
//debugger          
          this.spriteSheetLeftShift -= delta;
          if (this.detonationAnimationFrameCounter % 8 === 0) {
            //shift sprite sheet to second row sprites
              this.spriteSheetUpShift -= delta;
              this.spriteSheetLeftShift = 0;
          }
        }
        window.requestAnimationFrame(() => this.animateDetonation());     
      } else {
        // console.log('end of animation');
        this.detonationAnimationCounter = 0;
        this.detonationAnimationFrameCounter = 0;
        this.spriteSheetUpShift = 0;
        this.spriteSheetLeftShift = 0;
      }
    }

    getBomb() {
      // console.log(this.element);
      this.bombDiv = document.createElement('div');
      this.bombDiv.classList.add('explosionArea');
      this.bombDiv.style.width = `${this.width*3}px`;
      this.bombDiv.style.height = `${this.height*3}px`;
      this.bombDiv.style.transform = `translate(-${this.width}px, -${this.height}px)`;
      this.element.appendChild(this.bombDiv);   
      this.hasBomb = true;
      // console.log(this.bombDiv);
      //TURN WHITE ON TO ISOLATE THE EXPLOSION ANIMATION
      // this.bombDiv.style.backgroundColor = `white`;
      this.bombDiv.style.backgroundImage = `url('${explosion}')`;
      // console.log(explosion);
      this.bombDiv.style.backgroundRepeat = "no-repeat";
      //the sprite sheet is 8 frames wide (24 blocks) and 6 frames high (18 blocks)
      this.bombDiv.style.backgroundSize=`${this.width*24}px ${this.width*18}px`;
      //INITIALY BACKGROUND OUTSIDE OF THE EXPLOSION AREA
      //MARK
      this.bombDiv.style.backgroundPosition = "1000px 1000px";
      //THIS HIDES EPLOSION AREA BORDER
      this.bombDiv.style.opacity = 1; 
      this.bombDiv.style.zIndex = "1";      
    }

    init() {      
      // this.element.style.opacity = '0.1';
      this.pickColor();
      this.setBlockInInitialPosition();
      if(this.situation === "topleft") {
        this.getBomb();
        //THIS MAKES BOMB EXPLODE RIGHT AWAY FOR TESTING
        // this.animateDetonation();
        // this.element.style.background = `#f3f3f3 url('${bombBlack}')`;
        this.element.classList.toggle("hasBomb");
        // console.log(this.element);
        
      }
    }

    pickColor() {   
        const colorOptions = ["red", "violet", "orange", "blue", "black"];
        const colorOptionsHTML = [blockRedHTML, blockVioletHTML, blockOrangeHTML, blockBlueHTML, blockBlackHTML];
        const randomNumber = Math.floor(Math.random()*colorOptions.length);
        this.element.innerHTML = colorOptionsHTML[randomNumber];
        this.color = colorOptions[randomNumber];
    }   

    
}

