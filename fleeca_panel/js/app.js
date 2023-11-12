const hackBox = document.querySelector('.hack-box');
const hackFunction = document.querySelector('.hack-fn');
const hackFunction2 = document.querySelector('.hack-fn2');
const hackTitleBox = document.querySelector('.hack-title');
const hackTitle = document.getElementById('hack-title-text');
const hackInfoBox = document.querySelector('.hack-info');
const hackInfo = document.getElementById('hack-info-text');
const startButton = document.querySelector('.start-hack');
const buttons = document.querySelector('.play-buttons');
const progressBarBox = document.querySelector('.hack-progress')
const progressBarFn = document.getElementById('progress-bar-fn');
const hackOptions = document.querySelector('.hack-options');
const modal = document.getElementById('modal');
const timer = document.querySelector(".timer");

const shuffleArray = (array) => array.map((a) => ({random: Math.random(), value: a})).sort((a, b) => a.random - b.random).map((a) => a.value);

var progressBarInterval, timerInterval;
var playTime = 10;
var rememberTime = 3;
var height = 5;
var width = 5;
var antiSolverMode = false;
var isOver = false;
var wrong = 0;
var lastPosition, bestRoute, goodPositions;
var colors = ["green", "red", "blue", "lightblue", "purple", "yellow"];
var shuffledNumbers;
var shuffledColors;

function hack() {
    hackInfoBox.style.display = 'none';
    hackFunction.style.display = 'none';
    hackFunction2.style.display = 'none';
    progressBarBox.style.display = 'none';
}

function startHack() {
    isOver = false;
    lastPosition = 0;
    wrong = 0;
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
    generateColors();
    createGrid();
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
    progressBarBox.style.display = 'block';
    progressBar('end', 9);
}

