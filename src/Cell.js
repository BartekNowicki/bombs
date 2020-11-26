import TheDOM from './TheDOM.js';

export default class Cell extends TheDOM {
    constructor (row, col) {
        super();
        this.row = row;
        this.col = col;
        this.occupied = false;
        this.isBombBlack = false;
        this.isBombRed = false;
        this.selector = `[data-col="${this.col}"][data-row="${this.row}"]`;
        this.element = null;
        this.fromTop = null;
        this.fromLeft = null;
        this.width = null;
        this.height = null;
    }

    createElement() {
        const elementHtml = `<div class="boardCellDiv" data-cell data-col="${this.col}" data-row="${this.row}"></div>`;
        return elementHtml;
    }

    takeMeasurements() {
        if (!this.element) return
        // console.log('TOP:', this.element.offsetTop, 'LEFT:' , this.element.offsetLeft); 
        // console.log('PARENT: ', this.element.offsetParent);
        this.fromTop = this.element.offsetTop;
        this.fromLeft = this.element.offsetLeft;
        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;
    }

    assignClickListener() {
        if (!this.element) return
        this.element.addEventListener('click', ()=>{
            console.log(this.element);
            this.element.style.backgroundColor = "white";
            console.log('cell positioning: ', this.fromTop, this.fromLeft);
            console.log('cell dimentions: ', this.width, this.height);
        });
    }    

    getPosition() {
        return [this.fromTop, this.fromLeft];
    }

    getDimentions() {
        return [this.width, this.height];
    }

}