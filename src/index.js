import './sass/index.scss';
import Game from './Game.js';
let jestTestingVariable = 999;

const init = () => {
    if (document.querySelector(".playBtn")) {
        const playBtn = document.querySelector(".playBtn");
        // eslint-disable-next-line no-unused-vars
        const game = new Game(playBtn);
        // console.log(game.progress);
        // console.log(playBtn);
    } else throw new Error('unable to find required DOM elements');
}

window.onload = init();

const indexJestTestFunction = () => jestTestingVariable;
export default indexJestTestFunction;
