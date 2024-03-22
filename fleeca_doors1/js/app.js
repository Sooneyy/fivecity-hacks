const hackBox = document.querySelector('.hack-box');
const hackFunctionBox = document.querySelector('.hack-fn-box');
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

const range = (start, end, length = end - start + 1) => {
    return Array.from({length}, (_, i) => start + i);
}

var progressBarInterval, timerInterval;
var playTime = 10;
var rememberTime = 10;
var gameStarted = false;
var height = 5;
var width = 5;
var wrong = 0;
var good = 0;

function hack() {
    hackInfoBox.style.display = 'none';
    hackFunctionBox.style.display = 'none';
    progressBarBox.style.display = 'none';
}

function startHack() {
    gameStarted = false;
    lastPosition = 0;
    wrong = 0;
    good = 0;
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
    buttons.style.display = 'none';
    hackTitle.innerHTML = '';
    hackTitleBox.style.display = 'none';
    hackOptions.style.display = "none";
    hackFunctionBox.style.display = 'none';
    hackFunctionBox.classList.remove("rotated");
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Przygotuj się...';
    progressBarBox.style.display = 'block';
    createGrid();
    progressBar('start', 8);
}

function gameWin() {
    hackTitleBox.style.display = 'none';
    hackFunctionBox.style.display = 'none';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack udany';
    progressBarBox.style.display = 'block';
    progressBar('end', 8);
}

function gameOver() {
    hackFunctionBox.style.display = 'none';
    hackTitleBox.style.display = 'none';
    progressBarBox.style.display = 'block';
    hackInfoBox.style.display = '';
    hackInfo.textContent = 'Hack nieudany'
    progressBar('end', 8);
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
                hackTitle.innerHTML = 'Zapamiętaj';
                hackFunctionBox.style.display = '';
                hackInfoBox.style.display = 'none';
                progressBar('next', rememberTime);
                return;
            }
            if (w === 'next') {
                hackTitle.innerHTML = 'Zaznacz';
                const active = document.querySelectorAll('.good');
                setTimeout(() => {
                    gameStarted = true;
                    document.getElementById("close").addEventListener("click", gameOver);
                }, 2000);

                active.forEach((el) => {
                    el.classList.remove('good')
                })

                progressBar('game', playTime);
            }
            if (w === 'game') {
                gameOver();
                return;
            }
            if (w === 'end') {
                hackFunctionBox.style.display = 'none';
                hackTitleBox.style.display = 'none';
                buttons.style.display = '';
                hackOptions.style.display = "";
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

function createGrid(){
    hackFunction.innerHTML = '';

    let array = range(0, height * width - 1);
    let shuffledArr = shuffleArray(array);
    let positions = shuffledArr.slice(0, 8);

    for(let i = 0; i < height * width; i++){
        const el = document.createElement('div');

        el.classList.add('square');
        el.dataset.pos = i;

        el.onclick = function(){
            if(!gameStarted) return;

            if(this.hasChildNodes()){
                if(this.firstChild.classList.contains('good')){
                    return;
                }else{
                    this.firstChild.classList.add('good');
                    good++;
                }
            }else{
                const wrongEl = document.createElement('div');
                wrongEl.classList.add('square2', 'wrong');
                this.appendChild(wrongEl);
                wrong++;
            }

            if(good === positions.length){
                gameWin();
            }

            if(wrong > 3){
                gameOver();
            }
        }

        hackFunction.appendChild(el)   
    }

    let squares = document.querySelectorAll('.square');

    positions.forEach((pos) => {
        squares[pos].innerHTML = `<div class='square2 good'></div>`;
    })
}


