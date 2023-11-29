const hackBox = document.querySelector('.hack-box');
const hackFunction = document.querySelector('.hack-fn');
const hackTitleBox = document.querySelector('.hack-title');
const hackTitle = document.getElementById('hack-title-text');
const hackInfoBox = document.querySelector('.hack-info');
const hackInfo = document.getElementById('hack-info-text');
const startButton = document.querySelector('.start-hack');
const buttons = document.querySelector('.play-buttons');
const progressBarBox = document.querySelector('.hack-progress')
const progressBarFn = document.getElementById('progress-bar-fn');
const hackOptions = document.querySelector('.hack-options');
const timer = document.querySelector(".timer");

const shuffleArray = (array) => array.map((a) => ({random: Math.random(), value: a})).sort((a, b) => a.random - b.random).map((a) => a.value);

var progressBarInterval, timerInterval, squareInterval;
var defaultPlayTime = 20;
var defaultSpeed = 300;
var playTime = document.querySelector(".time-input");
var speed = document.querySelector(".speed-input");
var game;

function hack() {
    hackInfoBox.style.display = 'none';
    hackFunction.style.display = 'none';
    progressBarBox.style.display = 'none';
    document.getElementById("time").textContent = String(defaultPlayTime);
    document.getElementById("speed").textContent = String(defaultSpeed);
}

function startHack() {
    let start = new Date();
    let updateTime = () => {
        timer.style.display = "block";
        let now = new Date();
        let diff = new Date();

        diff.setTime(now - start);
        timer.textContent = diff.getMinutes().toString().padStart("2", 0) + ":" + diff.getSeconds().toString().padStart("2", 0);
    }
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTime, 1000);
    hackOptions.style.display = 'none';
    buttons.style.display = 'none';
    game = new Minigame(speed.value);
    game.createSquares();
    hackTitleBox.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Przygotuj się...';
    progressBarBox.style.display = 'block';
    progressBar('start', 9);
}

function gameWin() {
    hackTitleBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack udany';
    clearInterval(squareInterval);
    progressBarBox.style.display = 'block';
    progressBar('end', 9);
}

function gameOver() {
    hackFunction.style.display = 'none';
    hackTitleBox.style.display = 'none';
    progressBarBox.style.display = 'block';
    hackInfoBox.style.display = '';
    clearInterval(squareInterval);
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
                hackTitleBox.style.display = '';
                hackTitle.textContent = 'Klikaj jak najszybciej!';
                hackFunction.style.display = '';
                game.generateNewSquare();
                hackInfoBox.style.display = 'none';
                progressBar('game', playTime.value);
                return;
            }
            if (w === 'game') {
                gameWin();
                return;
            }
            if (w === 'end') {
                hackFunction.style.display = 'none';
                hackTitleBox.style.display = 'none';
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

class Minigame {
    intervalSpeed;
    elementsCount = 49;
    squaresCount = 0;

    constructor(intervalSpeed){
        this.intervalSpeed = intervalSpeed;
    }

    createSquares(){
        hackFunction.innerHTML = "";

        for(let i = 0; i < this.elementsCount; i++) {
            const el = document.createElement("div");

            el.classList.add("square");
            el.setAttribute("id", i);
            hackFunction.appendChild(el);

            el.onclick = () => {
                if(!el.classList.contains("active")) gameOver();
                else {
                    el.classList.remove("active");
                    this.squaresCount--;
                }
            }
        }
    }

    generateNewSquare(){
        squareInterval = setInterval(() => {
            let random = Math.floor(Math.random() * 48);
            let el = document.getElementById(random);
    
            if(el.classList.contains("active")){
                let newEl = document.getElementById(random + 1);
                newEl.classList.add("active");
                this.squaresCount++;
            }else{
                el.classList.add("active");
                this.squaresCount++;
            };
    
            if(this.squaresCount > 10) gameOver();
        }, this.intervalSpeed)
    }
}

const speedChangeFunction = () => {
    document.getElementById("speed").textContent = document.querySelector(".speed-input").value;
}

const timeChangeFunction = () => {
    document.getElementById("time").textContent = document.querySelector(".time-input").value;
}
