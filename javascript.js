
/* 
TODO:
1. Keyboard support
2. add pulsation to body background
*/

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const squareColors = ["rgb(234, 157, 34)", "rgb(210, 134, 27)", "rgb(217, 130, 17)"];

const background = document.querySelector(".background");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const resetButton = document.querySelector(".reset-btn");
const displayNumber = document.querySelector("#display-number");
const displayWrapper = document.querySelector(".display-wrapper");
const popButton = document.querySelector(".pop-btn");
const signChangeButton = document.querySelector(".sign-change-btn");
const orange = window.getComputedStyle(document.querySelector(".operator")).backgroundColor;
const title = document.querySelector("#title");
const buttons = document.querySelectorAll("button");

//---- Variables ---- //
let titleInterval;
let number1 = null;
let operator = null;
let number2 = null;
let currentNumber = 0;
let newNumber = true;
let currentBtn = null;
let isBlackHole = false;
let dot = false;
const baseBackgroundColor = window.getComputedStyle(document.body).backgroundColor;
const maxFontSize = window.getComputedStyle(displayNumber).fontSize; 
const minFontSize = (parseFloat(maxFontSize) / 1.7) + "px";
let currentFontSize = maxFontSize;
const decimalLimit = 8;
const titleText = title.textContent;
const style = window.getComputedStyle(document.body);
const numberBackgroundColor = style.getPropertyValue("--button-number-color");
const utilityBackgroundColor = style.getPropertyValue("--button-utility-color");
const operatorBackgroundColor = style.getPropertyValue("--button-utility-color");



//---- Event Listeners----//
window.addEventListener("keydown", (e) => {
    if(Number.isInteger(parseInt((e.key)))){
        numberBtnClicked(e.key)
    }
})

for(const btn of buttons){
    btn.addEventListener("mouseover", () => buttonHoverEffect(btn))
    btn.addEventListener("mouseleave", () => buttonLeaveEffect(btn));
}
for(const btn of numberButtons){
    btn.addEventListener("click", () => btnToValue(btn));
}
for(const btn of operatorButtons){
    btn.addEventListener("click", () => operatorBtnClicked(btn));
}

title.addEventListener("mouseenter", hoverTitle);
resetButton.addEventListener("click", clear);
signChangeButton.addEventListener("click", signChangeClicked);
popButton.addEventListener("click", popButtonClicked);
window.addEventListener("resize", createDivs);

createDivs();
const baseSquareColor = window.getComputedStyle(document.querySelector(".square")).backgroundColor;


//---- Functionality ---- //
function btnToValue(btn){
    numberBtnClicked(btn.value);
}

function numberBtnClicked(val){
    const value = val;
    if(value === "."){
        dotBtnClicked();
        return;
    }
    let number;

    if (newNumber === true){
        resetFontSize();
        if(value == 0){
            updateValue(0);
        }
        number = value;
        newNumber = false;
        //we need a 2nd input and this acts like a bool that checks if we have a 2nd input or not
        if(number1 != null){
            number2 = number;
        }
    } 
    else{
        //fix so its 1 instead of 01 etc.
        if(currentNumber == 0){
            if(dot) number = currentNumber + value;
            else number = value;
        }
        else number = currentNumber + value;
    } 
    if(number === 0) return;
    updateValue(number);
}
function operatorBtnClicked(btn){
    const value = btn.value;

    if (value === "="){
        if(isBlackHole) removeBlackHole();
        // "=" should only work with all inputs
        if(operator === null || number2 === null) return;
        resetFontSize();
        updateValue(parseFloat(operate(number1, currentNumber, operator)), true);
        operator = null;
        number1 = null;
        number2 = null;
        dot = false;
        updateCurrentOperation();
    }

    //if we are on 1st input
    else if(number2 === null){
        number1 = currentNumber;
        operator = value;
        updateCurrentOperation(btn);
    }

    //if we are on 2nd input
    else{
        if(isBlackHole) removeBlackHole();
        resetFontSize();
        updateValue(operate(number1, currentNumber, operator), true);
        number1 = currentNumber;
        operator = value;
        updateCurrentOperation(btn);
        number2 = null;
        dot = false;
    }

    newNumber = true;
}
function updateValue(val, calc = false){
    if(val == Infinity || val == -Infinity || isNaN(val)){
        currentNumber = "Black Hole";
        displayNumber.textContent = currentNumber;
        blackHole();
        return;
    }
    let oldValue = currentNumber;
    if(calc) val = convertBigNumber(val);
    //else val = limitDecimals(val);
    currentNumber = val;
    displayNumber.textContent = currentNumber;
    if(!scaleDisplaySize()){
        currentNumber = oldValue;
        displayNumber.textContent = currentNumber;
    }
    if(!currentNumber.toString().includes(".")) dot = false;
    else dot = true;
}

