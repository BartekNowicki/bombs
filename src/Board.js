import TheDOM from './TheDOM.js';
import Cell from './Cell.js';
import Block from './Block.js';
// import { TweenMax, TimelineMax} from 'gsap';
import { gsap, Elastic } from 'gsap';
import Score from './Score.js';

export default class Board extends TheDOM {    
    constructor(numberOfRows, numberOfCols) {
        super();
        this.cells = [];
        this.blocks = [];      
        this.newBunch = [];
        // this.boardWidth = 0;
        this.element = null;
        this.deltaY = 0;
        this.deltaX = 0;
        this.numberOfRows = numberOfRows;
        this.numberOfCols = numberOfCols;
        this.masterTimeline = null;
        this.ease = null;
        this.bunchCanFall = true;
        this.readyForNewBunch = false;
        this.bunchCanGoLeft = true;
        this.bunchCanGoRight = true;
        this.fallingSpeed = 1;
        this.hangingColumnsPresent = false;
        this.scoreModule = null;
        this.scoreResult = 0;
        this.init();
        
    }

    generateCells() {
        // console.log('generating cells...');
            for (let row = 0; row <= this.numberOfRows -1; row++) {
                this.cells[row] = [];                
                for (let col = 0; col <= this.numberOfCols -1; col++) {
                    this.cells[row].push(new Cell(row, col));                    
                }
            } 
    }
    
    createCellElements() {
        this.cells.flat().forEach(cell => {
            const newHtml = cell.createElement();
            this.element.insertAdjacentHTML("beforeend", newHtml); 
            // console.log(newHtml);
            cell.element = cell.getElement(cell.selector);
            // console.log(cell.element);
        });
    }

    takeBoardMeasurements() {
        this.cells.flat().forEach(cell => {
            cell.takeMeasurements();
            // turning off not to collide with swiping
            // cell.assignClickListener();
        });
        this.boardWidth = this.element.offsetWidth;
        // cell 0 0 width
        this.deltaX = this.cells[0][0].getDimentions()[0];
        //cell 0 0 height
        this.deltaY = this.cells[0][0].getDimentions()[1];        
    }

    showBoardMeasurements() {
        console.log('board width: ', this.boardWidth);
        this.cells.flat().forEach(cell => {
        console.log('cell position: ', cell.getPosition());
        console.log('cell dimentions: ', cell.getDimentions());
        });
    }

    init() {
        // console.log('initializing a new board instance');
        this.element = this.getElement(this.DOMSelectors.board);
        
        // console.log(this.element);
        this.generateCells();
        // console.log(this.cells);
        this.createCellElements();  
        this.takeBoardMeasurements();
        // this.showBoardMeasurements();
        this.ease = Elastic.easeOut.config(0.5, 1);
        this.scoreModule = new Score;
        this.cells[0][2].element.style.backgroundColor = "brown";
        this.cells[0][3].element.style.backgroundColor = "brown";
        this.cells[1][2].element.style.backgroundColor = "brown";
        this.cells[1][3].element.style.backgroundColor = "brown";
    }

    
    insertBlock(row, col, situation) {
        // console.log('THIS WILL INSERT A NEW BLOCK');
        const posY = this.cells[row][col].getPosition()[0];
        const posX = this.cells[row][col].getPosition()[1];
        const width = this.cells[row][col].getDimentions()[0];
        const height = this.cells[row][col].getDimentions()[1];
        const newBlock = new Block({row, col, posY, posX, width, height, situation});
        this.newBunch.push(newBlock);
        this.blocks.push(newBlock);
        // console.log(`we now have: ${this.blocks.length} blocks`);
        this.cells[row][col].occupied = true;
        // debugger
    }

    checkIfCellOccupied(row, col) {
        // console.log(`cell under is ${this.cells[row][col].occupied ? "occupied" : "free"}`);        
        //this will eliminate errors when sliding on the bottom row:
        if (row > this.numberOfRows - 1) return true
        return this.cells[row][col].occupied;
    }

