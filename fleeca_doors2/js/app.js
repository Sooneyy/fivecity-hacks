const hackBox = document.querySelector('.hack-box');
const hackFunction = document.querySelector('.hack-fn');
const hackFunction2 = document.querySelector('.hack-fn2');
const hackInfoBox = document.querySelector('.hack-info');
const hackInfo = document.getElementById('hack-info-text');
const startButton = document.querySelector('.start-hack');
const buttons = document.querySelector('.play-buttons');
const progressBarBox = document.querySelector('.hack-progress')
const progressBarFn = document.getElementById('progress-bar-fn');
const hackOptions = document.querySelector('.hack-options');
const modal = document.querySelector('.modal-mask');
const rightAnswer = document.querySelector('.right-answer');
const timer = document.querySelector(".timer");
const input = document.getElementById("input");

const shuffleArray = (array) => array.map((a) => ({random: Math.random(), value: a})).sort((a, b) => a.random - b.random).map((a) => a.value);

var progressBarInterval, timerInterval;
var playTime = 10;
var rememberTime = 5;
var defaultSquaresCount = 4;
var squaresCount = document.querySelector(".tile-input");
var defaultLevels = 2;
var levels = document.querySelector(".level-input");
var level = 0;
var antiSolverMode = false;
var colors = ["czarny","bialy","czerwony","zolty","niebieski","pomaranczowy","fioletowy","zielony"];
var shapes = ["kwadrat", "trojkat", "prostokat", "kolo"];
var questionTypes = [
    { 'type': "backgroundColor", 'text': "kolor tla" },
    { 'type': "textColorColor", 'text': "kolor napisanego koloru" },
    { 'type': "numberColor", 'text': "kolor numeru" },
    { 'type': "shapeColor", 'text': "kolor ksztaltu" },
    { 'type': "innerShape", 'text': "ksztalt pod tekstem" },
    { 'type': "innerShapeColor", 'text': "kolor ksztaltu pod tekstem" },
    { 'type': "textShape", 'text': "napisany ksztalt" },
    { 'type': "textShapeColor", 'text': "kolor tekstu napisanego ksztaltu" },
    { 'type': "textColor", 'text': "napisany kolor" },
    { 'type': "shape", 'text': "ksztalt" },
];
var realNumbers;
var items = [];
var questions;
var answers;

function hack() {
    hackInfoBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackFunction2.style.display = 'none';
    progressBarBox.style.display = 'none';
    modal.style.display = 'none';
    document.getElementById("level").textContent = String(defaultLevels);
    document.getElementById("tile").textContent = String(defaultSquaresCount);
}

function startHack() {
    isOver = false;
    lastPosition = 0;
    wrong = 0;
    level = 0;
    let start = new Date();
    let updateTime = () => {
        timer.style.display = "block";
        let now = new Date();
        let diff = new Date();

        diff.setTime(now - start);
        timer.textContent = diff.getMinutes().toString().padStart("2", 0) + ":" + diff.getSeconds().toString().padStart("2", 0);
    }
    clearInterval(timerInterval);
    generateElements();
    input.value = "";
    timerInterval = setInterval(updateTime, 1000);
    hackOptions.style.display = 'none';
    buttons.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Przygotuj się...';
    progressBarBox.style.display = 'block';
    progressBar('start', 9);
}

function gameWin() {
    hackFunction.style.display = 'none';
    hackFunction2.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack udany';
    progressBarBox.style.display = 'block';
    progressBar('end', 9);
}

function gameOver() {
    hackFunction.style.display = 'none';
    hackFunction2.style.display = 'none';
    progressBarBox.style.display = 'block';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack nieudany'
    progressBar('end', 9);
}