function gameOver() {
    hackFunction.style.display = 'none';
    hackTitleBox.style.display = 'none';
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
                hackTitleBox.style.display = '';
                hackTitle.textContent = 'Zapamiętaj';
                hackFunction2.style.display = '';
                hackInfoBox.style.display = 'none';
                progressBar('remember', rememberTime);
                return;
            }
            if(w === 'remember'){
                hackTitle.textContent = 'Dotrzyj z lewego górnego rogu, do prawego dolnego';
                hackInfoBox.style.display = 'none';
                hackFunction.style.display = '';
                hackFunction2.style.display = 'none';
                document.getElementById("close").addEventListener("click", gameOver);
                const squares = document.querySelectorAll('.square');
                setTimeout(() => {
                    squares.forEach((sqr) => {
                        if (!sqr.classList.contains('hidden') && !isOver) {
                            sqr.classList.add('hidden');
                        } else return;
                    })
                }, (playTime * 1000) / 2)
                progressBar('game', playTime);
                return;
            }
            if (w === 'game') {
                gameOver();
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

function createGrid() {
    hackFunction.innerHTML = '';

    let breathingPosition = 1;
    bestRoute = generateRoute(breathingPosition);
    goodPositions = Object.keys(bestRoute);

    for (let i = 0; i < height * width; i++) {
        const el = document.createElement('div');
        el.classList.add('square');

        el.dataset.pos = i.toString();

        let text, value, index;

        switch (i) {
            case 0: {
                text = 'START'
                break;
            }
            case 24: {
                text = 'EXIT';
                break;
            }
            case breathingPosition:
            case (breathingPosition * height): {
                el.classList.add('breathing');
                value = random(1, 5);
                index = shuffledNumbers.indexOf(value);
                text = `<div class='${shuffledColors[index]}'></div>`;
                break;
            }
            default: {
                value = random(1, 5);
                index = shuffledNumbers.indexOf(value);
                text = `<div class='${shuffledColors[index]}'></div>`;
            }
        }
        if (goodPositions.includes(i.toString())) {
            value = bestRoute[i];
            index = shuffledNumbers.indexOf(value);
            text = `<div class='${shuffledColors[index]}'></div>`;
        }

        el.innerHTML = text;
        el.dataset.value = value;
        hackFunction.appendChild(el)

        el.onclick = function () {
            const pos = parseInt(this.dataset.pos);

            if (pos === 0) return;

            if (isOver) return;

            if (lastPosition === 0) {
                const breathingEls = document.querySelectorAll('.breathing');
                const squares = document.querySelectorAll('.square');

                squares.forEach((sqr) => {
                    sqr.classList.add('hidden');
                })

                breathingEls.forEach((el) => {
                    el.classList.remove('breathing');
                })

                if (pos === breathingPosition || pos === breathingPosition * 5) {
                    lastPosition = pos;
                    this.classList.add('good');
                } else {
                    this.classList.add('bad');
                    wrong++;
                }
            } else {
                let jump = parseInt(document.querySelectorAll('.square')[lastPosition].dataset.value, 10);
                let maxV = maxVertical(lastPosition);
                let maxH = maxHorizontal(lastPosition);

                if (jump <= maxH && pos === lastPosition + jump) {
                    lastPosition = pos;
                    this.classList.add('good');
                } else if (jump <= maxV && pos === lastPosition + (jump * 5)) {
                    lastPosition = pos;
                    this.classList.add('good');
                } else {
                    wrong++;
                    this.classList.add('bad');
                }
            }

            if (wrong === 3) {
                isOver = true;
                document.querySelectorAll('.breathing').forEach((b) => b.classList.remove('breathing'));
                document.querySelectorAll('.square').forEach((s) => s.classList.remove('hidden'));
                let squares = document.querySelectorAll('.square');
                goodPositions.forEach(pos => {
                    squares[pos].classList.add('right-path');
                });
                progressBar('end', 9)
            }

            if (lastPosition === 24 && document.querySelectorAll('.square')[lastPosition].classList.contains('good')) {
                gameWin();
            }
        }
    }
}

function generateColors(){
  hackFunction2.innerHTML = "";

  let numbers = [1, 2, 3, 4];
  shuffledNumbers = shuffleArray(numbers);
  shuffledColors = shuffleArray(colors);
  const colorsArr = shuffledColors.slice(0, 4);

  for(let i = 0; i < numbers.length; i++) {
    const el = document.createElement('div');

    el.textContent = shuffledNumbers[i];
    el.classList.add("colorsquare", colorsArr[i]);
    hackFunction2.appendChild(el);
  }
}

function maxVertical(pos) {
    return Math.floor((24 - pos) / 5);
}

function maxHorizontal(pos) {
    let max = (pos + 1) % 5;
    if (max > 0) return 5 - max;
    else return 0;
}

function generateNextPosition(pos) {
    let maxV = maxVertical(pos);
    let maxH = maxHorizontal(pos);

    if (maxV === 0) {
        let newPosition = random(random(1, maxH), maxH);
        return [newPosition, pos + newPosition];
    }
    if (maxH === 0) {
        let newPosition = random(random(1, maxV), maxV);
        return [newPosition, pos + (newPosition * 5)];
    }
    if (random(1, 1000) % 2 === 0) {
        let newPosition = random(random(1, maxH), maxH);
        return [newPosition, pos + newPosition];
    } else {
        let newPosition = random(random(1, maxV), maxV);
        return [newPosition, pos + (newPosition * 5)];
    }
}

function generateRoute(startPos) {
    let route = [];
    if (random(1, 1000) % 2 === 0) {
        startPos *= 5;
    }
    while (startPos < 24) {
        let newPos = generateNextPosition(startPos);
        route[startPos] = newPos[0];
        startPos = newPos[1];
    }

    return route;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

$(document).ready(function () {

    $("#game-mode").on("change", function () {
        $(this).prop("checked") ? $("#mode").text("Włączony") : $("#mode").text("Wyłączony");
        $(this).prop("checked") ? antiSolverMode = true : antiSolverMode = false;
    })
    
    $(".start-hack").on("click", function() {
        let randomOperator = Math.random() < 0.5 ? "" : "-";

        if(antiSolverMode){
            $(".hack-box").css({
                "transform": `rotate(${randomOperator}${random(1,5)}deg) translate(${randomOperator}${random(80, 105)}px, ${randomOperator}${random(30,45)}px)`,
            });
        }else {
            $(".hack-box").css({
                "transform": `rotate(0deg) translate(0, 0)`,
            });
        }
    })
})