    markTrio(...blocksSameColor) {
        // console.log('marking trios green...');
        for (const block of blocksSameColor) {
            // block.element.style.border = "5px solid green";
            block.element.classList.add("gonner");
        }
    }
    
    includeAsGonner(block) {
        if (!block.element.classList.contains("gonner")) {
            // block.element.style.border = "5px solid green";
            block.element.classList.add("gonner");
        } 
    }

    markTrioNeighbors() {
        // console.log('marking trio neighbors...');
        for (const block of this.blocks) {
            if(block.element.classList.contains("gonner")) {
                const matchingColor = block.color;
                const gonnerRow = block.row;
                const gonnerCol = block.col;
                const rowAboveGonner = block.row - 1;
                const rowBelowGonner = block.row + 1;
                const colLeftOfGonner = block.col - 1;
                const colRightOfGonner = block.col + 1;
                const blockAboveGonner = this.blocks.find(item => item.row === rowAboveGonner && item.col === gonnerCol);
                const blockBelowGonner = this.blocks.find(item => item.row === rowBelowGonner && item.col === gonnerCol);
                const blockLeftOfGonner = this.blocks.find(item => item.row === gonnerRow && item.col === colLeftOfGonner);
                const blockRightOfGonner = this.blocks.find(item => item.row === gonnerRow && item.col === colRightOfGonner);

                if (blockAboveGonner && blockAboveGonner.color === matchingColor) {
                    this.includeAsGonner(blockAboveGonner);
                }
                if (blockBelowGonner && blockBelowGonner.color === matchingColor) {
                    this.includeAsGonner(blockBelowGonner);                 
                }
                if (blockLeftOfGonner && blockLeftOfGonner.color === matchingColor) {
                    this.includeAsGonner(blockLeftOfGonner);                 
                }
                if (blockRightOfGonner && blockRightOfGonner.color === matchingColor) {
                    this.includeAsGonner(blockRightOfGonner);                 
                }
            }            
        }
    }

    findTriosAndNeighbors() {
        // console.log('identifying trios and neighbors...');  
                    for (const centerBlock of this.blocks) {
                        let leftBuddy = null;
                        let rightBuddy = null;
                        let topBuddy = null; 
                        let bottomBuddy = null;
                        if (centerBlock.col > 0) {
                            leftBuddy = this.blocks.find(block => block.row === centerBlock.row && block.col === centerBlock.col-1);
                        }
                        if (centerBlock.col < this.numberOfCols - 1) {
                            rightBuddy = this.blocks.find(block => block.row === centerBlock.row && block.col === centerBlock.col + 1);
                        }
                        if (centerBlock.row > 0) {
                            topBuddy = this.blocks.find(block => block.row === centerBlock.row - 1 && block.col === centerBlock.col);
                        }
                        if (centerBlock.row < this.numberOfRows - 1) {
                            bottomBuddy = this.blocks.find(block => block.row === centerBlock.row + 1 && block.col === centerBlock.col);
                        }
                        //BEGIN TESTING
                        // console.clear();
                        // console.log(centerBlock.element);
                        // if (leftBuddy) { console.log('leftBuddy: ', leftBuddy.element);}
                        // if (rightBuddy) { console.log('rightBuddy: ', rightBuddy.element);}
                        // if (topBuddy) { console.log('topBuddy: ', topBuddy.element);}
                        // if (bottomBuddy) { console.log('bottomBuddy: ', bottomBuddy.element);}
                        // debugger
                        //END TESTING    
                        
                        if (leftBuddy && rightBuddy) {
                            // console.log('COLORS: ', leftBuddy.color, centerBlock.color, rightBuddy.color);
                            if(leftBuddy.color === centerBlock.color && centerBlock.color === rightBuddy.color) {
                                // console.log('we got a match!');
                                // debugger
                                this.markTrio(leftBuddy, centerBlock, rightBuddy);
                            }                             
                        }

                        if (topBuddy && bottomBuddy) {
                            if(topBuddy.color === centerBlock.color && centerBlock.color === bottomBuddy.color) {
                                this.markTrio(topBuddy, centerBlock, bottomBuddy);
                            }                             
                        }
                    }
                    this.markTrioNeighbors();
    }

