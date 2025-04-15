
/* 
TODO:
1. Make big numbers use e

2. Hover should increase brightness of buttons
*/

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const resetButton = document.querySelector(".reset-btn");
const displayNumber = document.querySelector("#display-number");
const displayWrapper = document.querySelector(".display-wrapper");
const popButton = document.querySelector(".pop-btn");
const signChangeButton = document.querySelector(".sign-change-btn");

//---- Variables ---- //
let number1 = null;
let operator = null;
let number2 = null;
let currentNumber = 0;
let newNumber = true;
let currentBtn = null;
let dot = false;
const maxFontSize = window.getComputedStyle(displayNumber).fontSize; 
const minFontSize = (parseFloat(maxFontSize) / 1.7) + "px";
let currentFontSize = maxFontSize;
const decimalLimit = 8;


//---- Event Listeners----//
for(const btn of numberButtons){
    btn.addEventListener("click", () => numberBtnClicked(btn));
}
for(const btn of operatorButtons){
    btn.addEventListener("click", () => operatorBtnClicked(btn));
}

resetButton.addEventListener("click", clear);
signChangeButton.addEventListener("click", signChangeClicked);
popButton.addEventListener("click", popButtonClicked);


//---- Functionality ---- //
function numberBtnClicked(btn){
    const value = btn.value;
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
        // "=" should only work with all inputs
        resetFontSize();
        if(operator === null || number2 === null) return;
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
    let oldValue = currentNumber;
    if(calc) val = convertBigNumber(val);
    //val = limitDecimals(val);
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
    }
    return returnNumber;
}

//---- Buttons ----///
function dotBtnClicked(){
    console.log(dot + " dot!");
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
    console.log("pop");
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
    console.log("scale")
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
    console.log(a* b)
    return a * b;
}
function divide(a, b){
    return a / b;
}


//---- Effects ----//
function updateCurrentOperation(btn = null){
    if(currentBtn !== null){
        const colorOld = window.getComputedStyle(currentBtn).color;
        const backgroundColorOld = window.getComputedStyle(currentBtn).backgroundColor;
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
