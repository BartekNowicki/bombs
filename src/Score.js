
import TheDOM from './TheDOM.js';

export default class Score extends TheDOM {    
    constructor(value = 0) {
        super();
        this.value = value;
        this.element = null;
        this.init();
    }
    
    init() {
        this.element = this.getElement(this.DOMSelectors.score);
    }

    setValue(value) {
        this.value = value;
        this.updateValue();
    }

    updateValue() {
        this.element.textContent = `SCORE: ${this.value}`;
    }
}