    eliminateAllSurroundingBlocks(block) {
        // console.log('showing all surrounding blocks');
        this.blocks.forEach(item => {
            if (
                   item.row === block.row && item.col === block.col + 1 
                || item.row === block.row && item.col === block.col - 1 
                || item.row === block.row - 1 && item.col === block.col 
                || item.row === block.row + 1 && item.col === block.col
                || item.row === block.row -1 && item.col === block.col -1
                || item.row === block.row -1 && item.col === block.col +1
                || item.row === block.row + 1 && item.col === block.col +1
                || item.row === block.row + 1 && item.col === block.col -1) {
                // item.element.style.border = "4px solid white";
                item.element.classList.add("gonner");
    // debugger
            }
        });
    }

    eliminateBlockFromBoardAndBlocksArray(block) {
        if (block.hasBomb) {
            block.animateDetonation();
            this.eliminateAllSurroundingBlocks(block);
            setTimeout(() => {block.element.style.opacity = "0";}, 1500);        
        } else {
            block.element.style.opacity = "0";
        }
        this.changeCellOccupiedStatus(block.row, block.col, false);
        const thisBlocksCopy = [...this.blocks];
        const blockIndex = thisBlocksCopy.findIndex(item => item === block);
        // console.log(blockIndex, block.element);
        thisBlocksCopy.splice(blockIndex, 1);
        this.blocks = thisBlocksCopy;
        // console.log('block eliminated, we now have blocks:', this.blocks.length);
        // debugger
        this.scoreModule.setValue(++this.scoreResult);
    }

    removeTriosAndNeighbors() {
        // console.log('removing trios and neighbors...');
        for (const block of this.blocks) {
            if (block.element.classList.contains("gonner")) {
            this.eliminateBlockFromBoardAndBlocksArray(block);
            }
        }
    }

    dropColumnOneCell(row, col) {
// debugger
        for (const block of this.blocks) {
            if (block.col === col && block.row === row) {
                // block.element.style.border = "2px solid white";
// debugger
                this.dropBlockOneCellDown(block);
// debugger
                this.changeCellOccupiedStatus(block.row-1, block.col, false);
// debugger
                this.changeCellOccupiedStatus(block.row, block.col, true);
// debugger
            } 
        }
// debugger
        for (const block of this.blocks) {
            block.element.style.border = "";
            if (block.isFreefalling) {
//this debugger shows that freeFalling blocks do exist but only for a short while - when freeFalling:
//debugger
                block.isFreefalling = false;  //recently added line, make sure it is ok!
            }
            
        }
        if (this.hangingColumnsPresent) {
            this.makeHangingColumnsFall();
        }
    }

    makeHangingColumnsFall() {
        // console.log('making hanging columns fall...');
        this.hangingColumnsPresent = false;
        let hangingBlockRow = null;
        let hangingBlockCol = null;
        for (const block of this.blocks) {
            if (block.row < this.numberOfRows - 1 && !this.cells[block.row + 1][block.col].occupied) {
                // block.element.style.border = "2px dotted white";
                block.isFreefalling = true;
                //this will disallow rotation:
                block.situation === "single";
                this.hangingColumnsPresent = true;
                hangingBlockRow = block.row;
                hangingBlockCol = block.col;
                this.dropColumnOneCell(hangingBlockRow, hangingBlockCol);
           } else {
            block.element.style.border = "";
           }
        }
    }

    makeAllBlocksSingle() {
        // console.log('making all blocks single');
        this.blocks.forEach(block => block.situation = "single");
        // this.blocks.forEach(block => console.log(block.situation === "single"));
    }

