/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-env node */
//------------------------------------------------------------------------------
//W RAZIE CZEGO WYWOŁANIE POZA TESTEM:  
// checkDOMelements()
//   .then(response => console.log(response)) 
//   .catch(console.log('błąd od razu, ale poczekajmy...'));
//------------------------------------------------------------------------------
//RAW SAMPLE
// const dom = new JSDOM(`<!DOCTYPE html><body>
//<p id="main" data-bonusImg>My First JSDOM!</p></body>`);
// console.log(dom.window.document.getElementById("main").textContent);  
//------------------------------------------------------------------------------
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';  // add custom jest matchers from jest-dom
import indexJestTestFunction  from './src/index.js'; 
import Game from './src/Game.js'; 



//------------------------------------------------------------------- 
//SAMPLE TESTS+++++++++++++++++++++++++++++++++++++++++++++++++++++++
//------------------------------------------------------------------- 
// const nameCheck = () => { 
//     console.log('checking name...');    
// }
// describe('checking names', () => {
//     beforeEach(() => nameCheck());    
//     test('user is Jeff', () => {
//         const user = 'Jeff';
//         expect(user).toBe('Jeff');
//     });
//     test('user is Karen', () => {
//         const user = 'Karen';
//         expect(user).toBe('Karen');
//     });
// });
//------------------------------------------------------------------- 
// FUNCTIONS EXPORTED TO VALIDATOR.TEST.JS ++++++++++++++++++++++++++
//------------------------------------------------------------------- 
const gameChecking = () => {
    const game = new Game;
    return game.jestTestingValue;
}

function checkDOMelements() {
    const fs = require('fs');
try {
  const data = fs.readFileSync('buildCopyForTest/index.html', 'utf8')
//   console.log(data)
return data
} catch (err) {
  console.error(err)
}    
        
    // document.body.innerHTML = `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    // <!-- <meta charset="UTF-8"> -->
    // <meta charset='UTF-8'>
    // <meta name="viewport" content="width=device-width, initial-scale=1.0">
    // <meta http-equiv="X-UA-Compatible" content="ie=edge">
    // <title>BOMBS BY BARTOSZ NOWICKI</title>
    // </head>
    // <body>
    // <main class="mainWrap" data-mainWrap>
    // <header>
    // <button class="playBtn convex" data-testid="playBtn">start</button>
    // <div class="score" data-score></div>
    // <div class="nextBlock">NEXT</div>
    // <div class="bonusDiv">
    //     <img class="bonusImg" src="" alt="" data-bonusImg>
    // </div>
    // </header>
    // <article class="gameBoard" data-gameBoard>
    //   <button class="dropBtn" data-dropBtn></button>
    // </article>
    // <footer class="controlls">
    //   <button class="moveLeftBtn" data-moveLeftBtn></button>
    //   <button class="rotateLeftBtn" data-rotateLeftBtn></button>
    //   <button class="rotateRightBtn" data-rotateRightBtn></button>
    //   <button class="moveRightBtn" data-moveRightBtn></button>
    // </footer>
    // </main>
    // <script src="js/main.a292df5035785353c660.js"></script></body>
    // </html>`;
    
}

const indexJestTestErrors = () => {
    throw new Error('FAKE ERROR EVERYTHING WORKS FINE'); 
}

const validatorFunctions = {
    add: (a, b) => a+b,
    indexCheckCommunication: indexJestTestFunction,
    indexCheckErrors: indexJestTestErrors,
    DOMcheck: checkDOMelements,
    gameCheck: gameChecking
}

export default validatorFunctions;
