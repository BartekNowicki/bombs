/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-env node */
import validatorFunctions from './validator.js';


//------------------------------------------------------------------- 
//SAMPLE TESTS+++++++++++++++++++++++++++++++++++++++++++++++++++++++
//------------------------------------------------------------------- 
// test('adds 2+2 to equal 4', () => {
//     expect(validatorFunctions.add(2, 2)).toBe(4);
// });
//------------------------------------------------------------------- 
//APP TESTS++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//------------------------------------------------------------------- 
    
test('INDEX COMMUNICATES', async () => {
    expect.assertions(1);
    const data = await validatorFunctions.indexCheckCommunication();
    // expect(data).not.toBeNull(); 
    // expect(data).toBeDefined();
    return expect(Promise.resolve(data)).resolves.toBe(999); 
});

test('INDEX DOES NOT ERROR OUT', () => {
    // expect.assertions(1);
    expect(() => validatorFunctions.indexCheckErrors()).toThrow('FAKE ERROR EVERYTHING WORKS FINE');
    });
//-------------------------------------------------------------------
test('CHECKING GAME CLASS', () => {
    expect.assertions(1);
    expect(validatorFunctions.gameCheck()).toBe(999);
});

test('DOM ELEMENTS PRESENT', async () => {
    // expect.assertions(1);
    const DOM = await validatorFunctions.DOMcheck();
    // console.log(typeof(DOM), DOM);
    expect(DOM).toContain('mainWrap');
});
