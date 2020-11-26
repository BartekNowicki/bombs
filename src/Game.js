//         const matchingBlock = this.blocks.find(block => block.row === cell.row && block.col === cell.col);
// console.log(`cell under is ${this.cells[row][col].occupied ? "occupied" : "free"}`);
// console.table(this.blocks, ["color", "row", "col"]);
//         console.group();
//         // console.table(this.blocks, ["row", "col", "stopped"]);
//         // console.warn();
//         // console.log('%c ok ', 'background: #222; color: #bada55');
//         // console.table(object);
//         // console.dir(this.blocks);
//         // console.dir(this.playBtn, {colors: true, depth: null});
//         console.groupEnd();  

import TheDOM from './TheDOM.js';
import bombBlack from './images/bombBlack.svg';
import Board from './Board.js';
import Score from './Score.js';

export default class Game extends TheDOM {    
    constructor(playBtn) {
        // console.log('GAME RECEIVED: ', playBtn);
        super();
        this.config = { rows: 10, cols: 6, fallSpeed: 1 };
        this.progress = 'game not initialized';
        this.wrap = null;
        this.bonus = null;
        this.playBtn = playBtn;
        this.moveLeftBtn = null;
        this.rotateLeftBtn = null;
        this.rotateRightBtn = null;
        this.dropBtn = null;
        this.moveRightBtn = null;
        this.numberOfRows = null;
        this.numberOfCols = null;
        this.speed = null; 
        this.board = null;        
        this.gameOver = null;        
        this.score = null;
        this.total = 0;
        this.jestTestingValue = 999;
        this.animationFrame = null;
        this.animationCounter = null;
        this.firstGame = true;
        this.init();
    } 

    grabDOMelements() {
        this.wrap = this.getElement(this.DOMSelectors.wrap);  
        this.bonus = this.getElement(this.DOMSelectors.bonusImg);
        this.moveLeftBtn = this.getElement(this.DOMSelectors.moveLeftBtn);
        this.rotateLeftBtn = this.getElement(this.DOMSelectors.rotateLeftBtn);
        this.rotateRightBtn = this.getElement(this.DOMSelectors.rotateRightBtn);
        this.moveRightBtn = this.getElement(this.DOMSelectors.moveRightBtn);
        this.dropBtn = this.getElement(this.DOMSelectors.dropBtn);
        // console.log(this.board);  
        // console.log(this.moveLeftBtn, this.rotateLeftBtn, this.rotateRightBtn, this.moveRightBtn);  
    }

    requestNewBunch() {
        if (this.gameOver) return
        if (this.board.cells[0][2].occupied || this.board.cells[0][3].occupied || this.board.cells[1][2].occupied || this.board.cells[1][3].occupied ) {
            this.endGame();
            return
        } 

        this.board.newBunch.length = 0;        
        this.board.masterTimeline = null;
        // console.log('NEW BUNCH BEFORE: ',this.board.newBunch);
        this.board.insertBlock(0, 2, "topleft");
        this.board.insertBlock(0, 3, "topright");
        this.board.insertBlock(1, 2, "bottomleft");
        this.board.insertBlock(1, 3, "bottomright");
        // console.log('NEW BUNCH AFTER: ',this.board.newBunch);
        this.board.bunchCanFall = true;
        this.board.fallingSpeed = 1;
        this.board.makeNewBunchFall(this.board.fallingSpeed);
        this.board.readyForNewBunch = false; 
    }

    startGame() {        
        // console.log(this.playBtn);
        // console.log('first game: ', this.firstGame);
        this.gameOver = false;
        if (this.firstGame) {
            this.assignBlockControlClickListeners();
        } else {
            this.board.selfDestruct();
            this.board = new Board(this.numberOfRows, this.numberOfCols);
            this.score.element.classList.toggle('finalScoreColor');   
        }
        this.playBtn.classList.toggle('hide');        
        this.initiateScore();
        this.startRequestAnimationFrame();
        this.board.readyForNewBunch = true;
        this.animationCounter = 0;
    }    