    clearBoardAndReadyNewBunch() {
        // console.log('clearing the board and requesting new bunch...');
        //single blocks cannot be rotated or shifted anymore:
        this.makeAllBlocksSingle(); 

        //LOOP THIS IF TWO RUNS NOT ENOUGH:
        this.findTriosAndNeighbors();
        this.removeTriosAndNeighbors();
        this.makeHangingColumnsFall(); 
        
        this.findTriosAndNeighbors();
        this.removeTriosAndNeighbors();
        this.makeHangingColumnsFall(); 
        
        //TELLING THE GAME.JS THAT NEXT BLOCK IS DUE AND IT WILL REACT THROUGH requestAnimationFrame
        this.readyForNewBunch = true;


    }

    tryHandleBunchFinalFallComplete() {
        // for testing to see when bunch cannot fall:
        // this.cells[0][0].element.style.border = "1px solid blue";
        // console.log('clearing the board in 1000ms unless still falling...');
        //timeout required as bunch can resume falling and make bunchCanFall=true again
        //if it has just been shifted horizontally into empty space!
        setTimeout(()=>{
            this.checkIfBunchCanFall();
            if (!this.bunchCanFall) {
                this.clearBoardAndReadyNewBunch();
            } else {
                // ELSE WHAT? IS THIS THE RIGHT MARK

            }        
        }, 1000);         
    }

    checkIfBunchCanFall() {
        this.newBunch.forEach(block => {
            if (block.situation === "bottomleft" || block.situation === "bottomright") {
                if(block.row === this.numberOfRows-1 || this.checkIfCellOccupied(block.row+1, block.col)) {
                    this.bunchCanFall = false;
                    this.tryHandleBunchFinalFallComplete();                    
                }                
            }             
        });
        // console.log('CHECKING THAT BUNCH CAN FALL:', this.bunchCanFall);
    }

    changeCellOccupiedStatus(row, col, bool) {
        if(typeof bool !== "boolean") return console.log('need a boolean for the cell occupied status');
        this.cells.flat().find(cell => cell.row === row && cell.col === col).occupied = bool;
    }

    dropBlockOneCellDown(block) {
        block.row++;
        block.posY+=this.deltaY;
        block.updateBlockPosition();
        this.readjustExplosionSize();       
    }

    handleBunchFallComplete() {
        this.readjustExplosionSize();
        // console.log('bunch fall complete');
        this.masterTimeline.pause(0);             
        this.newBunch.forEach(block => {
            block.element.classList.remove("falling");
            // console.log(block.situation);
            if (block.situation === "topleft") {                
                this.dropBlockOneCellDown(block);
                this.changeCellOccupiedStatus(block.row-1, block.col, false);
            } else if (block.situation === "topright") {
                this.dropBlockOneCellDown(block);
                this.changeCellOccupiedStatus(block.row-1, block.col, false);
            } else if (block.situation === "bottomleft") {
                this.dropBlockOneCellDown(block);
                this.changeCellOccupiedStatus(block.row, block.col, true);
            } else if (block.situation === "bottomright") {
                this.dropBlockOneCellDown(block);
                this.changeCellOccupiedStatus(block.row, block.col, true);
            }                                     
        });
        // debugger
        this.makeNewBunchFall(this.fallingSpeed);         
    }

    makeNewBunchFall(speed) {
        // console.log('speed: ', this.fallingSpeed);
        this.checkIfBunchCanFall();
        if(!this.bunchCanFall) return
        this.newBunch.forEach(block => {
            // console.log('THIS WILL FALL: ', block.element);
            block.element.classList.add("falling");
        });
        //without the arrow function below the tween creates its own this
        this.masterTimeline = gsap.timeline({repeat: 0, repeatDelay: 0, duration: 0.5, ease: this.ease});                      
        this.masterTimeline.to(".falling", {y: this.deltaY, onComplete: () => {this.handleBunchFallComplete()}});
        this.masterTimeline.play(0);
        this.masterTimeline.timeScale(speed);             
    }

    trackOccupiedCells() {
        this.cells.flat().forEach(cell => {
            cell.occupied 
            ? cell.element.style.border = "1px dotted red" : cell.element.style.border = "";            
        });
    }      

