const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copy = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// Set strength circle color to gray
setIndicator("#ccc");

// Set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

// set indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = "0px 0px 12px 1px ${color}";
}

// generate random int
function getRandInt(min, max){
    // floor -> round-off
    Math.floor(Math.random() * (max - min)) + min;
}

// generate random number
function getRandNum(){
    return getRandInt(0,9);
}

// generate random lower case letters
function getLowerCase(){
    return String.fromCharCode(getRandInt(97,123));
}

// generate random upper case letters
function getUpperCase(){
    return String.fromCharCode(getRandInt(65,91));
}

// generate random symbols
function getSymbols(){
    const randNum = getRandInt(0, symbols.length);
    return symbols.charAt(randNum);
}

// calculating strength of password
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }

    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ){
        setIndicator("#ff0");
    }

    else{
        setIndicator("#f00");
    }
}

// copy generated password to clipboard
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Password copied successfully!";
    }

    catch(e){
        copyMsg.innerText = "Password couldn't be copied!";
    }

    // make msg visible
    copyMsg.classList.add("active");

    // make msg bye bye
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){
    // Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--){
        // find another index j randomly
        const j = Math.floor(Math.random() * (i + 1));
        // swap
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str + el));

    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // special case
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copy.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generatBtn.addEventListener('click', () => {
    // none of the checkbox is selected
    if(checkCount == 0) 
        return;

    // generating password
    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(getUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(getUpperCase);

    if(numbersCheck.checked)
        funcArr.push(getUpperCase);

    if(symbolCheck.checked)
        funcArr.push(getUpperCase);

    // compulsory addition
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for(let i = 0; i < passwordLength - funcArr.length; i++){
        let randIndex = getRandInt(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    calcStrength();
})