function progressBar(w, t) {
    let width = 1000;
    function updateProgress() {
        if (width > 0) {
            if (w === 'start' || w === 'end') width -= 3;
            else width--;
            progressBarFn.style.width = (width * 100) / 1000 + '%';
        } else {
            if (w === 'start') {
                hackFunction.style.display = '';
                hackInfoBox.style.display = 'none';
                generateSquares();
                generateQuestions();
                for(let i = 1; i <= squaresCount.value; i++){
                    const group = document.querySelector(".g" + i);
                    const el1 = group.querySelector(".real-number");
                    const el2 = group.querySelector(".text-color");
                    const el3 = group.querySelector(".shape");
                    const el4 = group.querySelector(".text-shape");
                    const el5 = group.querySelector(".inner-shape");
                    const el6 = group.querySelector(".number");

                    el1.classList.remove("hidden");
                    el2.classList.add("hidden");
                    el3.classList.add("hidden");
                    el4.classList.add("hidden");
                    el5.classList.add("hidden");
                    el6.classList.add("hidden");
                }
                const number = document.querySelectorAll(".real-number");
                setTimeout(() => {
                    for(let el of number){
                        el.style.fontSize = "0";
                    }
                }, (rememberTime * 1000) - (rememberTime * 1000 / 3));
                progressBar('remember', rememberTime);
                return;
            }
            if(w === 'remember'){
                for(let i = 1; i <= squaresCount.value; i++){
                    const group = document.querySelector(".g" + i);
                    const el1 = group.querySelector(".real-number");
                    const el2 = group.querySelector(".text-color");
                    const el3 = group.querySelector(".shape");
                    const el4 = group.querySelector(".text-shape");
                    const el5 = group.querySelector(".inner-shape");
                    const el6 = group.querySelector(".number");

                    el1.classList.add("hidden");
                    el2.classList.remove("hidden");
                    el3.classList.remove("hidden");
                    el4.classList.remove("hidden");
                    el5.classList.remove("hidden");
                    el6.classList.remove("hidden");
                }
                hackInfoBox.style.display = 'none';
                hackFunction2.style.display = '';
                document.getElementById("close").addEventListener("click", gameOver);
                progressBar('game', playTime);
                return;
            }
            if (w === 'game') {
                gameOver();
                return;
            }
            if (w === 'end') {
                hackFunction.style.display = 'none';
                hackFunction2.style.display = 'none';
                hackOptions.style.display = '';
                buttons.style.display = '';
                progressBarBox.style.display = 'none';
                hackInfoBox.style.display = 'none';
                timer.style.display = "none";
                document.getElementById("close").removeEventListener("click", gameOver);
            }
        }
    }

    clearInterval(progressBarInterval);
    progressBarInterval = setInterval(updateProgress, t)
}

function generateElements(){
    hackFunction.innerHTML = '';

    for(let i = 0; i < squaresCount.value; i++) {
        const group = document.createElement("div");

        group.classList.add("g" + (i + 1));
        hackFunction.appendChild(group);

        const el1 = document.createElement("div");
        const el2 = document.createElement("div");
        const el3 = document.createElement("div"); 
        const el4 = document.createElement("div");
        const el5 = document.createElement("div");
        const el6 = document.createElement("div");

        el1.classList.add("real-number");
        group.appendChild(el1);

        el2.classList.add("shape");
        group.appendChild(el2);

        el3.classList.add("text-color");
        group.appendChild(el3);

        el4.classList.add("text-shape");
        group.appendChild(el4);

        el5.classList.add("inner-shape");
        group.appendChild(el5);

        el6.classList.add("number");
        group.appendChild(el6);
    }
}