    checkIfBunchCanMoveHorizontally(direction) {
        if (direction === "left") {
            this.bunchCanGoLeft = true;
            this.newBunch.forEach(block => {
                if (block.situation === "topleft") {
                    if (block.col === 0 || this.checkIfCellOccupied(block.row, block.col - 1)) {
                        this.bunchCanGoLeft = false;
                    }               
                } else if (block.situation === "bottomleft") {
                    if (block.col === 0 || this.checkIfCellOccupied(block.row, block.col - 1) || this.checkIfCellOccupied(block.row + 1, block.col - 1)) {
                        this.bunchCanGoLeft = false;
                    }            
                }               
            });
        } else {
            this.bunchCanGoRight = true;
            this.newBunch.forEach(block => {
                if (block.situation === "topright") {
                    if (block.col === this.numberOfCols -1 || this.checkIfCellOccupied(block.row, block.col + 1)) {
                        this.bunchCanGoRight = false;
                    }                
                } else if (block.situation === "bottomright") {
                    if (block.col === this.numberOfCols -1 || this.checkIfCellOccupied(block.row, block.col + 1) || this.checkIfCellOccupied(block.row +1, block.col + 1)) {
                        this.bunchCanGoRight = false;
                    }                
                }              
            });
        }        
        // console.log('LEFT FREE: ', this.bunchCanGoLeft, 'RIGHT FREE: ', this.bunchCanGoRight);
    }     

    shiftBunch(direction) {
        if(this.masterTimeline) {
            this.masterTimeline.pause();
        }
        // console.log(`${direction === "left" ? "SHIFTING LEFT" : "SHIFTING RIGHT"}`);
        if (direction === "left") {
            this.newBunch.forEach(block => {
                block.col--;
                block.posX-=this.deltaX;
                block.updateBlockPosition();
                if (block.situation === "topleft") {
                    // console.log(block.element);
                    this.changeCellOccupiedStatus(block.row, block.col, true);
                } else if (block.situation === "bottomleft") {
                    this.changeCellOccupiedStatus(block.row, block.col, true);
                } else if (block.situation === "topright") {
                    this.changeCellOccupiedStatus(block.row, block.col + 1, false);
                } else if (block.situation === "bottomright") {
                    this.changeCellOccupiedStatus(block.row, block.col + 1, false);
                } 
            });
        } else {
            this.newBunch.forEach(block => {
                block.col++;
                // this.changeCellOccupiedStatus(block.row-1, block.col, false);
                block.posX+=this.deltaX;
                block.updateBlockPosition();
                if (block.situation === "topright") {
                    this.changeCellOccupiedStatus(block.row, block.col, true);
                } else if (block.situation === "bottomright") {
                    this.changeCellOccupiedStatus(block.row, block.col, true);
                } else if (block.situation === "topleft") {
                    this.changeCellOccupiedStatus(block.row, block.col - 1, false);
                } else if (block.situation === "bottomleft") {
                    this.changeCellOccupiedStatus(block.row, block.col - 1, false);
                } 
            });
        }
        this.readyForNewBunch = false;
        this.bunchCanFall = true;        
        this.checkIfBunchCanFall();
        // console.log(this.bunchCanFall);
        // debugger
        if (this.bunchCanFall && this.masterTimeline) {
            this.masterTimeline.play();
        }
    }

    moveBunch(direction) {
        if (!this.bunchCanFall) return //NEW ADDITION!
        direction === "left" ? this.checkIfBunchCanMoveHorizontally("left") : this.checkIfBunchCanMoveHorizontally("right");
        if (direction === "left" && !this.bunchCanGoLeft) return
        if (direction === "right" && !this.bunchCanGoRight) return
        direction === "left" ? this.shiftBunch("left") : this.shiftBunch("right");
        this.readjustExplosionSize(direction);
    }

