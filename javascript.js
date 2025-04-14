
//---- Variables ---- //
let number1 = null;
let operator = null;
let number2 = null;
let currentNumber = 0;
let newNumber = true;
let currentBtn = null;

const buttons = document.querySelectorAll("button");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const resetButton = document.querySelector(".reset-btn");
const displayNumber = document.querySelector("#display-number");
//---- Event Listeners----//
for(const btn of buttons){
    //btn.addEventListener("click", () => updateCurrentOperation(btn));
}

for(const btn of numberButtons){
    btn.addEventListener("click", () => numberBtnClicked(btn));
}

for(const btn of operatorButtons){
    btn.addEventListener("click", () => updateOperator(btn));
}

resetButton.addEventListener("click", clear);

//---- Functionality ---- //
function numberBtnClicked(btn){
    const value = btn.value;
    let number;
    if (newNumber === true){
        if(value == 0){
            updateValue(0);
        }
        number = value;
        newNumber = false;

        //sets number 2 to something as we check if number2 is null
        if(number1 != null){
            number2 = number;
        }
    } 
    //keep adding numbers
    else{
        number = currentNumber == 0 ? value : currentNumber + value;
    } 
    console.log(currentNumber);
    if(number == 0) return;
    updateValue(number);
}
function updateValue(val){
    currentNumber = val;
    displayNumber.textContent = currentNumber;
}

function updateOperator(btn){
    const value = btn.value;

    if (value === "="){
        // "=" should only work with all inputs
        if(operator === null || number2 === null) return;
        updateValue(operate(number1, currentNumber, operator));
        operator = null;
        number1 = null;
        number2 = null;
        updateCurrentOperation();
    }

    else if(number2 === null){
        number1 = currentNumber;
        operator = value;
        updateCurrentOperation(btn);
        console.log(value)
    }

    else if(number2 != null){
        updateValue(operate(number1, currentNumber, operator));
        number1 = currentNumber;
        operator = value;
        updateCurrentOperation(btn);
        number2 = null;
        
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