//---- functionality helpers ----//
function limitDecimals(val){
    let numberStr = val.toString();
    if(numberStr.includes(".")){
        let wholeNumbers = numberStr.split(".")[0];
        let decimals = numberStr.split(".")[1];
        if(decimals.length > decimalLimit){
            decimals = decimals.slice(0, decimalLimit);
        }
        return wholeNumbers + "." + decimals;
    }
    return val;
}
function convertBigNumber(val){
    const strNumber = val.toString();
    let returnNumber = strNumber;
    if(strNumber.length > 9 || strNumber.includes("e")){
        let len = strNumber.length; 
        let eAmount = strNumber.includes("e") ? true : false;
        //if calculation has e in it wee need to get that e value
        // and w
        if(eAmount){
            let eIndex = strNumber.split("").lastIndexOf("e");
            let eValue = strNumber.slice(eIndex + 2);
            let len = strNumber.slice(0, eIndex).length - 3;
            len = parseFloat(len) + parseFloat(eValue);
            returnNumber = strNumber.slice(0, 1);
            returnNumber += strNumber.slice(1,3);
            returnNumber += `e${len}`
        }
        else if(val > 999999999){
            returnNumber = strNumber.slice(0, 1);
            returnNumber += "." + strNumber.slice(1,2);
            returnNumber += `e${len - 1}`
        }
        else{
            returnNumber =limitDecimals(val);
        }
    }
    return returnNumber;
}
function randomNumber(max){
    return Math.floor(Math.random() * max);
}

//---- Buttons ----///
function dotBtnClicked(){
    if(dot) return;
    let value;
    if(newNumber === true){
        value = "0.";
        newNumber = false;
    }
    else{
        value = currentNumber + ".";
    }
    updateValue(value);
}
function clear(){
    currentNumber = 0;
    displayNumber.textContent = currentNumber;
    newNumber = true;
    operator = null;
    number1 = null;
    number2 = null;
    dot = false;
    updateCurrentOperation();
    resetFontSize();
}
function signChangeClicked(){
    if(currentNumber != 0){
        updateValue(currentNumber * -1);
    }
}
function popButtonClicked(){
    let strNumber = currentNumber.toString(); 
    if(strNumber.length > 1){
        strNumber = parseFloat(strNumber.slice(0, strNumber.length - 1));
        updateValue(strNumber);
    }
    else{
        updateValue(0);
    }
}

//---- Adjustable Display Size ----//
function scaleDisplaySize(){
        if(currentFontSize <= parseFloat(minFontSize)){
            return false;
        }
    while(displayNumber.clientWidth  >= displayWrapper.clientWidth){
       currentFontSize = parseFloat(window.getComputedStyle(displayNumber).fontSize) - 1;      
       displayNumber.style.fontSize = currentFontSize + "px";
       displayNumber.style.paddingTop = parseFloat(maxFontSize) - currentFontSize + "px";
    }
    
    return true;
}
function resetFontSize(){
    currentFontSize = maxFontSize;
    displayNumber.style.fontSize = currentFontSize;
    displayNumber.style.paddingTop = 0;
}