    readjustExplosionSize(justShifted = "none") {
        this.blocks.forEach(block => {
            if (block.hasBomb) {
                //EXPLOSION HEIGHT
                if (block.situation === "single" && block.row >= this.numberOfRows - 1 || block.situation === "bottomleft" && block.row >= this.numberOfRows - 1 || block.situation === "bottomright" && block.row >= this.numberOfRows - 1) {
                    block.bombDiv.style.height = block.height * 2 + 'px';
                    block.bombDivSqueezed = true;
    // debugger
                }
                //EXPLOSION WIDTH
                if (block.situation === "single" && block.col < 1 || block.situation === "topleft" && block.col < 1 || block.situation === "bottomleft" && block.col < 1) {
                    block.bombDiv.style.width = block.width * 2 + 'px';
                    block.bombDivSqueezed = true;
                    block.bombDiv.style.transform = `translate(0px, -${block.height}px)`;
    // debugger
                } else if (block.situation === "single" && block.col > this.numberOfCols - 2 || block.situation === "topright" && block.col > this.numberOfCols - 2 || block.situation === "bottomright" && block.col > this.numberOfCols - 2) {
                    block.bombDiv.style.width = block.width * 2 + 'px';
                    block.bombDivSqueezed = true;
    // debugger
                } else if (justShifted === "right" && block.bombDivSqueezed ||justShifted === "left" && block.bombDivSqueezed) {
                    block.bombDiv.style.width = block.width * 3 + 'px';
                    block.bombDivSqueezed = false;
                    block.bombDiv.style.transform = `translate(-${block.width}px, -${block.height}px)`;
                    // console.log(justShifted);
                } 

            }            
        });
    }

    rotateBunch(direction) {
        //"single" cannot rotate
        if (direction === "left") {
            this.newBunch.forEach(block => {
                if (block.situation === "topright") {
                    // block.element.style.border = '1px solid gray';
                    block.posX -= this.deltaX;
                    block.updateBlockPosition();
                    block.situation = "topleft";
                    block.col--;
                } else if (block.situation === "topleft") {
                    block.posY += this.deltaY;
                    block.updateBlockPosition();                    
                    block.situation = "bottomleft";
                    block.row++;
                } else if (block.situation === "bottomleft") {
                    block.posX += this.deltaX;
                    block.updateBlockPosition();                    
                    block.situation = "bottomright";
                    block.col++;                                           
                } else if (block.situation === "bottomright") {
                    block.posY -= this.deltaY;
                    block.updateBlockPosition();                    
                    block.situation = "topright";
                    block.row--;                                          
                }
            });
        } else {
            this.newBunch.forEach(block => {
                if (block.situation === "topright") {
                    // block.element.style.border = '1px solid gray';
                    block.posY += this.deltaY;
                    block.updateBlockPosition();
                    block.situation = "bottomright";
                    block.row++;
                } else if (block.situation === "topleft") {
                    block.posX += this.deltaX;
                    block.updateBlockPosition();                    
                    block.situation = "topright";
                    block.col++;
                } else if (block.situation === "bottomleft") {
                    block.posY -= this.deltaY;
                    block.updateBlockPosition();                    
                    block.situation = "topleft";
                    block.row--;                                           
                } else if (block.situation === "bottomright") {
                    block.posX -= this.deltaX;
                    block.updateBlockPosition();                    
                    block.situation = "bottomleft";
                    block.col--;                                          
                }
            });                 
        }
        this.readjustExplosionSize(direction);
    }


    speedUpFalling() {
        this.fallingSpeed = 100;
        // console.log('THIS WILL MAKE THE BLOCK FALL FAST x ', this.fallingSpeed);
    }

    selfDestruct() {
        console.log('the board is self destructing...');
        this.blocks.forEach(block => {
            block.parent.removeChild(block.element);
        });
        this.blocks.length = 0;
        this.newBunch.length = 0;
        this.cells.flat().forEach(cell => {
            this.element.removeChild(cell.element);
        });        
        this.cells.length = 0;
        if (this.masterTimeline) {
            this.masterTimeline.kill();
        }
        this.deltaY = null;
        this.deltaX = null;
    }

    
        
}

