AddEventListeners();
let numArr = [0];
let operatorArr = [];
let tempNumbers = [];
let currentDisplayStr = '0';
let currentOperator = null;
let waitingForAction = false;
let freshResult = true;
let shiftDown = false;
const maxDigitDisplay = 11;

function Add (numbers) {
	return numbers[0] + numbers[1];
}

function Subtract (numbers) {
	return numbers[0] - numbers[1];
}

function Multiply (numbers) {
	return numbers[0] * numbers[1];
}

function Divide (numbers){
    return numbers[0] / numbers[1];
}

function NegativeOrPositive (){
    
    currentOperator = null;
    tempNumbers.length = 0;

    if(Number(currentDisplayStr) > 0){
        currentDisplayStr = '-' + currentDisplayStr;
        numArr.pop();
        numArr.push(Number(currentDisplayStr));
        SetDigitalDisplay();
    }
}

function Percentage(){
    
    tempNumbers.length = 0;
    currentDisplayStr = currentDisplayStr / 100;
    numArr.pop();
    numArr.push(Number(currentDisplayStr));
    SetDigitalDisplay();
    freshResult = true;
}

function Clear(){

    tempNumbers.length = 0;
    currentOperator = null;
    currentDisplayStr = '0';
    waitingForAction = false;
    document.getElementsByClassName("display-digits")[0].innerHTML = '0';
    numArr.length = 0;
    numArr.push(0);
}

function UpdateDisplay(numOrDec){
    
    if(freshResult){
        
        if(Number(currentDisplayStr) > 0 || Number(currentDisplayStr) < 0)
        {
            numArr.push(0);
        }
        tempNumbers.length = 0;
        waitingForAction = false;
        currentOperator = null;
        document.getElementsByClassName("display-digits")[0].innerHTML = '0';
        currentDisplayStr = '0';
        freshResult = false;
    }
    if(waitingForAction){

        if(operatorArr.length === numArr.length){
            operatorArr.pop();
        }
        operatorArr.push(currentOperator);
        tempNumbers.length = 0;
        document.getElementsByClassName("display-digits")[0].innerHTML = '0';
        currentDisplayStr = '0';
        numArr.push(0);
        waitingForAction = false;
    }

    if(numOrDec === '.' && Number.isInteger(Number(currentDisplayStr))){
        currentDisplayStr = currentDisplayStr + '' + numOrDec;
    }
    else if(currentDisplayStr === '0' && currentDisplayStr.length === 1){
        currentDisplayStr = numOrDec;
    }
    else if(numOrDec !== '.'){
        currentDisplayStr = currentDisplayStr + '' + numOrDec;
    }

    numArr[numArr.length - 1] = Number(currentDisplayStr);
    SetDigitalDisplay();
}

function SetDigitalDisplay(){
    
    let display = document.getElementsByClassName("display-digits")[0];

    if(currentDisplayStr === 'NaN' || currentDisplayStr === 'Infinity' ){
        currentDisplayStr = '0';
        numArr.length = 0;
        numArr.push(0);
        alert("ERROR");
    }
    if(currentDisplayStr.length > maxDigitDisplay){
        display.innerHTML = currentDisplayStr.slice(0, maxDigitDisplay);
    }
    else{
        display.innerHTML = currentDisplayStr;
    }
}

function CheckAndUpdateFormula(){

    let lastOperator = operatorArr[operatorArr.length - 1];

    if(tempNumbers.length === 0){
        tempNumbers.push(numArr[numArr.length - 2]);
        tempNumbers.push(numArr[numArr.length - 1]);

        switch (lastOperator){
            
            case 'divide':
                numArr.pop();
                numArr[numArr.length - 1] = Divide(tempNumbers);
                break;
    
            case 'multiply':
                numArr.pop();
                numArr[numArr.length - 1] = Multiply(tempNumbers);
                break;
            
            case 'add':
                if(currentOperator !== "multiply" && currentOperator !== 'divide'){
                    numArr.pop();
                    numArr[numArr.length - 1] = Add(tempNumbers);
                }
                break;
                
            case 'subtract':
                if(currentOperator !== 'multiply' && currentOperator !== 'divide'){
                    numArr.pop();
                    numArr[numArr.length - 1] = Subtract(tempNumbers);
                }
                break;
        }
    }
    else{

        switch (lastOperator){
            
            case 'add':
                if(currentOperator === 'multiply' || currentOperator === 'divide'){
                    if(numArr.length === operatorArr.length){
                        numArr[numArr.length - 1] = tempNumbers[0];
                        numArr.push(tempNumbers[1]);
                    }
                }
                else{
                    if(numArr.length !== operatorArr.length){
                        numArr.pop();
                        numArr[numArr.length - 1] = Add(tempNumbers);
                    }
                }
                break;

            case 'subtract':
                if(currentOperator === 'multiply' || currentOperator === 'divide'){
                    if(numArr.length === operatorArr.length){
                        numArr[numArr.length - 1] = tempNumbers[0];
                        numArr.push(tempNumbers[1]);
                    }
                }
                else{
                    if(numArr.length !== operatorArr.length){
                        numArr.pop();
                        numArr[numArr.length - 1] = Subtract(tempNumbers);
                    }
                }
        }
    }
    currentDisplayStr = numArr[numArr.length - 1].toString();
    SetDigitalDisplay();
}

