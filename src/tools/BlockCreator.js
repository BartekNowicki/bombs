export default class blockCreator {
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('block');
    this.parent = document.querySelector('.gameBoard');
    this.parent.appendChild(this.element);    
  }
}