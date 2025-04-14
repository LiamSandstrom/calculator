
//---- Variables ---- //
let number1 = null;
let operator = null;
let number2 = null;
let currentNumber = 0;
let newNumber = true;
let currentBtn = null;
let dot = false;

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const resetButton = document.querySelector(".reset-btn");
const displayNumber = document.querySelector("#display-number");

//---- Event Listeners----//
for(const btn of numberButtons){
    btn.addEventListener("click", () => numberBtnClicked(btn));
}

for(const btn of operatorButtons){
    btn.addEventListener("click", () => operatorBtnClicked(btn));
}

resetButton.addEventListener("click", clear);

//---- Functionality ---- //
function numberBtnClicked(btn){
    const value = btn.value;

    if(value === "."){
        dotBtnClicked();
        return;
    }

    let number;

    if (newNumber === true){
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
        number = currentNumber === 0 ? value : currentNumber + value;
    } 
    if(number == 0) return;
    updateValue(number);
}

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
    dot = true;
    updateValue(value);
}

function updateValue(val){
    currentNumber = val;
    displayNumber.textContent = currentNumber;
    console.log(currentNumber);
}

function operatorBtnClicked(btn){
    const value = btn.value;

    if (value === "="){
        // "=" should only work with all inputs
        if(operator === null || number2 === null) return;
        updateValue(operate(number1, currentNumber, operator));
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
        console.log(value)
    }

    //if we are on 2nd input
    else{
        updateValue(operate(number1, currentNumber, operator));
        number1 = currentNumber;
        operator = value;
        updateCurrentOperation(btn);
        number2 = null;
        dot = false;
        
    }

    newNumber = true;
}

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

function clear(){
    currentNumber = 0;
    displayNumber.textContent = currentNumber;
    newNumber = true;
    operator = null;
    number1 = null;
    number2 = null;
    dot = false;
    updateCurrentOperation();
}

//---- Math operations ----
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