function Operate(){

    let total = numArr[0];

    if(numArr.length === 1){
        numArr.push(numArr[0]);
    }
    tempNumbers.length = 0;
    currentOperator = null;
    waitingForAction = false;
    let numbers = [numArr[numArr.length - 2], numArr[numArr.length - 1]];

    switch(operatorArr[operatorArr.length - 1]){
        
        case 'multiply':
            if(operatorArr.length === 1){
                total = Multiply(numbers);
            }
            else{
                numArr.pop();
                numArr[numArr.length - 1] = Multiply(numbers);
            }
            break;

        case 'divide':
            if(operatorArr.length === 1){
                total = Divide(numbers);
            }
            else{
                numArr.pop();
                numArr[numArr.length - 1] = Divide(numbers);
            }
            break;
    }
    
    for(i = 0; i < operatorArr.length; i++){

        numbers = [total, numArr[i + 1]];

        switch(operatorArr[i]){

            case 'add':
                total = Add(numbers);
                break;

            case 'subtract':
                total = Subtract(numbers);
                break;
        }
    }
    
    operatorArr.length = 0;
    currentDisplayStr = total.toString();
    SetDigitalDisplay();
    numArr.length = 0;
    numArr.push(total);
    freshResult = true;
}

function AddEventListeners(){
    
    let buttons = document.getElementsByTagName("button");

    for(i = 0; i < buttons.length; i++){
        
        buttons[i].addEventListener("click", function(e){
            
            if(e.target.parentNode.parentNode.id == "nums-and-decimal"){
                LeftSideCheckID(e.target.id);
            }
            else{
                RightSideCheckID(e.target.id);
            }
        });
    }
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 48 || event.keyCode == 96) {
            UpdateDisplay('0');
        }
        else if(event.keyCode == 49 || event.keyCode == 97) {
            UpdateDisplay('1');
        }
        else if(event.keyCode == 50 || event.keyCode == 98) {
            UpdateDisplay('2');
        }
        else if(event.keyCode == 51 || event.keyCode == 99) {
            UpdateDisplay('3');
        }
        else if(event.keyCode == 52 || event.keyCode == 100) {
            UpdateDisplay('4');
        }
        else if(event.keyCode == 53 && !shiftDown || event.keyCode == 101) {
            UpdateDisplay('5');
        }
        else if(event.keyCode == 54 || event.keyCode == 102) {
            UpdateDisplay('6');
        }
        else if(event.keyCode == 55 || event.keyCode == 103) {
            UpdateDisplay('7');
        }
        else if(event.keyCode == 56 && !shiftDown || event.keyCode == 104) {
            UpdateDisplay('8');
        }
        else if(event.keyCode == 57 || event.keyCode == 105) {
            UpdateDisplay('9');
        }
        else if(event.keyCode == 187 && !shiftDown || event.keyCode == 13) {
            Operate();
        }
        else if(event.keyCode == 190 || event.keyCode == 110) {
            UpdateDisplay(".");
        }
        else if(event.keyCode == 187 && shiftDown|| event.keyCode == 107) {
            RightSideCheckID('add');
        }
        else if(event.keyCode == 111 || event.keyCode == 191) {
            RightSideCheckID("divide");
        }
        else if(event.keyCode == 189 || event.keyCode == 109) {
            RightSideCheckID('subtract');
        }
        else if(event.keyCode == 106 || shiftDown && event.keyCode == 56) {
            RightSideCheckID('multiply');
        }
        else if(event.keyCode == 8 || event.keyCode == 46) {
            RightSideCheckID('clear');
        }
        else if(shiftDown && event.keyCode == 53) {
            RightSideCheckID('percent');
        }
        else if(event.keyCode == 16){
            shiftDown = true;
        }
    });
    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 16){
            shiftDown = false;
        }
    });
}

function LeftSideCheckID(currentID){

    switch(currentID){

        case "one":
                UpdateDisplay('1');
                break;

        case "two":
                UpdateDisplay('2');
                break;

        case "three":
                UpdateDisplay('3');
                break;

        case "four":
                UpdateDisplay('4'); 
                break;

        case "five":
                UpdateDisplay('5'); 
                break;

        case "six":
                UpdateDisplay('6'); 
                break;

        case "seven":
                UpdateDisplay('7'); 
                break;

        case "eight":
                UpdateDisplay('8'); 
                break;

        case "nine":
                UpdateDisplay('9'); 
                break;

        case "zero":
                UpdateDisplay('0'); 
                break;

        case "equals":
                Operate();
                break;

        case "decimal":
                UpdateDisplay("."); 
                break;
    }
}

function RightSideCheckID(currentID){
    
    switch(currentID){

        case "add":
            currentOperator = 'add';
            freshResult = false;
            if(numArr.length > 1){
                CheckAndUpdateFormula();
            } 
            waitingForAction = true;
            break;

        case "subtract":
            currentOperator = 'subtract';
            freshResult = false;
            if(numArr.length > 1){
                CheckAndUpdateFormula();
            }
            waitingForAction = true;
            break;

        case "divide":
            currentOperator = 'divide';
            freshResult = false;
            if(numArr.length > 1){
                CheckAndUpdateFormula();
            }
            waitingForAction = true;
            break;

        case "multiply":
            currentOperator = 'multiply';
            freshResult = false;
            if(numArr.length > 1){
                CheckAndUpdateFormula();
            }
            waitingForAction = true;
            break;

        case "percent":
            Percentage();
            break;

        case "clear":
            Clear();
            break;

        case "neg-pos":
            NegativeOrPositive();
            break;
    }
}