export default class TheDOM {
constructor() {    
    this.DOMSelectors = {
        bonusImg: "[data-bonusImg]",
        board: "[data-gameBoard]",
        score: "[data-score]",
        wrap: "[data-mainWrap]",
        moveLeftBtn: "[data-moveLeftBtn]",
        rotateLeftBtn: "[data-rotateLeftBtn]",
        rotateRightBtn: "[data-rotateRightBtn]",
        moveRightBtn: "[data-moveRightBtn]",
        dropBtn: "[data-dropBtn]",
        
    }        
    }  

    getElement(selector) {
        return document.querySelector(selector);
    }

    getElements(selector) {
        return document.querySelectorAll(selector);
    }
}

