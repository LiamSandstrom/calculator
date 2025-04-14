
//---- Variables ---- //
//number 1
let number1;
//operator
let operator;
//number 2
let number2;


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

function updateValue(){

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