function generateSquares(){
    let numbers = [];
    for(let i = 1; i <= squaresCount.value; i++) numbers.push(i);

    realNumbers = shuffleArray(numbers);
    let randomNumbers = shuffleArray(numbers);
    items = [];

    for(let i = 0; i < squaresCount.value; i++){
        const el1 = document.querySelector(".g" + (i + 1));
        const el2 = document.querySelectorAll(".real-number")[i];
        const el3 = document.querySelectorAll(".text-color")[i];
        const el4 = document.querySelectorAll(".shape")[i];
        const el5 = document.querySelectorAll(".text-shape")[i];
        const el6 = document.querySelectorAll(".inner-shape")[i];
        const el7 = document.querySelectorAll(".number")[i];

        let background = colors[Math.floor(Math.random() * colors.length)];
        let textColorColor = colors[Math.floor(Math.random() * colors.length)];
        let numberColor = colors[Math.floor(Math.random() * colors.length)];
        let shape = shapes[Math.floor(Math.random() * shapes.length)];
        let shapeColor = colors[Math.floor(Math.random() * colors.length)];
        let textShape = shapes[Math.floor(Math.random() * shapes.length)];
        let innerShapeColor = colors[Math.floor(Math.random() * colors.length)];
        let textShapeColor = colors[Math.floor(Math.random() * colors.length)];
        let textColor = colors[Math.floor(Math.random() * colors.length)];
        let innerShape = shapes[Math.floor(Math.random() * shapes.length)];

        if(background === shapeColor) shapeColor = colors[colors.indexOf(shapeColor) + 1 < colors.length ? colors.indexOf(shapeColor) + 1 : colors.indexOf(shapeColor) - 1];
        if(shapeColor === innerShapeColor) innerShapeColor = colors[colors.indexOf(shapeColor) + 1 < colors.length ? colors.indexOf(shapeColor) + 1 : colors.indexOf(shapeColor) - 1];

        el1.classList.add("bg-" + background);

        el2.textContent = realNumbers[i];

        el3.textContent = textColor;
        el3.classList.add(textColorColor);

        el4.classList.add(shape);
        el4.classList.add("bg-" + shapeColor);

        el5.textContent = textShape;
        el5.classList.add(textShapeColor);

        el6.classList.add(innerShape);
        el6.classList.add("bg-" + innerShapeColor);

        el7.textContent = randomNumbers[i];
        el7.classList.add(numberColor);

        items.push(realNumbers[i], {
            backgroundColor: background,
            textColorColor: textColorColor,
            numberColor: numberColor,
            shape: shape,
            shapeColor: shapeColor,
            textShape: textShape,
            innerShapeColor: innerShapeColor,
            textShapeColor: textShapeColor,
            textColor: textColor,
            innerShape: innerShape,
            number: randomNumbers[i]
        });
    }
}

function generateQuestions(){
    let questionType = shuffleArray(questionTypes);
    questions = questionType.slice(0, 2);
    answers = [];

    for(let i = 0; i < questions.length; i++){
        const question = document.querySelector(".q" + (i + 1));
        let random = realNumbers[Math.floor(Math.random() * 4)];
        question.textContent = "";
        question.textContent = questions[i].text + " " + "(" + random + ")";
        
        answers.push(items[items.indexOf(random) + 1][questions[i].type]);  
    }

    rightAnswer.innerHTML = `<div>Poprawne rozwiązanie:</div> <div>${answers[0]} ${answers[1]}</div>`
}

function checkAnswer(){
    let answer = input.value.split(" ");

    if(answer[0] === answers[0] && answer[1] === answers[1]){
        level++;
        if(level < levels.value){
            hackFunction2.style.display = 'none';
            input.value = "";
            generateElements();
            generateSquares();
            generateQuestions();
            for(let i = 1; i <= 4; i++){
                const group = document.querySelector(".g" + i);
                const el1 = group.querySelector(".real-number");
                const el2 = group.querySelector(".text-color");
                const el3 = group.querySelector(".shape");
                const el4 = group.querySelector(".text-shape");
                const el5 = group.querySelector(".inner-shape");
                const el6 = group.querySelector(".number");

                el1.classList.remove("hidden");
                el2.classList.add("hidden");
                el3.classList.add("hidden");
                el4.classList.add("hidden");
                el5.classList.add("hidden");
                el6.classList.add("hidden");
            }
            const number = document.querySelectorAll(".real-number");
            setTimeout(() => {
                for(let el of number){
                    el.style.fontSize = "0";
                }
            }, (rememberTime * 1000) - (rememberTime * 1000 / 3));
            progressBar('remember', rememberTime);
        }else{
            gameWin();
        }
    }else{
        modal.style.display = '';
        progressBar("game", 3);
    }
}

function random(max, min) {
    return Math.floor(Math.random() * (max - min)) + min;
}

document.addEventListener("keyup", (e) => {
    let key = e.key;

    if(key === "Enter"){
        checkAnswer();
    }
})

function modalClose(){
    modal.style.display = "none";
}

function levelChangeFunction(){
    document.getElementById("level").textContent = document.querySelector(".level-input").value;
}

function tileChangeFunction(){
    document.getElementById("tile").textContent = document.querySelector(".tile-input").value;
}