    makeCellsSquareByLimitingWrapper() {
        //must be performed at the end of initializing
        const cellRenderedHeight = this.board.deltaY;
        // console.log('cell rendered height: ', cellRenderedHeight);
        this.wrap.style.width = cellRenderedHeight*this.numberOfCols+"px";
        //repeat the measuring process after board squeezing
        this.board.takeBoardMeasurements();        
    }

    initiateScore() {
        this.score = new Score(0);
        this.score.setValue(0);
    }

    keyPressed(key) {
        switch (key) {
            case 'ArrowDown':
                this.dropBlock();
            break;
            case 'ArrowLeft':
                this.moveHorizontally("left"); 
            break;
            case 'ArrowRight':
                this.moveHorizontally("right");
            break;
            case 'Control':
                this.rotateBunch("right");
            break;
            case 'AltGr':
                this.rotateBunch("left");
            break;            
            default:
              console.log(`press a function key instead of ${key}...`);
          }          
    }

    assignBlockControlClickListeners() {
        // console.log('assigning control listeners');
        this.dropBtn.addEventListener('click', () => this.dropBlock());
        this.moveLeftBtn.addEventListener('click', () => this.moveHorizontally("left"));        
        this.moveRightBtn.addEventListener('click', () => this.moveHorizontally("right")); 
        this.rotateLeftBtn.addEventListener('click', () => this.rotateBunch("left")); 
        this.rotateRightBtn.addEventListener('click', () => this.rotateBunch("right"));
        document.addEventListener('keyup', event => this.keyPressed(event.key));
    }    

    startRequestAnimationFrame() {   
        if (this.gameOver) return
        this.animationCounter++;
        if (this.animationCounter % 60 === 0) {
            // console.log('animating');
            this.animationCounter = 0;
            // for testing cell.occupied:  this.board.trackOccupiedCells();
            if (this.board.readyForNewBunch) {
                this.requestNewBunch();
            }      
        }                
        this.animationFrame = window.requestAnimationFrame(
            () => this.startRequestAnimationFrame()
        );            
    }
    
    init(speed = this.config.fallSpeed || 1) {
        this.gameOver = false;
        this.progress = 'initializing new game';
        this.numberOfRows = this.config.rows || 10;
        this.numberOfCols = this.config.cols || 6;
        this.speed = speed;
        // console.log('game data: ', this.numberOfRows, this.numberOfCols, this.speed);
        // changing css (not scss) variable back to transparent:
        document.documentElement.style.setProperty("--testVariable", "transparent");
        this.grabDOMelements();
        this.playBtn.addEventListener('click', this.startGame.bind(this));
        this.bonus.src = bombBlack;
        this.board = new Board(this.numberOfRows, this.numberOfCols);        
        this.makeCellsSquareByLimitingWrapper();        
    }

    dropBlock() {
        if (this.gameOver) return
        this.board.speedUpFalling();
        // for testing endGame only: this.endGame();
    }

    moveHorizontally(direction) {
        if (this.gameOver) return     
        // console.log(`THIS WILL BE moving ${direction} this block`);
        this.board.moveBunch(direction);
    }

    rotateBunch(direction) {
        if (this.gameOver) return
        this.board.rotateBunch(direction);
    }

    allowAnotherGame() {
        this.playBtn.textContent = "play again";
        this.playBtn.classList.toggle('hide');
        // console.log('wanna play again?');
        this.firstGame = false;
    }

    endGame() {
        this.board.blocks.forEach(block => block.element.style.opacity = "0.2");
        this.score.element.classList.toggle('finalScoreColor');
        this.gameOver = true;
        // console.log('GAME OVER: ', this.gameOver);
        
        this.animationFrame = null;
        if (this.board.masterTimeline) {
            this.board.masterTimeline.kill();
        }        
        this.allowAnotherGame();                
    }

    // gameOverChecker() {
    //     return this.gameOver;    
    // }
} 