//---- Math operations ----
function operate(a, b, operation){
    switch (operation){
        case("+"):
            return add(a, b);
        case("-"):
            return subtract(a, b);
        case("*"):
            return multiply(a, b);
        case("/"):
            return divide(a, b);
        default:
            return NaN;
    }
}
function add(a, b){
    return +a + +b;
}
function subtract(a, b){
    return a - b;
}
function multiply(a, b){
    return a * b;
}
function divide(a, b){
    return a / b;
}


//---- Effects ----//
function updateCurrentOperation(btn = null){
    if(currentBtn !== null){
        const colorOld = orange;
        const backgroundColorOld = "white";
        currentBtn.style.backgroundColor = colorOld;
        currentBtn.style.color = backgroundColorOld;
    }

    if(btn === null){
        currentBtn = null;
        return;
    }

    currentBtn = btn;
    const color = window.getComputedStyle(btn).color;
    const backgroundColor = window.getComputedStyle(btn).backgroundColor;
    btn.style.backgroundColor = color;
    btn.style.color = backgroundColor;
}
function buttonHoverEffect(btn){
    if(btn === currentBtn) return;
    if(btn.className == "operator"){
        btn.style.backgroundColor = style.getPropertyValue("--button-hover-operator-color");
    }
    else if(btn.className.includes("utility")){
        btn.style.backgroundColor = style.getPropertyValue("--button-hover-utility-color");
    }
    else {
        btn.style.backgroundColor = style.getPropertyValue("--button-hover-number-color");
    }
}
function buttonLeaveEffect(btn){
    if(btn === currentBtn) return;
    if(btn.className == "operator"){
        btn.style.backgroundColor = style.getPropertyValue("--button-operator-color");
    }
    else if(btn.className.includes("utility")){
        btn.style.backgroundColor = style.getPropertyValue("--button-utility-color");
    }
    else {
        btn.style.backgroundColor = style.getPropertyValue("--button-number-color");
    }

}
function hoverTitle(){
    let i = -12;
    title.style.color = orange;
    clearInterval(titleInterval);
    titleInterval = setInterval(() => {
    title.textContent = title.textContent.split("")
    .map((letter, index) => {
        if(index > i){
            return randomNumber(9);
        }
        else{
            return titleText.charAt(index)
        }
    })
    .join("");
    if(i > title.textContent.length){
        title.style.color = "white";
        clearInterval(titleInterval);
    } 
    
    if(!isBlackHole) i += 1;
    },25);
}
function blackHole(){
    document.body.style.backgroundColor = "rgb(242, 241, 224)";
    hoverTitle(true);
    for(const square of background.children){
        square.style.backgroundColor = "black";
        isBlackHole = true;
    }
}
function removeBlackHole(){
    document.body.style.backgroundColor = baseBackgroundColor;
    for(const square of background.children){
        square.style.backgroundColor = baseSquareColor;
        isBlackHole = false;
    }
}

//---- Background ----//
function createDivs(){
    while(background.firstChild){
        background.firstChild.remove();
    }

    //let width = parseFloat(window.getComputedStyle(background).width) / 20 + "px";
    let width = "50px";
    let height = width;
    let squaresToFillWidth = Math.ceil(parseFloat(window.getComputedStyle(background).width) /  parseFloat(width));
    let squaresToFillHeight = Math.ceil(parseFloat(window.getComputedStyle(background).height) /  parseFloat(height));
    const amount = squaresToFillWidth * squaresToFillHeight;

    for(let i = 0; i < amount; i++){
        const div = document.createElement("div");
        div.style.width = width;
        div.style.height = height;
        div.classList.add("square");
        div.addEventListener("mouseenter", () => squareHover(div));
        div.addEventListener("mouseleave", () => squareLeave(div));
        background.append(div);
        if(isBlackHole) div.style.backgroundColor = "black";
    }
}
function squareHover(square){
    let rand = randomNumber(squareColors.length);
    square.style.transition = "background 0s";
    square.style.backgroundColor = squareColors[rand];
}
function squareLeave(square){
    square.style.transition = "background 1s";
    if(isBlackHole)square.style.backgroundColor = "black";
    else square.style.backgroundColor = baseSquareColor;
}