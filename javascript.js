
//---- Variables ---- //
//number 1
let number1;
//operator
let operator;
//number 2
let number2;

const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const utilityButtons = document.querySelectorAll(".utility");

const displayNumber = document.querySelector("#display-number");

for(const btn of numberButtons){
    btn.addEventListener("click", () => updateValue(btn));
}

//---- Functionality ---- //
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

function updateValue(btn){
    const value = btn.value;
    if(displayNumber.textContent === "0") displayNumber.textContent = value;
    else displayNumber.textContent += value;

}

//---- Math operations ----
function add(a, b){
    return a + b;
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

//clear

